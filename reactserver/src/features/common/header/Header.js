// import react
import React from 'react';

// import material-ui
import { AppBar, Toolbar, Typography } from '@material-ui/core';

// import project files
import useStyles from './Style';
import User from '../../user/User';

export default function Header() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position='static'>
        <Toolbar className={classes.container}>
          <Typography variant='h4' align='center' className={classes.centered}>
            Order Tracker
          </Typography>
          <User />
        </Toolbar>
      </AppBar>
    </div>
  );
}
