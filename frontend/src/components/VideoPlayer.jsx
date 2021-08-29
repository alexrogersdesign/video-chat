import React, {useContext} from 'react';
import {Grid, Typography, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

/**
 * Renders a video stream
 * @return {React.FC}
 */
export default function VideoPlayer() {
  const {
    call,
    callAccepted,
    callEnded,
    currentUserVideo,
    externalUserVideo,
    currentUserStream,
    currentUserName,
  } = useContext(SocketIOContext);
  const classes = useStyles();
  return (
    <Grid container className={classes.gridContainer}>
      {/* Current user video */}
      {
        currentUserStream && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {currentUserName || 'User Name'}
              </Typography>
              <video
                className={classes.video}
                playsInline
                muted
                // eslint-disable-next-line react/no-string-refs
                ref={currentUserVideo}
                autoPlay
              />
            </Grid>
          </Paper>
        )
      }
      {/* External user video */}
      {
        callAccepted && !callEnded && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {call.name}
              </Typography>
              <video
                className={classes.video}
                playsInline
                ref={externalUserVideo}
                autoPlay
              />
            </Grid>
          </Paper>
        )
      }
    </Grid>
  );
}
