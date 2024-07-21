const { createSlice } = require("@reduxjs/toolkit");

const SearchHistorySlice = createSlice({
  name: "Search History",
  initialState: {
    historySearchEmailVerified: false,
    isConfirmdeleteHistory: false,
    callDeleteSearchHistory: null,
  },
  reducers: {
    setHistorySearchEmailVerified(state, action) {
      state.historySearchEmailVerified = action.payload;
    },
    setIsConfirmDeleteHistory(state, action) {
      state.isConfirmdeleteHistory = action.payload;
    },
    setCallDeleteSearchHistory(state, action) {
      state.callDeleteSearchHistory = action.payload;
    },
  },
});

export const {
  setHistorySearchEmailVerified,
  setIsConfirmDeleteHistory,
  setCallDeleteSearchHistory,
} = SearchHistorySlice.actions;

export default SearchHistorySlice.reducer;
