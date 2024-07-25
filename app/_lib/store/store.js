import { configureStore } from "@reduxjs/toolkit";
import ChangeUrlReducer from "./features/Home/ChangeUrlSlice";
import ChooseUrlReducer from "./features/Home/ChooseUrlSlice";
import BreachesSlices from "./features/Breaches/BreachesSlices";
import LoadingSlices from "./features/Compromised/LoadingSlices";
import DetailSlices from "./features/Compromised/DetailSlices";
import BookmarkSlices from "./features/Compromised/BookmarkSlices";
import UnBookmarkSlices from "./features/Compromised/UnBookmarkSlices";
import LoadingLogSlices from "./features/LogActivity/LoadingLogSlices";
import CheckboxSlices from "./features/Compromised/CheckboxSlices";
import LoadingStelaerSlices from "./features/Stealer/LoadingStelaerSlices";
import LoadingOverviewSlices from "./features/Home/LoadingOverviewSlices";
import ExportToCsvSlice from "./features/Export/ExportToCsvSlice";
import ExportToCsvCompromiseSlice from "./features/Export/ExportToCsvCompromiseSlice";
import RefreshTokenSlice from "./features/RefreshToken/RefreshTokenSlice";
import DocumentationSlices from "./features/Accounts/DocumentationSlices";
import FreetrialSlices from "./features/Accounts/FreetrialSlices";
import ScanEmailSlices from "./features/ExecutiveProtections/ScanEmailSlices";
import LeakedDataSlices from "./features/ExecutiveProtections/LeakedDataSlices";
import KeywordSearchSlices from "./features/KeywordSearch/KeywordSearchSlices";
import SearchHistorySlices from "./features/ExecutiveProtections/SearchHistorySlices";
import DetailsSlices from "./features/Ransomware/DetailsSlices";
import DetailsRansomwareSlices from "./features/Ransomware/DetailsRansomwareSlices";
import AddUserSlice from "./features/Users/AddUserSlice";

export const store = configureStore({
  reducer: {
    changeUrl: ChangeUrlReducer,
    chooseUrl: ChooseUrlReducer,
    breaches: BreachesSlices,
    compromised: LoadingSlices,
    detailComrpomise: DetailSlices,
    bookmarkCompromise: BookmarkSlices,
    unbookmarkCompromise: UnBookmarkSlices,
    activityLogLoading: LoadingLogSlices,
    checkbox: CheckboxSlices,
    stealerLoading: LoadingStelaerSlices,
    overviewLoading: LoadingOverviewSlices,
    exportToCsv: ExportToCsvSlice,
    exportToCsvCompromise: ExportToCsvCompromiseSlice,
    refreshTokenExpired: RefreshTokenSlice,
    documentationSectorOne: DocumentationSlices,
    freeTrialPopup: FreetrialSlices,
    scanEmail: ScanEmailSlices,
    executiveProtections: LeakedDataSlices,
    keywordSearch: KeywordSearchSlices,
    searchHistory: SearchHistorySlices,
    ransomwareDetailContent: DetailsSlices,
    ransomwareAllDetailContent: DetailsRansomwareSlices,
    addUserRole: AddUserSlice,
  },
});
