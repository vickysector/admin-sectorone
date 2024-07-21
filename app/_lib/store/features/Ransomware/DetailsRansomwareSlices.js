const { createSlice } = require("@reduxjs/toolkit");

const DetailRansomwareSlices = createSlice({
  name: "Ransomware Details Page",
  initialState: {
    allDataRansomware: "",
  },
  reducers: {
    setAllDataRansomware(state, action) {
      state.allDataRansomware = action.payload;
    },
  },
});

export const { setAllDataRansomware } = DetailRansomwareSlices.actions;

export default DetailRansomwareSlices.reducer;
