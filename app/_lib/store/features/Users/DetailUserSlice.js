import { createSlice } from "@reduxjs/toolkit";

const DetailsUsersSlices = createSlice({
  name: "Add users role",
  initialState: {
    confirm: false,
    PostFunctionDeactivateUser: null,
    successState: false,
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
  },
});

export const {
  setConfirmDetailUserDeactivateState,
  setDetailUserDeactivateFunction,
  setSuccessState,
} = DetailsUsersSlices.actions;

export default DetailsUsersSlices.reducer;
