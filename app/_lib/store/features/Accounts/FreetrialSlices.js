import { createSlice } from "@reduxjs/toolkit";

const FreetrialSlices = createSlice({
  name: "Free trial pop up",
  initialState: {
    status: false,
  },
  reducers: {
    setFreeTrialStatusToTrue(state, action) {
      state.status = true;
    },
    setFreeTrialStatusToFalse(state, action) {
      state.status = false;
    },
  },
});

export const { setFreeTrialStatusToFalse, setFreeTrialStatusToTrue } =
  FreetrialSlices.actions;

export default FreetrialSlices.reducer;
