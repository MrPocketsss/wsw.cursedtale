import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.modal + 1,
  },
  button: {
    ...theme.typography.estimate,
    borderRadius: '50px',
    margin: '0 25px 0 50px',
    height: '45px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  drawer: {
    backgroundColor: theme.palette.common.blue,
    [theme.breakpoints.down('md')]: { paddingTop: '6.2em' },
    [theme.breakpoints.down('xs')]: { paddingTop: '4.9em' },
    width: '15em',
  },
  drawerIcon: {
    width: '50px',
    height: '50px',
  },
  drawerItem: {
    ...theme.typography.tab,
    color: 'white',
    opacity: 0.7,
  },
  drawerItemEstimate: {
    ...theme.typography.tab,
    color: 'white',
    opacity: 0.7,
    backgroundColor: theme.palette.common.orange,
  },
  drawerItemSelected: {
    '& .MuiListItemText-root': {
      opacity: 1,
    },
  },
  drawerIconContainer: {
    margin: '0 0.25rem 0 auto',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  logo: {
    height: '8em',
    [theme.breakpoints.down('md')]: { height: '7em' },
    [theme.breakpoints.down('xs')]: { height: '5.5em' },
  },
  logoContainer: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  menu: {
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    borderRadius: 0,
  },
  menuItem: {
    ...theme.typography.tab,
    color: 'white',
    '&:hover': {
      opacity: 1,
    },
    opacity: 0.7,
  },
  tabContainer: {
    marginLeft: 'auto',
  },
  tab: {
    ...theme.typography.tab,
    minWidth: 10,
    marginLeft: '25px',
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: '3em',
    [theme.breakpoints.down('md')]: { marginBottom: '2em' },
    [theme.breakpoints.down('xs')]: { marginBottom: '1.25em' },
  },
  link: {
    textDecoration: 'none',
    color: '#eaeaea',
    marginRight: theme.spacing(2),
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paper: {
    width: '100%',
    maxHeight: '84vh',
    marginBottom: theme.spacing(2),
  },
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: theme.spacing(3),
    maxHeight: '75vh',
  },
  table: {
    minWidth: 750,
  },
  tableContainer: {
    maxHeight: '72vh',
    overflowY: 'auto',
  },
}));

export default useStyles;
