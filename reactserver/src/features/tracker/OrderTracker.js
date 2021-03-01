// import React
import React, { useState } from 'react';

// import material-ui
import { Fab, Modal, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

// import project files
import useStyles from './Style';
import OrderForm from '../common/orderform/OrderForm';
import TabController from './Tabs';

export default function OrderTracker() {
  const classes = useStyles();

  // handles the new order modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className={classes.modalContent}>
      <OrderForm toggleOpen={setOpen} />
    </div>
  );

  return (
    <div>
      <Fab className={classes.fab} color='primary' aria-label='add' onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Paper className={classes.container}>
        <TabController />
      </Paper>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
}
