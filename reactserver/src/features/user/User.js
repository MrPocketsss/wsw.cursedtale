// import react
import React from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// import material-ui
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Brightness7Icon from '@material-ui/icons/Brightness7'; // light
import Brightness4Icon from '@material-ui/icons/Brightness4'; // dark

// import project files
import { selectLights, setDark } from './userSlice';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.primary.contrastText,
  },
}));

export default function User() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const lights = useSelector(selectLights);

  const handleClick = () => {
    let bool = lights ? false : true;
    console.log(bool);
    dispatch(setDark(bool));
  };

  return (
    <IconButton aria-label='toggle light and dark theme' onClick={handleClick}>
      {lights ? (
        <Brightness4Icon className={classes.icon} />
      ) : (
        <Brightness7Icon className={classes.icon} />
      )}
    </IconButton>
  );
}
