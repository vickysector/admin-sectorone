import { createSlice } from "@reduxjs/toolkit";

const LeakedDataSlice = createSlice({
  name: "Leaked Data Slices",
  initialState: {
    email: "",
    leakedData: "",
    totalExposures: "",
    isVerified: false,
    errorLeakedData: false,
    isUsersDontShowAgain: false,
    isUsersDontShowAgainTemp: false,
    usersCredit: 0,
    detailsLeakedData: {},
    detailsIsOpen: false,
  },
  reducers: {
    setEmailScannedData(state, action) {
      state.email = action.payload;
    },
    setLeakedData(state, action) {
      state.leakedData = action.payload;
    },
    setTotalExposures(state, action) {
      state.totalExposures = action.payload;
    },
    setEmailIsVerified(state, action) {
      state.isVerified = action.payload;
    },
    setErrorLeakedData(state, action) {
      state.errorLeakedData = action.payload;
    },
    setIsUsersDontShowAgain(state, action) {
      state.isUsersDontShowAgain = action.payload;
    },
    setIsUsersDontShowAgainTemp(state, action) {
      state.isUsersDontShowAgainTemp = action.payload;
    },
    setUsersCredit(state, action) {
      state.usersCredit = action.payload;
    },
    setDetailsLeakedData(state, action) {
      state.detailsLeakedData = action.payload;
    },
    setDetailsIsOpen(state, action) {
      state.detailsIsOpen = action.payload;
    },
  },
});

export const {
  setEmailScannedData,
  setLeakedData,
  setTotalExposures,
  setEmailIsVerified,
  setErrorLeakedData,
  setIsUsersDontShowAgain,
  setIsUsersDontShowAgainTemp,
  setUsersCredit,
  setDetailsLeakedData,
  setDetailsIsOpen,
} = LeakedDataSlice.actions;

export default LeakedDataSlice.reducer;
