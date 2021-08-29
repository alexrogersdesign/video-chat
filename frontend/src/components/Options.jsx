import React, {useContext, useState} from 'react';
import {
  Button,
  Grid,
  Typography,
  TextField,
  Container,
  Paper,
} from '@material-ui/core';
import {Phone, Assignment, PhoneDisabled} from '@material-ui/icons';
import {makeStyles} from '@material-ui/core/styles';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {SocketIOContext} from '../context/SocketIOContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
}));

/**
 * @param {React.Childrem} children
 * @return {React.FC}
 */
export default function Options( {children}) {
  const {
    callAccepted,
    callEnded,
    initiateCall,
    currentUserName,
    setCurrentUserName,
    currentUser,
    leaveCall,
  } = useContext(SocketIOContext);
  const [idToCall, setIdToCall] = useState('');
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={10}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid className={classes.gridContainer} container>
            <Grid item className={classes.padding} xs={12} md={6}>
              <Typography gutterBottom variant="h6">
                Acount Info
              </Typography>
              <TextField
                fullWidth
                label="User Name"
                value={currentUserName}
                onChange={({target}) => setCurrentUserName(target.value)}
              />
              <CopyToClipboard className={classes.margin} text={currentUser}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item className={classes.padding} xs={12} md={6}>
              <Typography gutterBottom variant="h6">
                Make a call
              </Typography>
              <TextField
                fullWidth
                label="ID to Call"
                value={idToCall}
                onChange={({target}) => setIdToCall(target.value)}
              />
              {
                callAccepted && !callEnded ? (
                  <Button
                    fullWidth
                    className={classes.margin}
                    variant="contained"
                    color="secondary"
                    startIcon={<PhoneDisabled fontSize="large"/>}
                    onClick={leaveCall}
                  >
                    Hang Up
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    className={classes.margin}
                    variant="contained"
                    color="primary"
                    startIcon={<Phone fontSize="large"/>}
                    onClick={() => initiateCall(idToCall)}
                  >
                    Call
                  </Button>
                )
              }
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
}
