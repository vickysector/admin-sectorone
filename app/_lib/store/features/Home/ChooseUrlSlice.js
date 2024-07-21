import { createSlice } from "@reduxjs/toolkit";

const ChooseUrlSlice = createSlice({
  name: "chooseUrl",
  initialState: {
    urlData: [],
  },
  reducers: {
    setUrlData(state, action) {
      state.urlData = action.payload;
    },
  },
});

export const { setUrlData } = ChooseUrlSlice.actions;

export default ChooseUrlSlice.reducer;
