// import react
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//import redux
import { useSelector } from 'react-redux';

// import material-ui
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { deepPurple, blue, grey } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

// import project files
import { selectLights } from './features/user/userSlice';
import Header from './features/common/header/Header';
import OrderTracker from './features/tracker/OrderTracker';
import SignUp from './features/authentication/SignUp';
import SignIn from './features/authentication/SignIn';
import PrivateRoute from './features/authentication/PrivateRoute';
import ForgotPassword from './features/authentication/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // Creating the theme
  const paletteType = useSelector(selectLights);
  const light = grey[50];
  const dark = grey[900];
  const primary = blue[800];
  const secondary = deepPurple[700];
  const theme = createMuiTheme({
    themeName: 'Adaptive Dark and Light',
    overrides: {
      MuiFormLabel: {
        root: {
          color: '#999999',
          '&$focused': {
            color: blue[400],
          },
        },
      },
    },
    palette: {
      type: paletteType ? 'dark' : 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
    },
    typography: {
      useNextVariants: true,
      fontFamily: [
        'Roboto',
        'Lato',
        '"Helvetica Neue"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      body1: {
        fontSize: '1.25rem',
        fontWeight: 300,
        color: paletteType ? light : dark,
      },
      subtitle1: {
        fontSize: '1.25rem',
        fontWeight: 500,
        color: grey[500],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path='/' component={OrderTracker} />
            <Route path='/signup' component={SignUp} />
            <Route path='/login' component={SignIn} />
            <Route path='/forgot-password' component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
