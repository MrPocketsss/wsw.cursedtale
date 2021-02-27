// import react libraries
import React, { useEffect, useState } from 'react';

// import modules
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, TextField, Typography } from '@material-ui/core';

// import project files
import useStyles from './styles';
import { signUp } from './authSlice';

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const loading = useSelector((state) => state.auth.isPending);
  const successMessage = useSelector((state) => state.auth.successMessage);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('');
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

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signUp({ email, password, role: role.toUpperCase() }));
  };
  const handleInput = (event) => {
    switch (event.target.id) {
      case 'password':
        setPassword(event.target.value);
        setValidPassword(passwordRegex.test(event.target.value) ? true : false);
        break;
      case 'confirm':
        setConfirm(event.target.value);
        setValidConfirm(password === event.target.value ? true : false);
        break;
      case 'role':
        setRole(event.target.value);
        break;
      default:
        setEmail(event.target.value);
        setValidEmail(emailRegex.test(event.target.value) ? true : false);
        break;
    }
  };

  useEffect(() => {
    setValidForm(
      validEmail === true && validPassword === true && validConfirm === true
        ? true
        : false
    );
  }, [validConfirm, validEmail, validPassword]);

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Register User
          </Typography>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          {successMessage && <Alert severity='success'>{successMessage}</Alert>}
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
              helperText={
                validEmail === null || validEmail ? '' : emailHelpText
              }
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
              id='confirm'
              label='Confirm Password'
              name='confirm'
              type='password'
              value={confirm}
              onChange={handleInput}
              helperText={
                validConfirm === null || validConfirm ? '' : confirmHelpText
              }
              error={validConfirm === false}
            />
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='role'
              label='User Role'
              name='role'
              type='text'
              value={role}
              onChange={handleInput}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={!validForm || loading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
