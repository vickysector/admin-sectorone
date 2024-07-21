import { createSlice } from "@reduxjs/toolkit";

const LoadingOverviewSlice = createSlice({
  name: "Loading Overview",
  initialState: {
    breachesState: {
      status: false,
    },
    listDomainUsersState: {
      status: false,
    },
    topCompromiseUserState: {
      status: false,
    },
    topCompromiseUrlState: {
      status: false,
    },
    topCompromiseAntivirusState: {
      status: false,
    },
    topCompromiseMalwareState: {
      status: false,
    },
  },
  reducers: {
    setLoadingBreachesOverview(state, action) {
      state.breachesState.status = action.payload;
    },
    setLoadingListDomainUsers(state, action) {
      state.listDomainUsersState.status = action.payload;
    },
    setLoadingTopCompromiseUser(state, action) {
      state.topCompromiseUserState.status = action.payload;
    },
    setLoadingTopCompromiseUrl(state, action) {
      state.topCompromiseUrlState.status = action.payload;
    },
    setLoadingTopCompromiseAntivirus(state, action) {
      state.topCompromiseAntivirusState.status = action.payload;
    },
    setLoadingTopCompromiseMalware(state, action) {
      state.topCompromiseMalwareState.status = action.payload;
    },
  },
});

export const {
  setLoadingBreachesOverview,
  setLoadingListDomainUsers,
  setLoadingTopCompromiseUser,
  setLoadingTopCompromiseUrl,
  setLoadingTopCompromiseAntivirus,
  setLoadingTopCompromiseMalware,
} = LoadingOverviewSlice.actions;

export default LoadingOverviewSlice.reducer;
