import { createSlice } from "@reduxjs/toolkit";

const ScanEmailSlice = createSlice({
  name: "Scan Email",
  initialState: {
    isScanNow: false,
    scannedEmail: "",
    scannedId: "",
    callScannedEmailFunctions: null,
  },
  reducers: {
    setIsScanNow(state, action) {
      state.isScanNow = action.payload;
    },
    setScannedEmail(state, action) {
      state.scannedEmail = action.payload;
    },
    setScannedId(state, action) {
      state.scannedId = action.payload;
    },
    setCallScannedEmailFunctions(state, action) {
      state.callScannedEmailFunctions = action.payload;
    },
  },
});

export const {
  setIsScanNow,
  setScannedEmail,
  setScannedId,
  setCallScannedEmailFunctions,
} = ScanEmailSlice.actions;

export default ScanEmailSlice.reducer;
