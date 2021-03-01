// import react libraries
import React, { useEffect, useState } from 'react';

// import modules
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

// import project files
import useStyles from './styles';
import { Copyright } from '../../components/atoms';
import { signIn, unsetMessages } from './authSlice';

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const loading = useSelector((state) => state.auth.isPending);
  const success = useSelector((state) => state.auth.successMessage);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signIn({ email, password }));
  };
  const handleInput = (event) => {
    switch (event.target.id) {
      case 'email':
        setEmail(event.target.value);
        break;
      default:
        setPassword(event.target.value);
        break;
    }
  };

  // if we are leaving the page, remove all messages
  useEffect(() => {
    return function cleanup() {
      dispatch(unsetMessages());
    };
  });
  // if we successfully log in, transfer page
  useEffect(() => {
    if (success && success === 'logged in') {
      history.push('/');
    }
    if (currentUser) {
      history.push('/');
    }
  }, [currentUser, history, success]);

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign In
          </Typography>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
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
              onChange={handleInput}
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
              onChange={handleInput}
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
                <Link to='/forgot' className={classes.link} color='inherit'>
                  Forgot Password?
                </Link>
              </Grid>
              <Grid item>
                <Grid container direction='column' alignItems='flex-end'>
                  <Grid item>{'Need an account?'}</Grid>
                  <Grid item>{`Contact the admin`}</Grid>
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
