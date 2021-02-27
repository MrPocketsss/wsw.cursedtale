// import modules
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  center: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  code: {
    fontFamily: "Source Code Pro, monospace",
  },
  form: {
    width: "100%", // fix IE 11 issue
    marginTop: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default useStyles;
