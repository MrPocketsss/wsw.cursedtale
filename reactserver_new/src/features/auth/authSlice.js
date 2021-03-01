import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const AUTH_URL = 'http://www.lineardemo.xyz/auth';

const signIn = createAsyncThunk('auth/signIn', async ({ email, password }) => {
  return fetch(`${AUTH_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
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
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          )
        );
        return {
          ...body,
          email: jsonPayload.email,
          role: jsonPayload.role,
          expires: jsonPayload.exp,
        };
      } else {
        throw new Error(`${body.message}`);
      }
    })
    .catch((error) => {
      throw Error(error);
    });
});
const signOut = createAsyncThunk(
  'auth/signOut',
  async (a = {}, { getState }) => {
    const {
      currentUser: { refresh },
    } = getState.auth();
    return fetch(`${AUTH_URL}/signout`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refresh }),
    })
      .then(async (response) => {
        let body = await response.json();

        if (response.status === 204) {
          return;
        } else {
          throw new Error(`${body.message}`);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  }
);
const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, role }, { getState }) => {
    const {
      currentUser: { access },
    } = getState().auth;
    return fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    })
      .then(async (response) => {
        if (response.status === 201) {
          return;
        } else {
          const body = await response.json();
          throw new Error(`${body.message}`);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  }
);
const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email) => {
    return fetch(`${AUTH_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(async (response) => {
        console.log('got response: ', response);

        if (response.status === 204) {
          return;
        } else {
          let body = await response.json();
          console.log('received message body: ', body);
          throw new Error(`${body.message}`);
        }
      })
      .catch((error) => {
        console.log('Got error: ', error);
        throw Error(error);
      });
  }
);
const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }) => {
    console.log(`sending token: ${token} and password: ${password}`);
    return fetch(`${AUTH_URL}/reset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })
      .then(async (response) => {
        if (response.status === 204) {
          return;
        } else {
          let body = await response.json();
          throw new Error(`${body.message}`);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  }
);
const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ password }, { getState }) => {
    const {
      currentUser: { access },
    } = getState().auth;
    return fetch(`${AUTH_URL}/updateUser`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
      .then(async (response) => {
        if (response.status === 204) {
          return;
        } else {
          let body = await response.json();
          throw new Error(`${body.message}`);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoaded: false,
    isPending: false,
    errorMessage: null,
    error: null,
    successMessage: null,
    currentUser: JSON.parse(localStorage.getItem('USER')),
  },
  reducers: {
    setSignedIn(state, { payload }) {
      state.isLoaded = true;
      state.currentUser = payload;
    },
    unsetMessages(state) {
      state.isPending = false;
      state.error = false;
      state.successMessage = null;
    },
  },
  extraReducers: {
    // sign in
    [signIn.pending]: (state) => {
      state.isPending = true;
      state.error = null;
      state.currentUser = null;
      state.successMessage = null;
      state.successMessage = null;
      state.errorMessage = null;
    },
    [signIn.rejected]: (state, { error }) => {
      state.isPending = false;
      state.error = error;
      state.errorMessage = error.message;
      state.successMessage = null;
      state.currentUser = null;
    },
    [signIn.fulfilled]: (state, { payload }) => {
      state.isPending = false;
      state.error = null;
      state.successMessage = 'logged in';
      state.currentUser = payload;
    },

    // sign up
    [signUp.pending]: (state) => {
      state.isPending = true;
      state.error = null;
      state.successMessage = null;
      state.errorMessage = null;
    },
    [signUp.rejected]: (state, { error }) => {
      console.log('signup failed');
      state.isPending = false;
      state.error = error;
      state.errorMessage = error.message;
    },
    [signUp.fulfilled]: (state) => {
      state.isPending = false;
      state.error = null;
      state.successMessage = 'User profile created';
    },

    // sign out
    [signOut.pending]: (state) => {
      state.isPending = true;
      state.error = null;
      state.currentUser = null;
      state.successMessage = null;
      state.successMessage = null;
      state.errorMessage = null;
    },
    [signOut.rejected]: (state, { error }) => {
      state.isPending = false;
      state.error = error;
    },
    [signOut.fulfilled]: (state) => {
      state.isPending = false;
      state.error = null;
      state.currentUser = null;
    },

    // forget password
    [forgotPassword.pending]: (state) => {
      state.isPending = true;
      state.error = null;
      state.currentUser = null;
      state.successMessage = null;
      state.successMessage = null;
      state.errorMessage = null;
    },
    [forgotPassword.rejected]: (state, { error }) => {
      state.isPending = false;
      state.error = error;
      state.errorMessage = error.message;
      state.currentUser = null;
    },
    [forgotPassword.fulfilled]: (state) => {
      state.isPending = false;
      state.error = null;
      state.successMessage = 'Check your inbox for further instructions';
      state.currentUser = null;
    },
    // reset password
    [resetPassword.pending]: (state) => {
      state.isPending = true;
      state.error = null;
      state.currentUser = null;
      state.successMessage = null;
      state.successMessage = null;
      state.errorMessage = null;
    },
    [resetPassword.rejected]: (state, { error }) => {
      state.isPending = false;
      state.error = error;
      state.errorMessage = error.message;
      state.currentUser = null;
    },
    [resetPassword.fulfilled]: (state) => {
      state.isPending = false;
      state.error = null;
      state.successMessage = 'Successfully reset password';
      state.currentUser = null;
    },
    // update user password
    [updatePassword.pending]: (state) => {
      state.isPending = true;
      state.error = null;
      state.currentUser = null;
      state.successMessage = null;
      state.successMessage = null;
      state.errorMessage = null;
    },
    [updatePassword.rejected]: (state, { error }) => {
      state.isPending = false;
      state.error = error;
      state.errorMessage = error.message;
      state.currentUser = null;
    },
    [updatePassword.fulfilled]: (state) => {
      state.isPending = false;
      state.error = null;
      state.successMessage = 'Successfully updated password';
      state.currentUser = null;
    },
  },
});

export {
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updatePassword,
}; // async thunks
export const { setSignedIn, unsetMessages } = authSlice.actions;

export default authSlice.reducer;
