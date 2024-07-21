import { createSlice } from "@reduxjs/toolkit";

const RefreshTokenSlice = createSlice({
  name: "Refresh Token Expired",
  initialState: {
    status: false,
  },
  reducers: {
    setStatusRefreshTokenExpired(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setStatusRefreshTokenExpired } = RefreshTokenSlice.actions;

export default RefreshTokenSlice.reducer;
