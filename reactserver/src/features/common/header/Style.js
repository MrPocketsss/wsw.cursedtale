import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  centered: {
    flex: 2,
  },
  container: {
    width: '100vw',
    height: '8vh',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default useStyles;
