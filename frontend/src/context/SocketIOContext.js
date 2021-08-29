import React, {createContext, useState, useRef, useEffect} from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

/**
 * Context item to be passed to app
 */
const SocketIOContext = createContext();

/**
 * SocketIO server instance
 * URL of deplyed server goes here
 */
const socket = io('http://localhost:5000');

const ContextProvider = ({children}) => {
  const [currentUserStream, setCurrentUserStream] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');

  const currentUserVideo = useRef(null);
  const externalUserVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    /**
         * Gets video and audio stream from user, asks for permissions.
         * Sets the webcam stream to ref object
         */
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
            {video: true, audio: true},
        );
        setCurrentUserStream(stream);
        currentUserVideo.current.srcObject = stream;
      } catch (err) {
        console.log(err);
      }
    };
    getUserMedia();
    // navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // })
    //     .then((mediaStream) => {
    //       setCurrentUserStream(mediaStream);
    //       currentUserVideo.current.srcObject = mediaStream;
    //     });

    /**
         * Retrieve current user id from socket
         */
    socket.on('currentUser', (id) => setCurrentUser(id));

    /**
         * Retrieve call data
         * name - name of external user who is calling
         * from - who the call is coming from
         * signal - quality of the call
         * isReceivedCall - whether a call is being received or being answered
         */
    socket.on('callexternaluser', ({from, name: callerName, signal}) => {
      setCall({isReceivedCall: true, from, name: callerName, signal});
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    /**
         * A peer object representing the current user
         */
    const peer = new Peer({intiator: false, trickle: false, currentUserStream});

    /**
         * Eventhandler for when a signal event is recieved from WebRTC
         */
    peer.on('signal', (data) => {
      socket.emit('answercall', {signal: data, externalUser: call.from});
    });

    /**
         * Eventhandler for when a stream is recieved from WebRTC
         * then stores stream in ref
         */
    peer.on('stream', (externalUserStream) => {
      externalUserVideo.current.srcObject = externalUserStream;
    });

    /**
         * Set peer call signal quality
         */
    peer.signal(call.signal);

    /**
         * Sets peer to the current connection
         */
    connectionRef.current = peer;
  };

  const initiateCall = (id) => {
    /**
         * A peer object representing the current user
         */
    const peer = new Peer({intiator: true, trickle: false, currentUserStream});

    /**
         * Eventhandler for when a signal event is recieved from WebRTC
         */
    peer.on('signal', (data) => {
      socket.emit('initiatecall',
          {externalUser: id,
            signalData: data,
            from: currentUser,
            currentUserName});
    });

    /**
         * Eventhandler for when an external user stream is recieved from WebRTC
         * then stores stream in ref
         */
    peer.on('stream', (externalUserStream) => {
      externalUserVideo.current.srcObject = externalUserStream;
    });
    /**
     * Socket eventhandler for an answer call event
     * sets WebRTC signal to signal value
     */
    socket.on('answercall', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  /**
   * Destroys connection ref and reloads page
   */
  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };
  return (
    <SocketIOContext.Provider value={{
      call,
      callAccepted,
      callEnded,
      currentUserVideo,
      externalUserVideo,
      currentUserStream,
      currentUserName,
      currentUser,
      setCurrentUserName,
      initiateCall,
      leaveCall,
      answerCall,
    }}>
      {children}
    </SocketIOContext.Provider>
  );
};

export {ContextProvider, SocketIOContext};
