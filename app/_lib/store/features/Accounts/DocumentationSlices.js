import { createSlice } from "@reduxjs/toolkit";

const DocumentationSlices = createSlice({
  name: "Documentation popup",
  initialState: {
    documentationStatus: false,
  },
  reducers: {
    setDocumentationSectorApiStatus(state, action) {
      state.documentationStatus = action.payload;
    },
  },
});

export const { setDocumentationSectorApiStatus } = DocumentationSlices.actions;

export default DocumentationSlices.reducer;
