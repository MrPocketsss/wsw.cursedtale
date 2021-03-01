// import react
import React, { useState } from 'react';

// import material-ui
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// import project files
import OrdersDataService from '../../firebase/useFirestore';

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    padding: '2rem 4rem',
    display: 'flex',
  },
  center: {},
  editField: {
    cursor: 'pointer',
  },
  notes: {
    width: '100%',
    height: '22vh',
    padding: '1rem',
    overflowY: 'auto',
    border: '1px solid #888888',
    borderRadius: '4px',
    '&:hover': {
      border: '1px solid #dddddd',
    },
  },
  orderSections: {
    display: 'flex',
    flexFlow: ' column nowrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexGrow: 1,
    margin: '0 1rem',
    overflow: 'hidden',
    '& > div': {
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[700],
      width: '100%',
      overflow: 'hidden',
    },
    '& > div:nth-child(1)': {
      height: '50vh',
    },
    '& > div:nth-child(2)': {
      minHeight: '33vh',
    },
  },
  row: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: { width: '12rem' },
  right: { width: '12rem' },
  select: {
    width: '6rem',
  },
  spacer: {
    width: '1rem',
  },
}));

export default function OrderDetails(props) {
  const classes = useStyles();
  const key = props.order.key;
  const order = props.order.data;

  // all the form states
  const [editOrderNumber, setEditOrderNumber] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [editCurrentOrderType, setEditCurrentOrderType] = useState(false);
  const [currentOrderType, setCurrentOrderType] = useState('');
  const [editCreditType, setEditCreditType] = useState(false);
  const [creditType, setCreditType] = useState('');
  const [editCreditValue, setEditCreditValue] = useState(false);
  const [creditValue, setCreditValue] = useState('');
  const [editCustomerName, setEditCustomerName] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [editCustomerSite, setEditCustomerSite] = useState(false);
  const [customerSite, setCustomerSite] = useState('');
  const [editPONumber, setEditPONumber] = useState(false);
  const [poNumber, setPONumber] = useState('');
  const [editCustomerConfirmation, setEditCustomerConfirmation] = useState(false);
  const [customerConfirmation, setCustomerConfirmation] = useState('');
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [editSpecialConfirmType, setEditSpecialConfirmType] = useState(false);
  const [confirmType, setConfirmType] = useState([]);

  const handleClickText = (event, el) => {
    switch (el) {
      case 'orderNumber':
        setOrderNumber(order.orderNumber);
        setEditOrderNumber(!editOrderNumber);
        break;
      case 'creditType':
        setCreditType(order.status[0].values[0].creditType);
        setEditCreditType(!editCreditType);
        break;
      case 'creditValue':
        setCreditValue(order.status[0].values[0].creditValue);
        setEditCreditValue(!editCreditValue);
        break;
      case 'currentOrderType':
        setCurrentOrderType(order.currentOrderType);
        setEditCurrentOrderType(!editCurrentOrderType);
        break;
      case 'customerName':
        setCustomerName(order.customer.name);
        setEditCustomerName(!editCustomerName);
        break;
      case 'customerSite':
        setCustomerSite(order.customer.site);
        setEditCustomerSite(!editCustomerSite);
        break;
      case 'poNumber':
        setPONumber(order.customer.PONumber);
        setEditPONumber(!editPONumber);
        break;
      case 'specialConfirmType':
        setConfirmType(order.specialConfirmation);
        setEditSpecialConfirmType(!editSpecialConfirmType);
        break;
      case 'customerConfirmation':
        setCustomerConfirmation(order.status[1].values[0].confirmationType);
        setEditCustomerConfirmation(!editCustomerConfirmation);
        break;
      case 'notes':
        setNotes(order.notes);
        setEditNotes(!editNotes);
        break;
      default:
        break;
    }
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      switch (event.target.id) {
        case 'order-number':
          setEditOrderNumber(!editOrderNumber);
          updateValue('orderNumber', orderNumber);
          break;
        case 'credit-value':
          setEditCreditValue(!editCreditValue);
          updateValue('creditValue', creditValue);
          break;
        case 'customer-name':
          setEditCustomerName(!editCustomerName);
          updateValue('customerName', customerName);
          break;
        case 'customer-site':
          setEditCustomerSite(!editCustomerSite);
          updateValue('customerSite', customerSite);
          break;
        case 'po-number':
          setEditPONumber(!editPONumber);
          updateValue('customerPONumber', poNumber);
          break;
        case 'notes':
          if (!event.shiftKey) {
            setEditNotes(!editNotes);
            updateValue('notes', notes);
          }
          break;
        default:
          break;
      }
    }
  };

  const handleChecked = (checked, status, type) => {
    const epoch = Date.now();
    const timestamp = parseDate();
    // key is order key
    // status is the current status of the order
    // type is which checkbox was checked (credit, manager)
    switch (status) {
      case 'Pending Approval':
        const credit = order.status[0].values[0];
        const manager = order.status[0].values[1];
        const sentToCredit = order.status[0].values[2];
        if (type === 'Credit Approved') {
          credit.completed = checked ? true : false;
          credit.when = timestamp;
          credit.whenEpoch = epoch;
        } else if (type === 'Manager Approved') {
          manager.completed = checked ? true : false;
          manager.when = timestamp;
          manager.whenEpoch = epoch;
        } else if (type === 'Sent To Credit') {
          sentToCredit.completed = checked ? true : false;
          sentToCredit.when = timestamp;
          sentToCredit.whenEpoch = epoch;
        }
        if (credit.completed === true && manager.completed === true) {
          order.currentStatus = 'Approved';
          order.status[1].when = timestamp;
          order.status[1].whenEpoch = epoch;
        } else {
          order.currentStatus = 'Pending Approval';
          order.status[0].when = timestamp;
          order.status[0].whenEpoch = epoch;
        }
        break;
      case 'Approved':
        const specialConfirmation = order.specialConfirmation;
        const customerConfirm = order.status[1].values[0].completed;
        const whatsApp = order.status[1].values[1];
        const print = order.status[1].values[2];
        const greenSands = order.status[1].values[3];
        const meshThread = order.status[1].values[4];
        const archiveDate = order.status[2];

        switch (type) {
          case 'Sent to WhatsApp':
            whatsApp.when = timestamp;
            whatsApp.whenEpoch = epoch;
            whatsApp.completed = checked ? true : false;
            break;
          case 'Sent to Print':
            print.when = timestamp;
            print.whenEpoch = epoch;
            print.completed = checked ? true : false;
            break;
          case 'Sent to Green Sand':
            greenSands.when = timestamp;
            greenSands.whenEpoch = epoch;
            greenSands.completed = checked ? true : false;
            break;
          case 'Sent to Mesh Thread':
            meshThread.when = timestamp;
            meshThread.whenEpoch = epoch;
            meshThread.completed = checked ? true : false;
            break;
          default:
            break;
        }

        if (
          customerConfirm === true &&
          whatsApp.completed === true &&
          print.completed === true &&
          ((specialConfirmation.includes('Green Sand') && greenSands.completed === true) ||
            !specialConfirmation.includes('Green Sand')) &&
          ((specialConfirmation.includes('Mesh Thread') && meshThread.completed === true) ||
            !specialConfirmation.includes('Mesh Thread'))
        ) {
          order.currentStatus = 'Archived';
          archiveDate.when = timestamp;
          archiveDate.whenEpoch = epoch;
        } else {
          order.currentStatus = 'Approved';
          order.status[1].when = timestamp;
          order.status[1].whenEpoch = epoch;
        }
        break;
      default:
        break;
    }
    order.lastModified = timestamp;
    order.lastModifiedEpoch = epoch;

    OrdersDataService.update(key, order);
  };

  const handleSelect = (event, element) => {
    const newValue = event.target.value === '$' ? '' : event.target.value;
    switch (element) {
      case 'credit-approval-type':
        updateValue('creditType', newValue);
        break;
      case 'current-order-type':
        updateValue('currentOrderType', newValue);
        break;
      case 'credit-approval-types':
        console.log('updating value for credit approval types with: ', newValue);
        updateValue('creditType', newValue);
        break;
      case 'customer-confirmation':
        updateValue('customerConfirmation', newValue);
        break;
      default:
        break;
    }
  };

  const handleMultiple = (event) => {
    const actualValue = event.target.value.includes('$') ? [] : event.target.value;
    setConfirmType(actualValue);
    updateValue('specialConfirmation', actualValue);
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

  const updateValue = (orderProp, newValue) => {
    let updateFlag = false;
    const epoch = Date.now();
    const timestamp = parseDate();

    switch (orderProp) {
      case 'creditCompleted': //checkbox
        if (order.status[0].values[0].completed !== newValue) {
          updateFlag = true;
          order.status[0].values[0].completed = newValue;
          order.status[0].values[0].when = timestamp;
        }
        break;
      case 'creditType': // select
        console.log('made it to updateValue');
        if (order.status[0].values[0].creditType !== newValue) {
          updateFlag = true;
          order.status[0].values[0].creditType = newValue;
          setCreditType(newValue);
        }
        break;
      case 'creditValue': // textField
        if (order.status[0].values[0].creditValue !== newValue) {
          updateFlag = true;
          order.status[0].values[0].creditValue = newValue;
          setCreditValue(newValue);
        }
        break;
      case 'currentOrderType': // select
        if (order.currentOrderType !== newValue) {
          updateFlag = true;
          order.currentOrderType = newValue;
          setCurrentOrderType(newValue);
        }
        break;
      case 'customerName': // string
        if (order.customer.name !== newValue) {
          updateFlag = true;
          order.customer.name = newValue;
          setCustomerName(newValue);
        }
        break;
      case 'customerSite': // string
        if (order.customer.site !== newValue) {
          updateFlag = true;
          order.customer.site = newValue;
          setCustomerSite(newValue);
        }
        break;
      case 'customerPONumber': // string
        if (order.customer.poNumber !== newValue) {
          updateFlag = true;
          order.customer.PONumber = newValue;
          setPONumber(newValue);
        }
        break;
      case 'customerConfirmation': // select
        if (order.status[1].values[0].confirmationType !== newValue) {
          const specialConfirmation = order.specialConfirmation;
          const customerConfirm = order.status[1].values[0];
          const whatsApp = order.status[1].values[1];
          const print = order.status[1].values[2];
          const greenSands = order.status[1].values[3];
          const meshThread = order.status[1].values[4];

          updateFlag = true;

          customerConfirm.completed = newValue.length > 1 ? true : false;
          customerConfirm.confirmationType = newValue;
          customerConfirm.when = timestamp;
          customerConfirm.whenEpoch = epoch;

          setCustomerConfirmation(newValue);

          if (
            customerConfirm.completed === true &&
            whatsApp.completed === true &&
            print.completed === true &&
            ((specialConfirmation.includes('Green Sand') && greenSands.completed === true) ||
              !specialConfirmation.includes('Green Sand')) &&
            ((specialConfirmation.includes('Mesh Thread') && meshThread.completed === true) ||
              !specialConfirmation.includes('Mesh Thread'))
          ) {
            order.currentStatus = 'Archived';
          } else {
            order.currentStatus = 'Approved';
          }
        }
        break;
      case 'isActive': // boolean (button)
        order.isActive = false;
        updateFlag = true;
        break;
      case 'managerCompleted': // checkbox
        if (order.status[0].values[1].completed !== newValue) {
          updateFlag = true;
          order.status[0].values[1].completed = newValue;
          order.status[0].values[1].when = timestamp;
        }
        break;
      case 'notes': // string
        if (order.notes !== newValue) {
          updateFlag = true;
          order.notes = newValue;
          setNotes(newValue);
        }
        break;
      case 'orderNumber': // string
        if (order.orderNumber !== newValue) {
          updateFlag = true;
          setOrderNumber(order.orderNumber);
          order.orderNumber = newValue;
        }
        break;
      case 'sentToWhatsApp': // checkbox
        if (order.status[1].values[1].completed !== newValue) {
          updateFlag = true;
          order.status[1].values[1].completed = newValue;
          order.status[1].values[1].when = timestamp;
        }
        break;
      case 'sentToPrint': // checkbox
        if (order.status[1].values[2].completed !== newValue) {
          updateFlag = true;
          order.status[1].values[2].completed = newValue;
          order.status[1].values[2].when = timestamp;
        }
        break;
      case 'sentToGreenSand': // checkbox
        if (order.status[1].values[3].completed !== newValue) {
          updateFlag = true;
          order.status[3].values[3].completed = newValue;
          order.status[3].values[3].when = timestamp;
        }
        break;
      case 'sentToMeshThread': // checkbox
        if (order.status[1].values[4].completed !== newValue) {
          updateFlag = true;
          order.status[1].values[4].completed = newValue;
          order.status[1].values[4].when = timestamp;
        }
        break;
      case 'specialConfirmation': // multiple select
        if (order.specialConfirmation.length !== newValue.length) {
          updateFlag = true;
          order.specialConfirmation = newValue;
          setConfirmType(newValue);
        }
        break;
      default:
        break;
    }

    if (updateFlag) {
      order.lastModified = timestamp;
      order.lastModifiedEpoch = epoch;
      console.log('final order to update: ', order);
      OrdersDataService.update(key, order);
    }
  };

  return (
    <div className={classes.container}>
      <section className={classes.orderSections}>
        <Card>
          <CardHeader title='Order Information' />
          <CardContent>
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'orderNumber')}>
              {editOrderNumber ? (
                <TextField
                  id='order-number'
                  variant='filled'
                  label='WSW Order Number'
                  margin='dense'
                  tabIndex='1'
                  autoFocus
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={handleEnter}
                  onBlur={(e) => handleClickText(e, 'orderNumber')}
                />
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Order Number:</Typography>
                  <Typography>{order.orderNumber}</Typography>
                </div>
              )}
            </div>
            <div className={classes.row}>
              <Typography variant='subtitle1'>Created On:</Typography>
              <Typography>{order.createdOn}</Typography>
            </div>
            <div
              className={classes.editField}
              onClick={(e) => handleClickText(e, 'currentOrderType')}
            >
              {editCurrentOrderType ? (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Order Type:</Typography>
                  <Select
                    className={classes.select}
                    value={currentOrderType}
                    onChange={(e) => handleSelect(e, 'current-order-type')}
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
                </div>
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Order Type:</Typography>
                  <Typography>{order.currentOrderType}</Typography>
                </div>
              )}
            </div>

            <div className={classes.row}>
              <Typography variant='subtitle1'>Current Status:</Typography>
              <Typography>{order.currentStatus}</Typography>
            </div>
            <div className={classes.row}>
              <Typography variant='subtitle1'>Last Modified:</Typography>
              <Typography>{order.lastModified}</Typography>
            </div>
            <div className={classes.row}>
              <Typography variant='subtitle1'>Active Record:</Typography>
              <Typography>{order.isActive.toString()}</Typography>
            </div>
            <Divider />
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'creditType')}>
              {editCreditType ? (
                <div className={classes.row}>
                  <InputLabel id='credit-approval-types-label'>Credit Approval Types</InputLabel>
                  <Select
                    className={classes.select}
                    labelId='credit-approval-types-label'
                    value={creditType}
                    onChange={(e) => handleSelect(e, 'credit-approval-types')}
                    tabIndex='5'
                  >
                    <MenuItem className={classes.listItem} value='$'>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem className={classes.listItem} value='Regular'>
                      Regular
                    </MenuItem>
                    <MenuItem className={classes.listItem} value='ACH'>
                      ACH
                    </MenuItem>
                    <MenuItem className={classes.listItem} value='Check'>
                      Check for $
                    </MenuItem>
                    <MenuItem className={classes.listItem} value='Hold'>
                      Hold
                    </MenuItem>
                    <MenuItem className={classes.listItem} value='Check on Delivery'>
                      Check on Delivery
                    </MenuItem>
                  </Select>
                </div>
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Credit Approval Type:</Typography>
                  <Typography>{order.status[0].values[0].creditType}</Typography>
                </div>
              )}
            </div>
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'creditValue')}>
              {editCreditValue ? (
                <div className={classes.row}>
                  <TextField
                    id='credit-value'
                    variant='filled'
                    label='Credit Value'
                    margin='dense'
                    tabIndex='1'
                    autoFocus
                    value={creditValue}
                    onChange={(e) => setCreditValue(e.target.value)}
                    onKeyDown={handleEnter}
                    onBlur={(e) => handleClickText(e, 'creditValue')}
                  />
                </div>
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Credit Value:</Typography>
                  <Typography>${order.status[0].values[0].creditValue}</Typography>
                </div>
              )}
            </div>
            <Divider />
            <div
              className={classes.editField}
              onClick={(e) => handleClickText(e, 'specialConfirmType')}
            >
              {editSpecialConfirmType ? (
                <div className={classes.row}>
                  <InputLabel id='multi-select'>Confirmation Choices</InputLabel>
                  <Select
                    className={classes.select}
                    labelId='multi-select'
                    value={confirmType}
                    onChange={handleMultiple}
                    multiple
                    autoFocus
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
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Confirmation Options:</Typography>
                  <Typography>{order.specialConfirmation}</Typography>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='Customer Information' />
          <CardContent>
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'customerName')}>
              {editCustomerName ? (
                <TextField
                  id='customer-name'
                  variant='filled'
                  label='Customer Name'
                  margin='dense'
                  tabIndex='1'
                  autoFocus
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyDown={handleEnter}
                  onBlur={(e) => handleClickText(e, 'customerName')}
                />
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Customer Name:</Typography>
                  <Typography>{order.customer.name}</Typography>
                </div>
              )}
            </div>
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'customerSite')}>
              {editCustomerSite ? (
                <TextField
                  id='customer-site'
                  variant='filled'
                  label='Customer Site'
                  margin='dense'
                  tabIndex='1'
                  autoFocus
                  value={customerSite}
                  onChange={(e) => setCustomerSite(e.target.value)}
                  onKeyDown={handleEnter}
                  onBlur={(e) => handleClickText(e, 'customerSite')}
                />
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>Customer Site:</Typography>
                  <Typography>{order.customer.site}</Typography>
                </div>
              )}
            </div>
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'poNumber')}>
              {editPONumber ? (
                <TextField
                  id='po-number'
                  variant='filled'
                  label='PO Number'
                  margin='dense'
                  tabIndex='1'
                  autoFocus
                  value={poNumber}
                  onChange={(e) => setPONumber(e.target.value)}
                  onKeyDown={handleEnter}
                  onBlur={(e) => handleClickText(e, 'poNumber')}
                />
              ) : (
                <div className={classes.row}>
                  <Typography variant='subtitle1'>PO Number:</Typography>
                  <Typography>{order.customer.PONumber}</Typography>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
      <section className={classes.orderSections}>
        <Card>
          <CardHeader title='Status Information' />
          <CardContent>
            <section>
              <div className={classes.row}>
                <Typography variant='h6'>Pending Approval</Typography>
              </div>
              <Divider />
              <div className={classes.row}>
                <Typography variant='subtitle1' align='left' className={classes.left}>
                  Credit:
                </Typography>
                <Typography align='center' className={classes.center}>
                  <Checkbox
                    checked={order.status[0].values[0].completed}
                    onClick={(e) =>
                      handleChecked(
                        e.target.checked,
                        order.status[0].title,
                        order.status[0].values[0].title
                      )
                    }
                    className={classes.rowCheck}
                  />
                </Typography>
                <Typography align='right' className={classes.right}>
                  {order.status[0].values[0].when}
                </Typography>
              </div>
              <div className={classes.row}>
                <Typography variant='subtitle1' align='left' className={classes.left}>
                  Manager:
                </Typography>
                <Typography align='center' className={classes.center}>
                  <Checkbox
                    checked={order.status[0].values[1].completed}
                    onClick={(e) =>
                      handleChecked(
                        e.target.checked,
                        order.status[0].title,
                        order.status[0].values[1].title
                      )
                    }
                    className={classes.rowCheck}
                  />
                </Typography>
                <Typography align='right' className={classes.right}>
                  {order.status[0].values[1].when}
                </Typography>
              </div>
              <div className={classes.row}>
                <Typography variant='subtitle1' align='left' className={classes.left}>
                  Sent to Credit:
                </Typography>
                <Typography align='center' className={classes.center}>
                  <Checkbox
                    checked={order.status[0].values[2].completed}
                    onClick={(e) =>
                      handleChecked(
                        e.target.checked,
                        order.status[0].title,
                        order.status[0].values[2].title
                      )
                    }
                    className={classes.rowCheck}
                  />
                </Typography>
                <Typography align='right' className={classes.right}>
                  {order.status[0].values[2].when}
                </Typography>
              </div>
            </section>
            <section>
              <div className={classes.row}>
                <Typography variant='h6'>Pending Confirmations</Typography>
              </div>
              <Divider />
              <div
                className={classes.editField}
                onClick={(e) => handleClickText(e, 'customerConfirmation')}
              >
                {editCustomerConfirmation ? (
                  <div className={classes.row}>
                    <InputLabel id='credit-approval-types-label'>To Customer:</InputLabel>
                    <Select
                      className={classes.select}
                      value={customerConfirmation}
                      onChange={(e) => handleSelect(e, 'customer-confirmation')}
                    >
                      <MenuItem value='$'>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value='Email'>Email</MenuItem>
                      <MenuItem value='Fax'>Fax</MenuItem>
                    </Select>
                  </div>
                ) : (
                  <div className={classes.row}>
                    <Typography>To Customer:</Typography>
                    <Typography>{order.status[1].values[0].confirmationType}</Typography>
                    <Typography>{order.status[1].values[0].when}</Typography>
                  </div>
                )}
              </div>
              <div className={classes.row}>
                <Typography variant='subtitle1' align='left' className={classes.left}>
                  To WhatsApp:
                </Typography>
                <Typography align='center' className={classes.center}>
                  <Checkbox
                    checked={order.status[1].values[1].completed}
                    onClick={(e) =>
                      handleChecked(
                        e.target.checked,
                        order.status[1].title,
                        order.status[1].values[1].title
                      )
                    }
                    className={classes.rowCheck}
                  />
                </Typography>
                {order.status[1].values[1].when.length > 0 ? (
                  <Typography align='right' className={classes.right}>
                    {order.status[1].values[1].when}
                  </Typography>
                ) : (
                  <Typography align='right' className={classes.right}>
                    &nbsp;
                  </Typography>
                )}
              </div>
              <div className={classes.row}>
                <Typography variant='subtitle1' align='left' className={classes.left}>
                  To Print:
                </Typography>
                <Typography align='center' className={classes.center}>
                  <Checkbox
                    checked={order.status[1].values[2].completed}
                    onClick={(e) =>
                      handleChecked(
                        e.target.checked,
                        order.status[1].title,
                        order.status[1].values[2].title
                      )
                    }
                    className={classes.rowCheck}
                  />
                </Typography>
                {order.status[1].values[2].when.length > 0 ? (
                  <Typography align='right' className={classes.right}>
                    {order.status[1].values[2].when}
                  </Typography>
                ) : (
                  <Typography align='right' className={classes.right}>
                    &nbsp;
                  </Typography>
                )}
              </div>
              {order.specialConfirmation.includes('Green Sand') ? (
                <div className={classes.row}>
                  <Typography variant='subtitle1' align='left' className={classes.left}>
                    To Green Sand:
                  </Typography>
                  <Typography align='center' className={classes.center}>
                    <Checkbox
                      checked={order.status[1].values[3].completed}
                      onClick={(e) =>
                        handleChecked(
                          e.target.checked,
                          order.status[1].title,
                          order.status[1].values[3].title
                        )
                      }
                      className={classes.rowCheck}
                    />
                  </Typography>
                  {order.status[1].values[3].when.length > 0 ? (
                    <Typography align='right' className={classes.right}>
                      {order.status[1].values[3].when}
                    </Typography>
                  ) : (
                    <Typography align='right' className={classes.right}>
                      &nbsp;
                    </Typography>
                  )}
                </div>
              ) : null}
              {order.specialConfirmation.includes('Mesh Thread') ? (
                <div className={classes.row}>
                  <Typography variant='subtitle1' align='left' className={classes.left}>
                    To Mesh Thread:
                  </Typography>
                  <Typography align='center' className={classes.center}>
                    <Checkbox
                      checked={order.status[1].values[4].completed}
                      onClick={(e) =>
                        handleChecked(
                          e.target.checked,
                          order.status[1].title,
                          order.status[1].values[4].title
                        )
                      }
                      className={classes.rowCheck}
                    />
                  </Typography>
                  {order.status[1].values[4].when.length > 0 ? (
                    <Typography align='right' className={classes.right}>
                      {order.status[1].values[4].when}
                    </Typography>
                  ) : (
                    <Typography align='right' className={classes.right}>
                      &nbsp;
                    </Typography>
                  )}
                </div>
              ) : null}
            </section>
            <section>
              <div className={classes.row}>
                <Typography variant='h6'>Arhived</Typography>
              </div>
              <Divider />
              <div className={classes.row}>
                <Typography variant='subtitle1'>When:</Typography>
                <Typography>{order.status[2].when}</Typography>
              </div>
            </section>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='Notes' />
          <CardContent>
            <div className={classes.editField} onClick={(e) => handleClickText(e, 'notes')}>
              {editNotes ? (
                <TextField
                  id='notes'
                  variant='filled'
                  margin='dense'
                  tabIndex='1'
                  autoFocus
                  multiline
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onKeyDown={handleEnter}
                  onBlur={(e) => handleClickText(e, 'notes')}
                />
              ) : (
                <div className={classes.notes}>
                  {order.notes.split('\n').map((line, index) => {
                    return line.length > 1 ? (
                      <Typography key={index}>{line}</Typography>
                    ) : (
                      <Typography key={index}>&nbsp;</Typography>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
