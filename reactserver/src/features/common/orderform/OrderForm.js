// import react
import React, { useState } from 'react';

// import firestore
import OrdersDataService from '../../../firebase/useFirestore';

// import material-ui
import {
  Button,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

// import project files
import useStyles from './Style.js';

export default function OrderForm(props) {
  const classes = useStyles();
  const [orderNumber, setOrderNumber] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerSite, setCustomerSite] = useState('');
  const [orderType, setOrderType] = useState('');
  const [confirmType, setConfirmType] = useState([]);
  const [sentToCredit, setSentToCredit] = useState(false);

  const handleChecked = (checked) => {
    setSentToCredit(!sentToCredit);
  };

  const parseDate = () => {
    const now = new Date();
    const year = now.getFullYear().toString().substring(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const clearForm = () => {
    setOrderNumber('');
    setPoNumber('');
    setCustomerName('');
    setCustomerSite('');
    setOrderType('');
    setConfirmType([]);
  };

  const handleSelect = (event, from) => {
    switch (from) {
      case 'orderType':
        setOrderType(event.target.value === '$' ? '' : event.target.value);
        break;
      default:
        break;
    }
  };

  const handleMultiple = (event) => {
    setConfirmType(event.target.value.includes('$') ? [] : event.target.value);
    console.log(event.target.value);
  };

  const handleFormClose = () => {
    props.toggleOpen(false);
  };

  const handleFormSubmit = () => {
    const epoch = Date.now();
    const timestamp = parseDate();

    const newOrder = {
      orderNumber: orderNumber,
      createdOn: timestamp,
      createdOnEpoch: epoch,
      lastModified: timestamp,
      lastModifiedEpoch: epoch,
      specialConfirmation: confirmType.length > 0 ? confirmType : '',
      isActive: true,
      customer: {
        name: customerName,
        site: customerSite,
        PONumber: poNumber,
      },
      currentStatus: 'Pending Approval',
      status: [
        {
          title: 'Pending Approval',
          whenEpoch: epoch,
          when: timestamp,
          values: [
            {
              title: 'Credit Approved',
              whenEpoch: '',
              when: '',
              completed: false,
              creditType: '',
              creditValue: '',
            },
            {
              title: 'Manager Approved',
              whenEpoch: '',
              when: '',
              completed: false,
            },
            {
              title: 'Sent To Credit',
              when: sentToCredit === true ? timestamp : '',
              whenEpoch: sentToCredit === true ? epoch : '',
              completed: sentToCredit === true ? true : false,
            },
          ],
        },
        {
          title: 'Approved',
          when: '',
          whenEpoch: '',
          values: [
            {
              title: 'Customer Confirmation',
              confirmationType: '',
              completed: false,
              when: '',
              whenEpoch: '',
            },
            { title: 'Sent to WhatsApp', completed: false, when: '', whenEpoch: '' },
            { title: 'Sent to Print', completed: false, when: '', whenEpoch: '' },
            { title: 'Sent to Green Sand', completed: false, when: '', whenEpoch: '' },
            { title: 'Sent to Mesh Thread', completed: false, when: '', whenEpoch: '' },
          ],
        },
        {
          title: 'Archived',
          when: '',
          whenEpoch: '',
        },
      ],
      currentOrderType: orderType,
      notes: '',
    };

    OrdersDataService.create(newOrder)
      .then(() => console.log('created an item successfully'))
      .catch((err) => console.error(err));
    clearForm();
    props.toggleOpen(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <Typography variant='h4' align='center'>
          Order Form
        </Typography>
      </div>
      <form noValidate autoComplete='off' className={classes.body}>
        <div className={classes.column}>
          <TextField
            id='order-number'
            variant='filled'
            label='WSW Order Number'
            required
            margin='normal'
            tabIndex='1'
            autoFocus
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <TextField
            id='po-number'
            variant='filled'
            label='Customer PO Number'
            margin='normal'
            tabIndex='2'
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
          <div className={classes.row}>
            <Typography variant='subtitle1' align='left'>
              Sent To Credit:
            </Typography>
            <Checkbox
              checked={sentToCredit}
              onClick={(e) => handleChecked(e.target.checked)}
              className={classes.rowCheck}
            />
          </div>
        </div>
        <div className={classes.columnTwo}>
          <InputLabel id='order-type-select-label'>Order Type</InputLabel>
          <Select
            className={classes.select}
            labelId='order-type-select-label'
            value={orderType}
            onChange={(e) => handleSelect(e, 'orderType')}
            tabIndex='3'
          >
            <MenuItem className={classes.listItem} value='$'>
              <em>None</em>
            </MenuItem>
            <MenuItem className={classes.listItem} value='Add-On'>
              Add-On
            </MenuItem>
            <MenuItem className={classes.listItem} value='Back Order'>
              Back Order
            </MenuItem>
            <MenuItem className={classes.listItem} value='Delivery'>
              Delivery
            </MenuItem>
            <MenuItem className={classes.listItem} value='Pick Up and Count'>
              Pick Up and Count
            </MenuItem>
            <MenuItem className={classes.listItem} value='Price Quote'>
              Price Quote
            </MenuItem>
            <MenuItem className={classes.listItem} value='Special'>
              Special
            </MenuItem>
            <MenuItem className={classes.listItem} value='Will Call'>
              Will Call
            </MenuItem>
          </Select>
          <InputLabel id='multi-select'>Confirmations</InputLabel>
          <Select
            className={classes.select}
            labelId='multi-select'
            value={confirmType}
            onChange={handleMultiple}
            multiple
            tabIndex='4'
          >
            <MenuItem className={classes.listItem} value='$'>
              <em>None</em>
            </MenuItem>
            <MenuItem className={classes.listItem} value='Green Sand'>
              Green Sand
            </MenuItem>
            <MenuItem className={classes.listItem} value='Mesh Thread'>
              Mesh Thread
            </MenuItem>
          </Select>
        </div>
        <div className={classes.column}>
          <TextField
            id='customer-1'
            variant='filled'
            label='Customer Name'
            required
            margin='normal'
            tabIndex='6'
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            id='customer-2'
            variant='filled'
            label='Customer Site'
            margin='normal'
            tabIndex='7'
            value={customerSite}
            onChange={(e) => setCustomerSite(e.target.value)}
          />
        </div>
      </form>
      <div className={classes.actions}>
        <Button onClick={handleFormClose}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={handleFormSubmit}>
          Track Order
        </Button>
      </div>
    </div>
  );
}
