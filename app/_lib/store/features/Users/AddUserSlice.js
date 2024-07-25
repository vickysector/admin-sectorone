import { createSlice } from "@reduxjs/toolkit";

const AddUsersSlices = createSlice({
  name: "Add users role",
  initialState: {
    confirm: false,
    PostFunctionAddUser: null,
  },
  reducers: {
    setConfirmAddUsersRole(state, action) {
      state.confirm = action.payload;
    },
    setAddUsersRoleFunction(state, action) {
      state.PostFunctionAddUser = action.payload;
    },
  },
});

export const { setConfirmAddUsersRole, setAddUsersRoleFunction } =
  AddUsersSlices.actions;

export default AddUsersSlices.reducer;
