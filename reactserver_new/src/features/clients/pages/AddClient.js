// import react libraries
import React, { useState } from 'react';

// import modules
import LoopIcon from '@material-ui/icons/Loop';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// import project files
import useStyles from './styles';
import { createAgency } from '../clientSlice';

const getReferralCode = () => {
  const a = Math.random().toString(36).substr(2, 8).toUpperCase();
  const b = Math.random().toString(36).substr(2, 8).toUpperCase();
  return `${a}${b}`.match(/.{1,4}/g).join('-');
};

export default function AddClient() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const errorMessage = useSelector((state) => state.clients.errorMessage);
  const successMessage = useSelector((state) => state.clients.successMessage);
  const pending = useSelector((state) => state.clients.isPending);

  const [name, setName] = useState('');
  const [maxUsers, setMaxUsers] = useState(0);
  const [referralCode, setReferralCode] = useState(getReferralCode());
  const [validName, setValidName] = useState(null);
  const [validMaxUsers, setValidMaxUsers] = useState(null);
  const nameHelpText = 'Names must be at least 4 characters';
  const maxUserHelpText =
    'Maximum users should be a number. Use -1 for unlimited';

  const handleInput = (event) => {
    switch (event.target.id) {
      case 'name':
        setName(event.target.value);
        if (name.length > 4) setValidName(true);
        break;
      default:
        const value = parseInt(event.target.value);
        setMaxUsers(value);
        setValidMaxUsers(true);
        if (typeof value !== 'number') setValidMaxUsers(false);
        if (value < -1) setValidMaxUsers(false);

        break;
    }
  };
  const handleReferralCodeRefresh = () => {
    setReferralCode(getReferralCode());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length > 4) {
      dispatch(createAgency({ name, referral: referralCode, maxUsers }));
      setName('');
      setReferralCode(getReferralCode());
    }
  };

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Add a New Agency
          </Typography>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          {successMessage && <Alert severity='success'>{successMessage}</Alert>}
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              autoFocus
              id='name'
              label='Client Name'
              value={name}
              onChange={handleInput}
              helperText={validName === null || !validName ? nameHelpText : ''}
              error={validName === false}
            />
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='maxUsers'
              label='Maximum Concurrent Users'
              value={maxUsers}
              onChange={handleInput}
              type='number'
              helperText={maxUserHelpText}
              error={validMaxUsers === false}
            />
            <TextField
              variant='outlined'
              margin='normal'
              disabled
              fullWidth
              id='referralCode'
              value={referralCode}
              InputProps={{
                classes: {
                  input: classes.code,
                },
                endAdornment: (
                  <IconButton onClick={handleReferralCodeRefresh}>
                    <LoopIcon />
                  </IconButton>
                ),
              }}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              disabled={pending}
            >
              Add Client
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
