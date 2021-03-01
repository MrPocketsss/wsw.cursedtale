// import react libraries
import { useState } from "react";

// import modules
import { createMuiTheme } from "@material-ui/core/styles";
import { deepPurple, blue, grey } from "@material-ui/core/colors";

// import project files

export default function useDarkMode() {
  const [darkState, setDarkState] = useState(true);
  const paletteType = darkState ? "dark" : "light";

  // define a theme
  const theme = createMuiTheme({
    themeName: "Adaptive Dark and Light",
    overrides: {
      MuiFormLabel: {
        root: {
          color: "#999999",
          "&$focused": {
            color: blue[400],
          },
        },
      },
    },
    palette: {
      type: paletteType,
      primary: {
        light: blue[800],
        main: blue[800],
        dark: blue[500],
      },
      secondary: { main: deepPurple[700] },
    },
    typography: {
      useNextVariants: true,
      fontFamily: [
        "Roboto",
        "Lato",
        '"Helvetica Neue"',
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Arial",
        "Source-Code-Pro",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      body1: {
        fontSize: "1.25rem",
        fontWeight: 300,
        color: darkState ? grey[50] : grey[800],
      },
      subtitle1: {
        fontSize: "1.25rem",
        fontWeight: 500,
        color: darkState ? grey[400] : grey[500],
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkState(!darkState);
  };

  return [theme, toggleDarkMode];
}
