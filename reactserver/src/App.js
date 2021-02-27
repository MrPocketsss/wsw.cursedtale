// import react libraries
import React, { useEffect, useState } from 'react';

// import modules
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CircularProgress, CssBaseline, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

// import project files
import useDarkMode from './hooks/useDarkMode';
import './App.css';
import Dashboard from './features/clients';
import AddClient from './features/clients/pages/AddClient';
import { SignIn, SignUp, ForgotPassword, PrivateRoute } from './features/auth';
import { Header, Navbar } from './components/organisms';

export default function App() {
  const [theme, toggleDarkTheme] = useDarkMode();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(currentUser ? true : false);

    const timer = setTimeout(() => {
      if (!currentUser) setDisplay(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='app'>
        {display ? null : (
          <div className='loading'>
            <CircularProgress />
            <Typography component='h5'>
              Getting Things ready, please wait
            </Typography>
          </div>
        )}
        <Router>
          {currentUser && <Navbar toggleTheme={toggleDarkTheme} />}
          <Switch>
            <Route path='/signin' component={SignIn} />
            <Route path='/forgot' component={ForgotPassword} />
            <PrivateRoute
              path='/signup'
              currentUser={currentUser}
              accessLevel='ADMIN'
              component={SignUp}
            />
            <PrivateRoute
              path='/create-agency'
              currentUser={currentUser}
              accessLevel='BASIC'
              component={AddClient}
            />
            <PrivateRoute
              exact
              path='/'
              currentUser={currentUser}
              accessLevel='BASIC'
              component={Dashboard}
            />
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}
