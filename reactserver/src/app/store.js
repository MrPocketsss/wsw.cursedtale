import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import orderReducer from '../features/tracker/orderSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    orders: orderReducer,
  },
});
