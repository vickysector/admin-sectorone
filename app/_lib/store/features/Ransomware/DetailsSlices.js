const { createSlice } = require("@reduxjs/toolkit");

const DetailsSlices = createSlice({
  name: "Ransomware Details Page",
  initialState: {
    content: "",
    title: "",
  },
  reducers: {
    setContent(state, action) {
      state.content = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
  },
});

export const { setContent, setTitle } = DetailsSlices.actions;

export default DetailsSlices.reducer;
