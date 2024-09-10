import { createSlice } from "@reduxjs/toolkit";

const DetailsUsersSlices = createSlice({
  name: "Add users role",
  initialState: {
    confirm: false,
    PostFunctionDeactivateUser: null,
    successState: false,
    verifiedStatus: null,
    successStateEditUser: false,
    confirmEditUsers: false,
    PostFunctionEditUsers: null,
    confirmDeleteDomain: false,
    PostFunctionDeleteDomain: null,
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
    setConfirmEditUsers(state, action) {
      state.confirmEditUsers = action.payload;
    },
    setSuccessStateEditUser(state, action) {
      state.successStateEditUser = action.payload;
    },
    setPostFunctionEditUsers(state, action) {
      state.PostFunctionEditUsers = action.payload;
    },
    setConfirmDeleteDomain(state, action) {
      state.confirmDeleteDomain = action.payload;
    },
    setPostFunctionDeleteDomain(state, action) {
      state.PostFunctionDeleteDomain = action.payload;
    },
  },
});

export const {
  setConfirmDetailUserDeactivateState,
  setDetailUserDeactivateFunction,
  setSuccessState,
  setVerifiedStatus,
  setConfirmEditUsers,
  setSuccessStateEditUser,
  setPostFunctionEditUsers,
  setConfirmDeleteDomain,
  setPostFunctionDeleteDomain,
} = DetailsUsersSlices.actions;

export default DetailsUsersSlices.reducer;
