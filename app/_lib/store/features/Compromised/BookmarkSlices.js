import { createSlice } from "@reduxjs/toolkit";

const BookmarkSlice = createSlice({
  name: "Bookmark State",
  initialState: {
    status: false,
    id_data: "",
    domain: "",
    success: null,
    banner: null,
  },
  reducers: {
    setBookmarkConfirmState(state, action) {
      state.status = action.payload;
    },
    setBookmarkIdData(state, action) {
      state.id_data = action.payload;
    },
    setBookmarkDomainData(state, action) {
      state.domain = action.payload;
    },
    setBookmarkStatusData(state, action) {
      state.success = action.payload;
    },
    setBookmarkBannerSuccess(state, action) {
      state.banner = action.payload;
    },
  },
});

export const {
  setBookmarkConfirmState,
  setBookmarkIdData,
  setBookmarkDomainData,
  setBookmarkStatusData,
  setBookmarkBannerSuccess,
} = BookmarkSlice.actions;

export default BookmarkSlice.reducer;
