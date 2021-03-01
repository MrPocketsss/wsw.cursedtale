import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  actions: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bodyColumn: {
    display: 'flex',
  },
  column: {
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'stretch',
    '& > div': {
      width: '18rem',
    },
  },
  columnTwo: {
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'stretch',
    '& > label': {
      width: '18rem',
      marginTop: '24px',
    },
    '& > div': {
      width: '18rem',
    },
  },
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-evenly',
    height: '100%',
    width: '100%',
  },
  listItem: {
    color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[50],
  },
  row: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  select: {
    width: '8rem',
  },
  title: {
    flex: '0 1 auto',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default useStyles;
