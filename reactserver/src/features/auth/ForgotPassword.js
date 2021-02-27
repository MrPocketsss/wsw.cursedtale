// import react libraries
import React, { useEffect, useState } from 'react';

// import modules
import Alert from '@material-ui/lab/Alert';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@material-ui/core';
import { Copyright } from '../../components/atoms';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import project files
import useStyles from './styles';
import { forgotPassword, resetPassword } from './authSlice';

export default function ForgotPassword() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.isPending);
  const error = useSelector((state) => state.auth.errorMessage);
  const message = useSelector((state) => state.auth.successMessage);

  const passwordRegex = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
  const passwordHelpText =
    'Passwords must be at least 8 characters, and include at least one of the following: Uppercase letter, lowercase letter, number, and special character';
  const confirmHelpText = 'Passwords do not match';

  const [form, setForm] = useState('forgot');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validPassword, setValidPassword] = useState(null);
  const [validConfirm, setValidConfirm] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form === 'forgot') {
      dispatch(forgotPassword(email));
      setEmail('');
    } else if (form === 'reset') {
      dispatch(resetPassword({ token, password }));
      setToken('');
      setPassword('');
      setConfirmPassword('');
      setValidPassword(null);
      setValidConfirm(null);
    }
  };
  const handleInput = (event) => {
    console.log('input: ', event.target.id);
    switch (event.target.id) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'token':
        setToken(event.target.value);
        break;
      case 'password':
        console.log('password: ', event.target.value);
        setPassword(event.target.value);
        setValidPassword(passwordRegex.test(event.target.value) ? true : false);
        break;
      case 'confirmPassword':
        console.log('confirmPassword: ', event.target.value);
        setConfirmPassword(event.target.value);
        setValidConfirm(password === event.target.value ? true : false);
        break;
      default:
        break;
    }
  };

  const forgotForm = (
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
        <Link to='/signin' className={classes.link} color='inherit'>
          Sign In
        </Link>
      </Typography>
    </form>
  );
  const resetForm = (
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        autoFocus
        id='token'
        label='Reset Token'
        name='token'
        value={token}
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
        helperText={
          validPassword === null || validPassword ? '' : passwordHelpText
        }
        error={validPassword === false}
      />
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id='confirmPassword'
        label='Confirm Password'
        name='confirmPassword'
        type='password'
        value={confirmPassword}
        onChange={handleInput}
        helperText={
          validConfirm === null || validConfirm ? '' : confirmHelpText
        }
        error={validConfirm === false}
      />
      <Button
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
        className={classes.submit}
        disabled={!(validPassword && validConfirm)}
      >
        Password Reset
      </Button>
      <Typography align='center' variant='body2'>
        <Link to='/signin' className={classes.link} color='inherit'>
          Sign In
        </Link>
      </Typography>
    </form>
  );

  useEffect(() => {
    if (form === 'forgot') {
      setForm(message && message.length > 0 ? 'reset' : 'forgot');
    }
  }, [message]);

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Password Reset
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
          {message && <Alert severity='success'>{message}</Alert>}
          {form === 'forgot' ? forgotForm : resetForm}
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
