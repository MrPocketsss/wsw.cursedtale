import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '90vw',
    height: '90vh',
    margin: '1vh 5vw',
    padding: '1rem 2rem',
  },
  fab: {
    position: 'absolute',
    bottom: '2rem',
    right: '7rem',
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
}));

export default useStyles;
