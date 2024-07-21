import { createSlice } from "@reduxjs/toolkit";

const ExportToCSVSlice = createSlice({
  name: "Export to CSV",
  initialState: {
    confirm: false,
    status: false,
    data: {
      total: 0,
      section: "",
    },
    exportToCsvDefault: null,
    exportToCsvBookmark: null,
    selectSection: "",
  },
  reducers: {
    setConfirmExportToCsv(state, action) {
      state.confirm = action.payload;
    },
    setStatusExportToCsv(state, action) {
      state.status = action.payload;
    },
    setDataExportToCsv(state, action) {
      state.data = action.payload;
    },
    clearDataExportToCsv(state, action) {
      state.data = {};
    },
    setExportToCsvDefault(state, action) {
      state.exportToCsvDefault = action.payload;
    },
    setExportToCsvBookmark(state, action) {
      state.exportToCsvBookmark = action.payload;
    },
    setSelectSectionStealer(state, action) {
      state.selectSection = action.payload;
    },
  },
});

export const {
  setConfirmExportToCsv,
  setStatusExportToCsv,
  setDataExportToCsv,
  clearDataExportToCsv,
  setExportToCsvDefault,
  setExportToCsvBookmark,
  setSelectSectionStealer,
} = ExportToCSVSlice.actions;

export default ExportToCSVSlice.reducer;
