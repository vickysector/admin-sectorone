import { createSlice } from "@reduxjs/toolkit";

const AddUsersSlices = createSlice({
  name: "Add users role",
  initialState: {
    confirm: false,
    PostFunctionAddUser: null,
    successState: false,
  },
  reducers: {
    setConfirmAddUsersRole(state, action) {
      state.confirm = action.payload;
    },
    setAddUsersRoleFunction(state, action) {
      state.PostFunctionAddUser = action.payload;
    },
    setSuccessState(state, action) {
      state.successState = action.payload;
    },
  },
});

export const {
  setConfirmAddUsersRole,
  setAddUsersRoleFunction,
  setSuccessState,
} = AddUsersSlices.actions;

export default AddUsersSlices.reducer;
