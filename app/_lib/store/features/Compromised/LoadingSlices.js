import { createSlice } from "@reduxjs/toolkit";

const LoadingSlice = createSlice({
  name: "Loading state",
  initialState: {
    status: false,
  },
  reducers: {
    setLoadingState(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setLoadingState } = LoadingSlice.actions;

export default LoadingSlice.reducer;
