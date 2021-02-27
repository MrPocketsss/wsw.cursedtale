// import modules
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

// import project files
import { persistToken } from './authMiddleware';
import authReducer from '../features/auth/authSlice';
import clientReducer from '../features/clients/clientSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
  },
  middleware: [persistToken, ...getDefaultMiddleware()],
});

store.subscribe(() => {
  localStorage.setItem(
    'USER',
    JSON.stringify(store.getState().auth.currentUser)
  );
});

export default store;
