// import react libraries
import React, { useEffect } from 'react';

// import modules
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

// import project files
import { ReduxTable } from '../../components/organisms';
import { fetchAgencies } from './clientSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    flex: 1,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('use effect triggered');
    // dispatch(fetchAgencies());
  }, [dispatch]);

  return (
    <div className={classes.page}>
      <ReduxTable currentTable='agencyList' />
    </div>
  );
}
