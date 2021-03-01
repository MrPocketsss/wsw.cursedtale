import { createSlice } from '@reduxjs/toolkit';

export const orderSlice = createSlice({
  name: 'orders',
  initialState: [],
  reducers: {
    fill: (state, action) => {
      state = action.payload;
    },
    add: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { add, fill } = orderSlice.actions;
export const selectOrders = (state) => state.orders;
export default orderSlice.reducer;
