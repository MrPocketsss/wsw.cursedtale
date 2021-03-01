import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: { isDark: false },
  reducers: {
    setDark: (state, action) => {
      state.isDark = action.payload;
    },
  },
});

export const { setDark } = userSlice.actions;
export const selectLights = (state) => state.user.isDark;
export default userSlice.reducer;
