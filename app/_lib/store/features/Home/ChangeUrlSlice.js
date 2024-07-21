import { createSlice } from "@reduxjs/toolkit";

const changeUrlSlice = createSlice({
  name: "changeUrl",
  initialState: {
    status: false,
  },
  reducers: {
    setChangeUrl(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setChangeUrl } = changeUrlSlice.actions;

export default changeUrlSlice.reducer;
