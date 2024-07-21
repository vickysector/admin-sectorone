import { createSlice } from "@reduxjs/toolkit";

const BreachesSlices = createSlice({
  name: "breaches",
  initialState: {
    icon: "",
    url: "",
    lastUpdate: "",
    breachesAll: "",
    breachesEmployee: "",
    breachesUsers: "",
  },
  reducers: {
    setIcon(state, action) {
      state.icon = action.payload;
    },
    setUrl(state, action) {
      state.url = action.payload;
    },
    setLastUpdateUsers(state, action) {
      state.lastUpdate = action.payload;
    },
    setBreachesEmployeeAndUsers(state, action) {
      state.breachesAll = action.payload;
    },
    setBreachesEmployee(state, action) {
      state.breachesEmployee = action.payload;
    },
    setBreachesUsers(state, action) {
      state.breachesUsers = action.payload;
    },
  },
});

export const {
  setIcon,
  setUrl,
  setLastUpdateUsers,
  setBreachesEmployeeAndUsers,
  setBreachesEmployee,
  setBreachesUsers,
} = BreachesSlices.actions;

export default BreachesSlices.reducer;
