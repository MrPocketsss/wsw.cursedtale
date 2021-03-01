import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
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

export default function Signup() {
  // set up style
  const classes = useStyles();
  // set up history
  const history = useHistory();

  // set up authentication
  const { signup } = useAuth();

  // set up component-level state
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [validEmail, setValidEmail] = useState(null);
  const [validPassword, setValidPassword] = useState(null);
  const [validConfirm, setValidConfirm] = useState(null);
  const [validForm, setValidForm] = useState(false);

  // regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;

  // help text
  const emailHelpText = 'Please enter a valid email address';
  const passwordHelpText =
    'Passwords must be at least 8 characters, and include at least one of the following: Uppercase letter, lowercase letter, number, and special character';
  const confirmHelpText = 'Passwords do not match';

  // handle input and validation
  function handleInput(input) {
    switch (input.id) {
      case 'email':
        setEmail(input.value);
        emailRegex.test(input.value) ? setValidEmail(true) : setValidEmail(false);
        break;
      case 'password':
        setPassword(input.value);
        passwordRegex.test(input.value) ? setValidPassword(true) : setValidPassword(false);
        break;
      case 'confirm':
        setConfirm(input.value);
        password === input.value ? setValidConfirm(true) : setValidConfirm(false);
        break;
      default:
        break;
    }
  }

  // toggle the button disabled property
  useEffect(() => {
    validEmail === true && validPassword === true && validConfirm === true
      ? setValidForm(true)
      : setValidForm(false);
  }, [validEmail, validPassword, validConfirm]);

  // form sending
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setValidForm(false);
      await signup(email, password);
      history.push('/');
    } catch {
      setError('Failed to create an account');
    }
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Sign Up
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
          <form className={classes.form} onSubmit={handleSubmit}>
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
              helperText={validEmail === null || validEmail ? '' : emailHelpText}
              error={validEmail === false}
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
              helperText={validPassword === null || validPassword ? '' : passwordHelpText}
              error={validPassword === false}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='confirm'
              label='Confirm Password'
              name='confirm'
              type='password'
              value={confirm}
              onChange={(e) => handleInput(e.target)}
              helperText={validConfirm === null || validConfirm ? '' : confirmHelpText}
              error={validConfirm === false}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={!validForm}
            >
              Sign Up
            </Button>
            <Grid container direction='row' justify='space-between' alignItems='center'>
              <Grid item>{'Already have an account?'}</Grid>
              <Grid item>
                <Link to='/login'>Log In</Link>
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
