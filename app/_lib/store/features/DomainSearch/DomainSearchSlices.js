import { createSlice } from "@reduxjs/toolkit";

const DomainSearchSlices = createSlice({
  name: "Leaked Data Slices",
  initialState: {
    domainSearchData: "",
    totalExposures: "",
    totalPerPageDomainSearch: 0,
    totalAllPageDomainSearch: 0,
    detailsLeakedData: {},
    detailsIsOpen: false,
  },
  reducers: {
    setDomainSearchData(state, action) {
      state.domainSearchData = action.payload;
    },
    setTotalExposuresDomainSearch(state, action) {
      state.totalExposures = action.payload;
    },
    setTotalPerPageDomainSearch(state, action) {
      state.totalPerPageDomainSearch = action.payload;
    },
    setTotalAllPageDomainSearch(state, action) {
      state.totalAllPageDomainSearch = action.payload;
    },
  },
});

export const {
  setDomainSearchData,
  setTotalExposuresDomainSearch,
  setTotalPerPageDomainSearch,
  setTotalAllPageDomainSearch,
} = DomainSearchSlices.actions;

export default DomainSearchSlices.reducer;
