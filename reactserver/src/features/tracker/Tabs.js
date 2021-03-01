// impoty react
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// import firestore
// import OrdersDataService from '../../firebase/useFirestore';
import { database } from '../../firebase/Firebase';

// import material-ui
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';

// import project files
import OrdersDataService from '../../firebase/useFirestore';
import OrderDetails from './OrderDetails';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-panel-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-panel-${index}`,
    'aria-controls': `tab-panel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '8ch',
    '&:focus': { width: '40ch' },
  },
  inputRoot: {
    color: 'inherit',
  },
  modalContent: {
    position: 'absolute',
    width: '60vw',
    height: '40vh',
    top: '30vh',
    left: '20vw',
    outline: 0,
    backgroundColor: theme.palette.background.default,
    padding: '1rem 2rem',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    overflow: 'hidden',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.8),
    marginLeft: theme.spacing(1),
    width: 'auto',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    width: '8rem',
    color: 'inherit',
  },
  table: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    margin: '1rem',
    overflow: 'hidden',
    height: '78vh',
  },
  tableBody: {
    width: '100%',
    overflowY: 'auto',
    height: '70vh',
  },
  tableHead: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    height: '4rem',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[600] : theme.palette.grey[400],
  },
  tableRow: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '0.5rem',
    '&:hover': {
      backgroundColor: '#ddd',
      color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[900],
    },
  },
  tableRowHighlight: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[50],
    '&:hover': {
      backgroundColor: '#ddd',
      color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[900],
    },
  },
  tableDataBig: {
    width: '16rem',
    margin: '0 1rem',
  },
  tableData: {
    flexBasis: '2rem',
    flexGrow: 1,
    height: '1.5rem',
    margin: '0 1rem',
    width: '2rem',
    color: 'inherit',
  },
  tableDataSmall: {
    height: '1.5rem',
    margin: '0 1rem',
    width: '1rem',
    color: 'inherit',
  },
  tabs: {
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function TabController() {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hiddenTab, setHiddenTab] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});

  // handles the search menu
  const handleSetSearch = (event) => {
    setSearchString(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchResults([]);
    if (event.keyCode === 13) {
      // set up variables
      let results = [];

      // see if we have logical AND (&&) or logical OR (||) in search - can't have both
      const logicalAND = searchString.includes(' && ');
      const logicalOR = searchString.includes(' || ');

      // if logical AND then search where match exists in all parts
      if (logicalAND) {
        const queries = searchString.split(' && ');
        let found = [];
        queries.forEach((query) => {
          // check if have a NOT (!) in our query
          const NOT = query.includes('!');
          query = NOT ? query.split('!')[1] : query;

          const buffer = orders.filter((order) => {
            const dataString = JSON.stringify(order.data);
            // first replace will get rid of any quotation mark, unless its a "", empty string quote
            // the second replace will modify the <key:value> to be <key: value>
            return NOT
              ? !dataString
                  .replace(/("")+/g, '__')
                  .replace(/"+/g, '')
                  .replace(/:+/g, ': ')
                  .includes(query)
              : dataString
                  .replace(/("")+/g, '__')
                  .replace(/"+/g, '')
                  .replace(/:+/g, ': ')
                  .includes(query);
          });

          found = [...found, ...buffer];
          results = found.filter((val, id, array) => array.indexOf(val) !== id);
        });
      }
      // if logical OR then search where match exists in any part
      else if (logicalOR) {
        const queries = searchString.split(' ||');
        let found = [];
        queries.forEach((query) => {
          // check if have a NOT (!) in our query
          const NOT = query.includes('!');
          query = NOT ? query.split('!')[1] : query;

          const buffer = orders.filter((order) => {
            const dataString = JSON.stringify(order.data);
            // first replace will get rid of any quotation mark, unless its a "", empty string quote
            // the second replace will modify the <key:value> to be <key: value>
            return NOT
              ? !dataString
                  .replace(/("")+/g, '__')
                  .replace(/"+/g, '')
                  .replace(/:+/g, ': ')
                  .includes(query)
              : dataString
                  .replace(/("")+/g, '__')
                  .replace(/"+/g, '')
                  .replace(/:+/g, ': ')
                  .includes(query);
          });
          if (buffer) found = [...found, ...buffer];
        });

        results = found.filter((val, id, array) => array.indexOf(val) === id);
      }
      // if neither logical AND or logical OR, do regular search
      else {
        const NOT = searchString.includes('!');
        const query = NOT ? searchString.split('!')[1] : searchString;
        const buffer = orders.filter((order) => {
          const dataString = JSON.stringify(order.data);

          const flag = dataString
            .replace(/("")+/g, '__')
            .replace(/"+/g, '')
            .replace(/:+/g, ': ')
            .includes(query);

          return NOT ? !flag : flag;
        });
        results = buffer;
      }

      setHiddenTab(false);
      setSearchString('');
      setTabIndex(3);
      setSearchResults(results);
    }
  };

  // handles select dom elements
  const handleSelect = (key, status, value) => {
    const epoch = Date.now();
    const timestamp = parseDate();
    // update the object
    const ordersClone = [];
    orders.forEach((idx) => ordersClone.push({ ...idx }));

    const order = ordersClone.filter((el) => el.key === key)[0].data;

    switch (status) {
      case 'Approved':
        const customerConfirm = order.status[1].values[0];
        const whatsApp = order.status[1].values[1];
        const print = order.status[1].values[2];
        const greenSands = order.status[1].values[3];
        const meshThread = order.status[1].values[4];
        const archiveDate = order.status[2];
        customerConfirm.completed = value === '$' ? false : true;
        customerConfirm.confirmationType = value === '$' ? '' : value;
        customerConfirm.when = timestamp;
        customerConfirm.whenEpoch = epoch;

        if (
          customerConfirm.completed === true &&
          whatsApp.completed === true &&
          print.completed === true &&
          greenSands.completed === true &&
          meshThread.completed === true
        ) {
          order.currentStatus = 'Archived';
          archiveDate.when = timestamp;
          archiveDate.whenEpoch = epoch;
        }
        break;
      default:
        break;
    }

    order.lastModified = timestamp;
    order.lastModifiedEpoch = epoch;

    OrdersDataService.update(key, order);
  };

  // handles showing the complete details for the order
  const handleOrder = (event, key) => {
    const toSend = orders.filter((order) => order.key === key)[0];
    setOrderDetail(toSend);
    setShowModal(true);
    console.log(toSend);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDeleteButton = (event, order) => {
    order.data.isActive = false;
    OrdersDataService.update(order.key, order.data);
    handleClose();
  };

  // handles checkbox clicks
  const handleChecked = (key, checked, status, type) => {
    const epoch = Date.now();
    const timestamp = parseDate();
    // key is order key
    // status is the current status of the order
    // type is which checkbox was checked (credit, manager)
    const ordersClone = [];
    orders.forEach((idx) => ordersClone.push({ ...idx }));

    let order = ordersClone.filter((el) => el.key === key)[0].data;
    switch (status) {
      case 'Pending Approval':
        const credit = order.status[0].values[0];
        const manager = order.status[0].values[1];
        if (type === 'Credit Approved') {
          credit.completed = checked ? true : false;
          credit.when = timestamp;
          credit.whenEpoch = epoch;
        } else if (type === 'Manager Approved') {
          manager.completed = checked ? true : false;
          manager.when = timestamp;
          manager.whenEpoch = epoch;
        }
        if (credit.completed === true && manager.completed === true)
          order.currentStatus = 'Approved';
        order.status[1].when = timestamp;
        order.status[1].whenEpoch = epoch;
        break;
      case 'Approved':
        const specialConfirmation = order.specialConfirmation;
        console.log(specialConfirmation);
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
        }
        break;
      default:
        break;
    }
    order.lastModified = timestamp;
    order.lastModifiedEpoch = epoch;

    OrdersDataService.update(key, order);
  };

  useEffect(() => {
    OrdersDataService.getAll();
    database.ref('/orders').on('value', (snapshot) => {
      const newOrders = [];
      snapshot.forEach((item) => {
        newOrders.push({ key: item.key, data: item.val() });
      });

      newOrders.filter((order) => {
        return orders.filter((el) => el.key === order.key).length < 1 ? true : false;
      });
      if (newOrders.length !== orders.length) setOrders(newOrders);
    });
  }, [orders, setOrders]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue < 3 && !hiddenTab) {
      setHiddenTab(true);
      setSearchResults([]);
    }
  };

  // make the date something we can tolerate
  const parseDate = () => {
    const now = new Date();
    const year = now.getFullYear().toString().substring(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='secondary'>
        <Toolbar>
          <Tabs
            value={tabIndex}
            indicatorColor='primary'
            onChange={handleChange}
            aria-label='Order Tabs'
            className={classes.tabs}
          >
            <Tab label='Pending Approval' {...a11yProps(0)} />
            <Tab label='Pending Confirmations' {...a11yProps(1)} />
            <Tab label='Archived' {...a11yProps(2)} />
            {!hiddenTab ? <Tab label='Search' {...a11yProps(3)} /> : null}
          </Tabs>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search...'
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchString}
              onChange={handleSetSearch}
              onKeyDown={handleSearch}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Dialog
        open={showModal}
        onClose={handleClose}
        fullScreen
        TransitionComponent={Transition}
        aria-labelledby='order-details'
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography variant='h5' align='center' className={classes.title}>
              Order Details
            </Typography>
            <Button variant='contained' onClick={(e) => handleDeleteButton(e, orderDetail)}>
              DELETE
            </Button>
          </Toolbar>
        </AppBar>
        <OrderDetails order={orderDetail} />
      </Dialog>
      <TabPanel value={tabIndex} index={0}>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.tableDataSmall}></div>
            <Typography align='center' className={classes.tableData}>
              Order Number
            </Typography>
            <Typography align='left' className={classes.tableData}>
              Order Type
            </Typography>
            <Typography align='left' className={classes.tableDataBig}>
              Customer Name
            </Typography>
            <Typography align='left' className={classes.tableDataBig}>
              Customer Site
            </Typography>
            <Typography align='center' className={classes.tableData}>
              PO Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Credit Approved
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Manager Approved
            </Typography>
          </div>
          <div className={classes.tableBody}>
            {orders
              .filter(
                (order) =>
                  order.data.currentStatus === 'Pending Approval' && order.data.isActive === true
              )
              .map((order, index) => {
                return (
                  <div
                    key={order.key}
                    className={index % 2 === 1 ? classes.tableRow : classes.tableRowHighlight}
                  >
                    <IconButton
                      className={classes.tableDataSmall}
                      onClick={(e) => handleOrder(e, order.key)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.orderNumber}
                    </Typography>
                    <Typography variant='body2' align='left' className={classes.tableData}>
                      {order.data.currentOrderType}
                    </Typography>
                    <Typography variant='body2' align='left' className={classes.tableDataBig}>
                      {order.data.customer.name}
                    </Typography>
                    <Typography variant='body2' align='left' className={classes.tableDataBig}>
                      {order.data.customer.site}
                    </Typography>
                    <Typography variant='body2' align='left' className={classes.tableData}>
                      {order.data.customer.PONumber}
                    </Typography>
                    <Checkbox
                      checked={order.data.status[0].values[0].completed}
                      onClick={(e) =>
                        handleChecked(
                          order.key,
                          e.target.checked,
                          order.data.status[0].title,
                          order.data.status[0].values[0].title
                        )
                      }
                      className={classes.tableData}
                    />
                    <Checkbox
                      checked={order.data.status[0].values[1].completed}
                      onChange={(e) =>
                        handleChecked(
                          order.key,
                          e.target.checked,
                          order.data.status[0].title,
                          order.data.status[0].values[1].title
                        )
                      }
                      className={classes.tableData}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.tableDataSmall}></div>
            <Typography align='center' className={classes.tableData}>
              Order Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Order Type
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Name
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Site
            </Typography>
            <Typography align='center' className={classes.tableData}>
              PO Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Confirmation
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Sent to WhatsApp
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Sent to Print
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Sent to Green Sand
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Sent to Mesh Thread
            </Typography>
          </div>
          <div className={classes.tableBody}>
            {orders
              .filter(
                (order) => order.data.currentStatus === 'Approved' && order.data.isActive === true
              )
              .map((order, index) => {
                return (
                  <div
                    key={order.key}
                    className={index % 2 === 1 ? classes.tableRow : classes.tableRowHighlight}
                  >
                    <IconButton
                      className={classes.tableDataSmall}
                      onClick={(e) => handleOrder(e, order.key)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.orderNumber}
                    </Typography>
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.currentOrderType}
                    </Typography>
                    {order.data.customer.name.length < 8 ? (
                      <Typography variant='body2' align='left' className={classes.tableData}>
                        {order.data.customer.name}
                      </Typography>
                    ) : (
                      <Tooltip title={order.data.customer.name} arrow>
                        <Typography variant='body2' align='left' className={classes.tableData}>
                          {order.data.customer.name.substring(0, 8) + '...'}
                        </Typography>
                      </Tooltip>
                    )}
                    {order.data.customer.site.length < 8 ? (
                      <Typography variant='body2' align='left' className={classes.tableData}>
                        {order.data.customer.site}
                      </Typography>
                    ) : (
                      <Tooltip title={order.data.customer.site} arrow>
                        <Typography variant='body2' align='left' className={classes.tableData}>
                          {order.data.customer.site.substring(0, 8) + '...'}
                        </Typography>
                      </Tooltip>
                    )}
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.customer.PONumber}
                    </Typography>
                    <div>
                      <Select
                        className={classes.select}
                        labelId='customer-confirmation-select-label'
                        value={
                          order.data.status[1].values[0].confirmationType === ''
                            ? '$'
                            : order.data.status[1].values[0].confirmationType
                        }
                        onChange={(e) =>
                          handleSelect(order.key, order.data.status[1].title, e.target.value)
                        }
                      >
                        <MenuItem value='$'>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value='Email'>Email</MenuItem>
                        <MenuItem value='Fax'>Fax</MenuItem>
                      </Select>
                    </div>
                    <Checkbox
                      checked={order.data.status[1].values[1].completed}
                      onClick={(e) =>
                        handleChecked(
                          order.key,
                          e.target.checked,
                          order.data.status[1].title,
                          order.data.status[1].values[1].title
                        )
                      }
                      className={classes.tableData}
                    />
                    <Checkbox
                      checked={order.data.status[1].values[2].completed}
                      onChange={(e) =>
                        handleChecked(
                          order.key,
                          e.target.checked,
                          order.data.status[1].title,
                          order.data.status[1].values[2].title
                        )
                      }
                      className={classes.tableData}
                    />
                    {order.data.specialConfirmation.includes('Green Sand') ? (
                      <Checkbox
                        checked={order.data.status[1].values[3].completed}
                        onChange={(e) =>
                          handleChecked(
                            order.key,
                            e.target.checked,
                            order.data.status[1].title,
                            order.data.status[1].values[3].title
                          )
                        }
                        className={classes.tableData}
                      />
                    ) : (
                      <Typography align='center' className={classes.tableData}>
                        X
                      </Typography>
                    )}
                    {order.data.specialConfirmation.includes('Mesh Thread') ? (
                      <Checkbox
                        checked={order.data.status[1].values[4].completed}
                        onChange={(e) =>
                          handleChecked(
                            order.key,
                            e.target.checked,
                            order.data.status[1].title,
                            order.data.status[1].values[4].title
                          )
                        }
                        className={classes.tableData}
                      />
                    ) : (
                      <Typography align='center' className={classes.tableData}>
                        X
                      </Typography>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.tableDataSmall}></div>
            <Typography align='center' className={classes.tableData}>
              Order Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Order Type
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Name
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Site
            </Typography>
            <Typography align='center' className={classes.tableData}>
              PO Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Approved
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Confirmed
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Date completed
            </Typography>
          </div>
          <div className={classes.tableBody}>
            {orders
              .filter(
                (order) => order.data.currentStatus === 'Archived' && order.data.isActive === true
              )
              .map((order, index) => {
                return (
                  <div
                    key={order.key}
                    className={index % 2 === 1 ? classes.tableRow : classes.tableRowHighlight}
                  >
                    <IconButton
                      className={classes.tableDataSmall}
                      onClick={(e) => handleOrder(e, order.key)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.orderNumber}
                    </Typography>
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.currentOrderType}
                    </Typography>
                    {order.data.customer.name.length < 8 ? (
                      <Typography variant='body2' align='left' className={classes.tableData}>
                        {order.data.customer.name}
                      </Typography>
                    ) : (
                      <Tooltip title={order.data.customer.name} arrow>
                        <Typography variant='body2' align='left' className={classes.tableData}>
                          {order.data.customer.name.substring(0, 8) + '...'}
                        </Typography>
                      </Tooltip>
                    )}
                    {order.data.customer.site.length < 8 ? (
                      <Typography variant='body2' align='left' className={classes.tableData}>
                        {order.data.customer.site}
                      </Typography>
                    ) : (
                      <Tooltip title={order.data.customer.site} arrow>
                        <Typography variant='body2' align='left' className={classes.tableData}>
                          {order.data.customer.site.substring(0, 8) + '...'}
                        </Typography>
                      </Tooltip>
                    )}
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.customer.PONumber}
                    </Typography>
                    <Checkbox
                      checked={order.data.status[0].values[0].completed}
                      onClick={(e) =>
                        handleChecked(
                          order.key,
                          order.data.status[0].title,
                          order.data.status[0].values[0].title
                        )
                      }
                      className={classes.tableData}
                    />
                    <Checkbox
                      checked={order.data.status[0].values[1].completed}
                      onChange={(e) =>
                        handleChecked(
                          order.key,
                          e.target.checked,
                          order.data.status[0].title,
                          order.data.status[0].values[1].title
                        )
                      }
                      className={classes.tableData}
                    />
                    <Typography variant='body2' align='center' className={classes.tableData}>
                      {order.data.status[2].when}
                    </Typography>
                  </div>
                );
              })}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.tableData}></div>
            <Typography align='center' className={classes.tableData}>
              Order Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Order Type
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Name
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Customer Site
            </Typography>
            <Typography align='center' className={classes.tableData}>
              PO Number
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Approved
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Confirmed
            </Typography>
            <Typography align='center' className={classes.tableData}>
              Date completed
            </Typography>
          </div>
          <div className={classes.tableBody}>
            {searchResults.map((order, index) => {
              return (
                <div
                  key={order.key}
                  className={index % 2 === 1 ? classes.tableRow : classes.tableRowHighlight}
                >
                  <IconButton
                    className={classes.tableData}
                    onClick={(e) => handleOrder(e, order.key)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <Typography variant='body2' align='center' className={classes.tableData}>
                    {order.data.orderNumber}
                  </Typography>
                  <Typography variant='body2' align='center' className={classes.tableData}>
                    {order.data.currentOrderType}
                  </Typography>
                  <Typography variant='body2' align='center' className={classes.tableData}>
                    {order.data.customer.name}
                  </Typography>
                  <Typography variant='body2' align='center' className={classes.tableData}>
                    {order.data.customer.site}
                  </Typography>
                  <Typography variant='body2' align='center' className={classes.tableData}>
                    {order.data.customer.PONumber}
                  </Typography>
                  <Checkbox
                    checked={order.data.status[0].values[0].completed}
                    onClick={(e) =>
                      handleChecked(
                        order.key,
                        e.target.checked,
                        order.data.status[0].title,
                        order.data.status[0].values[0].title
                      )
                    }
                    className={classes.tableData}
                  />
                  <Checkbox
                    checked={order.data.status[0].values[1].completed}
                    onChange={(e) =>
                      handleChecked(
                        order.key,
                        e.target.checked,
                        order.data.status[0].title,
                        order.data.status[0].values[1].title
                      )
                    }
                    className={classes.tableData}
                  />
                  <Typography variant='body2' align='center' className={classes.tableData}>
                    {order.data.status[2].when}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
      </TabPanel>
    </div>
  );
}
