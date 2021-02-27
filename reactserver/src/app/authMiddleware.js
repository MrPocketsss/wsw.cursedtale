export const persistToken = ({ dispatch, getState }) => (next) => (action) => {
  switch (action.type) {
    // skip these ones
    case 'auth/signOut':
    case 'auth/forgotPassword':
    case 'auth/resetPassword':
      break;
    // otherwise we need a good token
    default:
      const user = getState().auth.currentUser;
      if (user) {
        // 5 minutes from now
        const refreshThreshHold = new Date().getTime() + 300000;
        // jsonwebtoken strips milliseconds, need to add that back on
        const tokenExpiresAt = parseInt(user.expires, 10) * 1000;

        if (user.refresh && refreshThreshHold > tokenExpiresAt) {
          fetch('http://www.lineardemo.xyz/auth/refresh', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: user.refresh }),
          })
            .then(async (response) => {
              let body = await response.json();
              if (response.status === 200) {
                const base64Url = body.access.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = JSON.parse(
                  decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c) => {
                        return (
                          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                      })
                      .join('')
                  )
                );
                dispatch({
                  type: 'auth/setSignedIn',
                  payload: {
                    ...body,
                    email: jsonPayload.email,
                    role: jsonPayload.role,
                    expires: jsonPayload.exp,
                  },
                });
              }
            })
            .catch((error) => {
              throw Error(error);
              dispatch({ type: 'auth/setSignedIn', payload: null });
            });
        }
      }
  }
  next(action);
};
