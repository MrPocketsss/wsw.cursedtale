// import react libraries
import React, { useState } from 'react';

// import modules
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';

// import project files
import { signOut } from '../../features/auth/authSlice';
import useStyles from './styles';

export default function Navbar(props) {
  const { toggleTheme } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.currentUser.role);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
    toggleTheme();
  };

  const handleLogOut = () => {
    dispatch(signOut());
  };

  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'
        >
          <Grid item className={classes.links}>
            <Link to='/' className={classes.link} color='inherit'>
              <Typography variant='h4'>DIMS Mobile Demo Manager</Typography>
            </Link>
          </Grid>
          <Grid item className={classes.links}>
            {role === 'ADMIN' && (
              <Link to='/signup' className={classes.link} color='inherit'>
                Add User
              </Link>
            )}
            <Link to='/create-agency' className={classes.link} color='inherit'>
              New Agency
            </Link>
            <Link
              to='/'
              className={classes.link}
              onClick={handleLogOut}
              color='inherit'
            >
              Logout
            </Link>

            <IconButton
              aria-label='toggle dark mode'
              onClick={handleThemeChange}
            >
              {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
