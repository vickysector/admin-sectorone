import { createSlice } from "@reduxjs/toolkit";

const CheckboxSlice = createSlice({
  name: "Checkbox Slice",
  initialState: {
    ids: [],
    markedAsBookmark: false,
    markedAsValidated: false,
    status: "",
    success: null,
    success_validated: null,
    banner: null,
    banner_validated: null,
  },
  reducers: {
    addIdtoIds(state, action) {
      state.ids.push(action.payload);
    },
    removeIdtoIds(state, action) {
      let temp = state.ids.filter((id) => id !== action.payload);

      state.ids = temp;
    },
    clearIds(state, action) {
      state.ids = [];
    },
    setMarkedAsBookmark(state, action) {
      state.markedAsBookmark = action.payload;
    },
    setMarkedAsValidated(state, action) {
      state.markedAsValidated = action.payload;
    },
    setStatusMultipleBookmark(state, action) {
      state.status = action.payload;
    },
    setSuccessMultipleBookmark(state, action) {
      state.success = action.payload;
    },
    setSuccessMultipleValidated(state, action) {
      state.success_validated = action.payload;
    },
    setBannerMultipleBookmark(state, action) {
      state.banner = action.payload;
    },
    setBannerMultipleValidated(state, action) {
      state.banner_validated = action.payload;
    },
  },
});

export const {
  addIdtoIds,
  removeIdtoIds,
  clearIds,
  setMarkedAsBookmark,
  setStatusMultipleBookmark,
  setMarkedAsValidated,
  setSuccessMultipleBookmark,
  setSuccessMultipleValidated,
  setBannerMultipleBookmark,
  setBannerMultipleValidated,
} = CheckboxSlice.actions;

export default CheckboxSlice.reducer;
