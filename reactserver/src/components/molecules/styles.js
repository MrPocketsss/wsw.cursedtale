import { lighten, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  visuallyHidden: {
    position: "absolute",
    top: 20,
    height: 1,
    width: 1,
    border: 0,
    margin: -1,
    padding: 0,
    clip: "rect(0, 0, 0, 0)",
    overflow: "hidden",
  },
}));

export default useStyles;
