import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Container, CssBaseline, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../common/Copyright';
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  center: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ForgotPassword() {
  // set up style
  const classes = useStyles();

  // set up authentication
  const { resetPassword } = useAuth();

  // set up component-level state
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // handle input and validation
  function handleInput(input) {
    setEmail(input.value);
  }

  // form sending
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions');
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  }

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Password Reset
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
          {message && <Alert severity='success'>{message}</Alert>}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              autoFocus
              autoComplete='email'
              id='email'
              label='Email Address'
              name='email'
              value={email}
              onChange={(e) => handleInput(e.target)}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={loading}
            >
              Reset Password
            </Button>
            <Typography align='center' variant='body2'>
              <Link to='/login'>Login</Link>
            </Typography>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
