import { createSlice } from "@reduxjs/toolkit";

const DetailsUsersSlices = createSlice({
  name: "Add users role",
  initialState: {
    confirm: false,
    PostFunctionDeactivateUser: null,
    successState: false,
    verifiedStatus: null,
  },
  reducers: {
    setConfirmDetailUserDeactivateState(state, action) {
      state.confirm = action.payload;
    },
    setDetailUserDeactivateFunction(state, action) {
      state.PostFunctionDeactivateUser = action.payload;
    },
    setSuccessState(state, action) {
      state.successState = action.payload;
    },
    setVerifiedStatus(state, action) {
      state.verifiedStatus = action.payload;
    },
  },
});

export const {
  setConfirmDetailUserDeactivateState,
  setDetailUserDeactivateFunction,
  setSuccessState,
  setVerifiedStatus,
} = DetailsUsersSlices.actions;

export default DetailsUsersSlices.reducer;
