import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  // set up style
  const classes = useStyles();
  //set up history
  const history = useHistory();

  // set up authentication
  const { login } = useAuth();

  // set up component-level state
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // handle input and validation
  function handleInput(input) {
    switch (input.id) {
      case 'email':
        setEmail(input.value);
        break;
      case 'password':
        setPassword(input.value);
        break;
      default:
        break;
    }
  }

  // form sending
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      history.push('/');
    } catch {
      setError('Invalid username and/or password');
    }
    setLoading(false);
  }

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign In
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
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
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='password'
              label='Password'
              name='password'
              type='password'
              value={password}
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
              Sign In
            </Button>
            <Grid container direction='row' justify='space-between'>
              <Grid item>
                <Link to='/forgot-password'>Forgot Password?</Link>
              </Grid>
              <Grid item>
                <Grid container direction='column' alignItems='flex-end'>
                  <Grid item>{'Need an account?'}</Grid>
                  <Grid item>
                    <Link to='/signup'>Sign Up</Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
