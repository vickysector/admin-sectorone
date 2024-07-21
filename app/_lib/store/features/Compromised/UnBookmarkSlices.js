import { createSlice } from "@reduxjs/toolkit";

const UnBookmarkSlice = createSlice({
  name: "Unbookmark State",
  initialState: {
    status: false,
    id_data: "",
    domain: "",
    success: null,
    banner: null,
  },
  reducers: {
    setUnBookmarkConfirmState(state, action) {
      state.status = action.payload;
    },
    setUnBookmarkIdData(state, action) {
      state.id_data = action.payload;
    },
    setUnBookmarkDomainData(state, action) {
      state.domain = action.payload;
    },
    setUnBookmarkStatusData(state, action) {
      state.success = action.payload;
    },
    setUnBookmarkBannerSuccess(state, action) {
      state.banner = action.payload;
    },
  },
});

export const {
  setUnBookmarkConfirmState,
  setUnBookmarkIdData,
  setUnBookmarkDomainData,
  setUnBookmarkStatusData,
  setUnBookmarkBannerSuccess,
} = UnBookmarkSlice.actions;

export default UnBookmarkSlice.reducer;
