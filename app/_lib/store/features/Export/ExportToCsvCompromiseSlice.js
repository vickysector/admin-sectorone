import { createSlice } from "@reduxjs/toolkit";

const ExportToCSVCompromiseSlice = createSlice({
  name: "Export to CSV - Compromise Page",
  initialState: {
    confirm: false,
    section: "",
    subSection: "",
    callExportToCSVCompromise: null,
  },
  reducers: {
    setConfirmExportToCsvCompromise(state, action) {
      state.confirm = action.payload;
    },
    setSectionExportToCSVCompromise(state, action) {
      state.section = action.payload;
    },
    setSubSectionExportToCSVCompromise(state, action) {
      state.subSection = action.payload;
    },
    setCallExportCSVFunctions(state, action) {
      state.callExportToCSVCompromise = action.payload;
    },
  },
});

export const {
  setConfirmExportToCsvCompromise,
  setSectionExportToCSVCompromise,
  setSubSectionExportToCSVCompromise,
  setCallExportCSVFunctions,
} = ExportToCSVCompromiseSlice.actions;

export default ExportToCSVCompromiseSlice.reducer;
