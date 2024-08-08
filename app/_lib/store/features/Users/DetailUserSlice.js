import { createSlice } from "@reduxjs/toolkit";

const DetailsUsersSlices = createSlice({
  name: "Add users role",
  initialState: {
    confirm: false,
    PostFunctionDeactivateUser: null,
    triggerChange: false,
  },
  reducers: {
    setConfirmDetailUserDeactivateState(state, action) {
      state.confirm = action.payload;
    },
    setDetailUserDeactivateFunction(state, action) {
      state.PostFunctionDeactivateUser = action.payload;
    },
    setTriggerChangeDeactivateAccount(state, action) {
      state.triggerChange = action.payload;
    },
  },
});

export const {
  setConfirmDetailUserDeactivateState,
  setDetailUserDeactivateFunction,
  setTriggerChangeDeactivateAccount,
} = DetailsUsersSlices.actions;

export default DetailsUsersSlices.reducer;
