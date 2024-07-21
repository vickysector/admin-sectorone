import { createSlice } from "@reduxjs/toolkit";

const LoadingLogSlice = createSlice({
  name: "Log Loading State",
  initialState: {
    status: false,
  },
  reducers: {
    setLoadingLogState(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setLoadingLogState } = LoadingLogSlice.actions;

export default LoadingLogSlice.reducer;
