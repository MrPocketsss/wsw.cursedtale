// import react libraries
import React from 'react';

// import modules
import { Redirect, Route } from 'react-router-dom';

// import project files

export default function PrivateRoute({
  component: Component,
  currentUser,
  accessLevel,
  ...rest
}) {
  console.log('current user: ', currentUser);
  console.log('access level: ', accessLevel);
  if (currentUser) {
    const canViewRoute =
      accessLevel === 'BASIC' ? true : accessLevel === currentUser.role;
    return (
      <Route
        {...rest}
        render={(props) => {
          return canViewRoute ? <Component {...props} /> : <Redirect to='/' />;
        }}
      ></Route>
    );
  } else {
    return (
      <Route
        {...rest}
        render={(props) => {
          return currentUser ? (
            <Component {...props} />
          ) : (
            <Redirect to='/signin' />
          );
        }}
      ></Route>
    );
  }
}
