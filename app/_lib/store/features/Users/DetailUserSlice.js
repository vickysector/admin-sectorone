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
    confirmEditDomain: false,
    PostFunctionEditDomain: null,
    isAddDomainStatus: false,
    idUsersForAddUrlDomain: "",
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
    setConfirmEditDomain(state, action) {
      state.confirmEditDomain = action.payload;
    },
    setPostFunctionEditDomain(state, action) {
      state.PostFunctionEditDomain = action.payload;
    },
    setIsAddDomainStatus(state, action) {
      state.isAddDomainStatus = action.payload;
    },
    setIdUsersForAddUrlDomain(state, action) {
      state.idUsersForAddUrlDomain = action.payload;
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
  setConfirmEditDomain,
  setPostFunctionEditDomain,
  setIsAddDomainStatus,
  setIdUsersForAddUrlDomain,
} = DetailsUsersSlices.actions;

export default DetailsUsersSlices.reducer;
