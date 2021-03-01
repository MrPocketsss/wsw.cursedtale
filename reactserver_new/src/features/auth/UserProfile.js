// import react libraries
import React, { useEffect, useState } from 'react';

// import modules
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, TextField, Typography } from '@material-ui/core';

// import project files
import useStyles from './styles';
import { signUp } from './authSlice';

export default function UserProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.currentUser.email);
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const loading = useSelector((state) => state.auth.isPending);
  const successMessage = useSelector((state) => state.auth.successMessage);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [validPassword, setValidPassword] = useState(null);
  const [validConfirm, setValidConfirm] = useState(null);
  const [validForm, setValidForm] = useState(false);

  // regex
  const passwordRegex = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;

  // help text
  const passwordHelpText =
    'Passwords must be at least 8 characters, and include at least one of the following: Uppercase letter, lowercase letter, number, and special character';
  const confirmHelpText = 'Passwords do not match';

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signUp({ password }));
    setPassword('');
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
      default:
        break;
    }
  };

  useEffect(() => {
    setValidForm(
      validPassword === true && validConfirm === true ? true : false
    );
  }, [validConfirm, validPassword]);

  return (
    <div className={classes.center}>
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            User Profile
          </Typography>
          <Typography variant='subtitle1'>
            If you wish to update your password, enter the new password below.
          </Typography>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          {successMessage && <Alert severity='success'>{successMessage}</Alert>}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant='outlined'
              margin='normal'
              disabled
              fullWidth
              autoFocus
              autoComplete='email'
              id='email'
              label='Email Address'
              name='email'
              value={email}
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
