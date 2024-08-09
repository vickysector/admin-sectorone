import { createSlice } from "@reduxjs/toolkit";

const LogDetailActivitySlices = createSlice({
  name: "Log Loading State",
  initialState: {
    LogActivityData: null,
  },
  reducers: {
    setLogActivityState(state, action) {
      state.LogActivityData = action.payload;
    },
  },
});

export const { setLogActivityState } = LogDetailActivitySlices.actions;

export default LogDetailActivitySlices.reducer;
