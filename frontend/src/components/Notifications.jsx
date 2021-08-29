import React, {useContext} from 'react';
import {Button} from '@material-ui/core';

import {SocketIOContext} from '../context/SocketIOContext';

/**
 * Notification Component
 * @return {ReactComponent}
 */
export default function Notifications() {
  const {call, callAccepted, answerCall} = useContext(SocketIOContext);
  return (
    <div>
      {
        call.isReceivedCall && !callAccepted && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <h1>{call.name} is calling: </h1>
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
          </div>
        )
      }
    </div>
  );
}
