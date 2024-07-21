import { createSlice } from "@reduxjs/toolkit";

const DetailSlice = createSlice({
  name: "Detail State",
  initialState: {
    status: false,
    data: {},
    statusExecutive: false,
    dataExecutiveKeys: [],
    dataExecutiveValues: {},
    sections: "",
    filters: "",
  },
  reducers: {
    setDetailState(state, action) {
      state.status = action.payload;
    },
    setDataDetails(state, action) {
      state.data = action.payload;
    },
    setDetailExecutiveState(state, action) {
      state.statusExecutive = action.payload;
    },
    setDataExecutiveKeysDetails(state, action) {
      state.dataExecutiveKeys = action.payload;
    },
    setDataExecutiveValuesDetails(state, action) {
      state.dataExecutiveValues = action.payload;
    },
    setSection(state, action) {
      state.sections = action.payload;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
  },
});

export const {
  setDetailState,
  setDataDetails,
  setDetailExecutiveState,
  setDataExecutiveKeysDetails,
  setDataExecutiveValuesDetails,
  setSection,
  setFilters,
} = DetailSlice.actions;

export default DetailSlice.reducer;
