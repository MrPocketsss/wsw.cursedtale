// import react libraries
import React from "react";

// import modules
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useSelector } from "react-redux";
import { IconButton, Toolbar, Tooltip, Typography } from "@material-ui/core";

// import project files
import useStyles from "./styles";

export default function ReduxTableToolbar(props) {
  const classes = useStyles();
  const { currentTable } = props;
  const numSelected = useSelector(
    (state) => state.clients[currentTable].selected.length
  );
  const title = useSelector((state) => state.clients[currentTable].title);

  return (
    <Toolbar
      className={clsx(classes.toolbar, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          {title}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter List'>
          <IconButton aria-label='filter list'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
