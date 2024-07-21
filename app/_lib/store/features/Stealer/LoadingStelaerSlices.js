import { createSlice } from "@reduxjs/toolkit";

const LoadingStealerSlice = createSlice({
  name: "Loading Stealer State",
  initialState: {
    status: false,
  },
  reducers: {
    setLoadingStealerState(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setLoadingStealerState } = LoadingStealerSlice.actions;

export default LoadingStealerSlice.reducer;
