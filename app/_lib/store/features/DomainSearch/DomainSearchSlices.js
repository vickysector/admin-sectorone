import { createSlice } from "@reduxjs/toolkit";

const DomainSearchSlices = createSlice({
  name: "Leaked Data Slices",
  initialState: {
    domainSearchData: "",
    totalExposures: "",
    totalPerPageDomainSearch: 0,
    totalAllPageDomainSearch: 0,
    detailsDomainSearch: {},
    detailsIsOpen: false,
    detailBreachesUser: 0,
    detailBreachesEmployee: 0,
    detailBreachesThirdParty: 0,
    detailBreachesTotal: 0,
    isAddDomainPopUp: false,
    AddDomainEmail: "",
    addDomainSelectOptions: [],
    isAlreadyPopup: false,
    userListAddDomain: [],
    emailChoosenAddDomain: "",
    countAllPageAddDomain: 0,
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
    setDetailsDomainSearch(state, action) {
      state.detailsDomainSearch = action.payload;
    },
    setDetailBreachesUser(state, action) {
      state.detailBreachesUser = action.payload;
    },
    setDetailBreachesEmployee(state, action) {
      state.detailBreachesEmployee = action.payload;
    },
    setDetailBreachesThirdParty(state, action) {
      state.detailBreachesThirdParty = action.payload;
    },
    setDetailBreachesTotal(state, action) {
      state.detailBreachesTotal = action.payload;
    },
    setIsAddDomainPopup(state, action) {
      state.isAddDomainPopUp = action.payload;
    },
    setAddDomainEmail(state, action) {
      state.AddDomainEmail = action.payload;
    },
    setAddDomainSelectOptions(state, action) {
      state.addDomainSelectOptions = action.payload;
    },
    setisAlreadyPopup(state, action) {
      state.isAlreadyPopup = action.payload;
    },
    setUserListAddDomain(state, action) {
      state.userListAddDomain = action.payload;
    },
    setEmailChoosenAddDoamin(state, action) {
      state.emailChoosenAddDomain = action.payload;
    },
    setCountAllPageAddDomain(state, action) {
      state.countAllPageAddDomain = action.payload;
    },
  },
});

export const {
  setDomainSearchData,
  setTotalExposuresDomainSearch,
  setTotalPerPageDomainSearch,
  setTotalAllPageDomainSearch,
  setDetailsDomainSearch,
  setDetailBreachesUser,
  setDetailBreachesEmployee,
  setDetailBreachesThirdParty,
  setDetailBreachesTotal,
  setIsAddDomainPopup,
  setAddDomainEmail,
  setAddDomainSelectOptions,
  setisAlreadyPopup,
  setUserListAddDomain,
  setEmailChoosenAddDoamin,
  setCountAllPageAddDomain,
} = DomainSearchSlices.actions;

export default DomainSearchSlices.reducer;
