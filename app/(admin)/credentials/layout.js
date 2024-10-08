"use client";

import Sidenav from "@/app/_ui/dashboard/Sidenav";
import Image from "next/image";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  CopyOutlined,
  UnlockTwoTone,
  LockTwoTone,
  InboxOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useRouter, redirect, usePathname } from "next/navigation";
import { LogoutOutlined } from "@ant-design/icons";
import { APIDATAV1, APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import { useSelector, useDispatch } from "react-redux";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";
import {
  setDetailExecutiveState,
  setDetailState,
} from "@/app/_lib/store/features/Compromised/DetailSlices";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import copy from "copy-to-clipboard";
import {
  setBookmarkBannerSuccess,
  setBookmarkConfirmState,
  setBookmarkStatusData,
} from "@/app/_lib/store/features/Compromised/BookmarkSlices";
import {
  setUnBookmarkBannerSuccess,
  setUnBookmarkConfirmState,
  setUnBookmarkStatusData,
} from "@/app/_lib/store/features/Compromised/UnBookmarkSlices";
import {
  clearIds,
  setBannerMultipleBookmark,
  setBannerMultipleValidated,
  setMarkedAsBookmark,
  setMarkedAsValidated,
  setSuccessMultipleBookmark,
  setSuccessMultipleValidated,
} from "@/app/_lib/store/features/Compromised/CheckboxSlices";
import LoadingStateCard from "@/app/_ui/components/utils/LoadingStateCard";
import { setConfirmExportToCsv } from "@/app/_lib/store/features/Export/ExportToCsvSlice";
import { setConfirmExportToCsvCompromise } from "@/app/_lib/store/features/Export/ExportToCsvCompromiseSlice";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { setDocumentationSectorApiStatus } from "@/app/_lib/store/features/Accounts/DocumentationSlices";
import {
  setFreeTrialStatusToFalse,
  setFreeTrialStatusToTrue,
} from "@/app/_lib/store/features/Accounts/FreetrialSlices";
import { Tooltip } from "@/app/_ui/components/utils/Tooltips";
import { setIsScanNow } from "@/app/_lib/store/features/ExecutiveProtections/ScanEmailSlices";
import {
  setIsAddedKeyword,
  setIsDeleteKeyword,
  setIsDetailActive,
} from "@/app/_lib/store/features/KeywordSearch/KeywordSearchSlices";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Button, Popover, ConfigProvider, message, Upload } from "antd";
import { setIsConfirmDeleteHistory } from "@/app/_lib/store/features/ExecutiveProtections/SearchHistorySlices";
import {
  setConfirmAddUsersRole,
  setSuccessState,
} from "@/app/_lib/store/features/Users/AddUserSlice";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { setDetailsIsOpen } from "@/app/_lib/store/features/ExecutiveProtections/LeakedDataSlices";
import {
  setConfirmDeleteDomain,
  setConfirmDetailUserDeactivateState,
  setConfirmEditDomain,
  setConfirmEditUsers,
  setIsAddDomainStatus,
  setTriggerChangeAfterAddDomain,
} from "@/app/_lib/store/features/Users/DetailUserSlice";

const { Dragger } = Upload;
import dayjs from "dayjs";
import {
  setCountAllPageAddDomain,
  setIsAddDomainPopup,
  setisAlreadyPopup,
  setUserListAddDomain,
} from "@/app/_lib/store/features/DomainSearch/DomainSearchSlices";
import { Input, Select, Space, Form } from "antd";
import HistoryIcon from "@mui/icons-material/History";
const { Search } = Input;
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import { v4 as uuidv4 } from "uuid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function DashboardLayout({ children }) {
  const [hide, setHide] = useState(false);
  const [accountShow, setAccountShow] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [errorLogout, setErrorLogout] = useState(false);
  const [usersData, setUsersData] = useState();
  // const [sessionExpired, setSessionExpired] = useState();
  const [isUrlListSelected, setIsUrlListSelected] = useState(false);
  const [idDomainUrl, setIdDomainUrl] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [reloadChange, setReloadChange] = useState(false);
  const [isChangeDomainTokenExpired, setIsChangeDomainTokenExpired] =
    useState();
  const [copied, setCopied] = useState(false);

  //   (superadmin)
  const [isUploadTxt, setIsUploadTxt] = useState(false);
  const [isExceeds1Mb, setIsExceeds1Mb] = useState(false);
  const [exceeds1MbMessage, setExceeds1MbMessage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [successMessageUploadTxt, setSuccessMessageUploadTxt] = useState("");
  const [successUploadTxt, setSuccessUploadTxt] = useState(false);
  const [successMessageCompressTxt, setSuccessMessageCompressTxt] =
    useState("");
  const [successCompressTxt, setSuccessCompressTxt] = useState(false);
  const [selectOptions, setSelecOptions] = useState([]);
  const [role, setRole] = useState("user");
  const [addDomainSearch, setAddDomainSearch] = useState("");
  const [listUsersAddDomain, setListUsersAddDomain] = useState([]);
  const [emailChoosedAddDomain, setEmailChoosedAddDomain] = useState("");
  const [usersChoosedAddDomain, setUsersChoosedAddDomain] = useState("");
  const [addDomainConfirmation, setAddDomainConfirmation] = useState(false);
  const [errorStateAddDomain, setErrorStateAddDomain] = useState(false);
  const [errorMsgAddDomain, setErrorMsgAddDomain] = useState("");
  const [successStateAddDomain, setSuccessStateAddDomain] = useState(false);
  const [successMsgAddDomain, setSuccessMsgAddDomain] = useState("");
  const [reachBottomUserList, setReachBottomUserList] = useState(false);
  const [userListPage, setUserListPage] = useState(1);
  const [isLoadingUserListAddDomain, setIsLoadingUserListAddDomain] =
    useState(false);

  const dataLeakedDetails = useSelector(
    (state) => state.executiveProtections.detailsLeakedData
  );

  console.log("data leaked details: ", dataLeakedDetails);

  const isDetailsLeakedDataOpen = useSelector(
    (state) => state.executiveProtections.detailsIsOpen
  );

  const isDetailsDeactivateAccount = useSelector(
    (state) => state.detailUserDeactivate.confirm
  );

  const isDetailsEditUsersAccount = useSelector(
    (state) => state.detailUserDeactivate.confirmEditUsers
  );

  const isDetailsEditDeleteDomainAccount = useSelector(
    (state) => state.detailUserDeactivate.confirmDeleteDomain
  );

  const isDetailsEditChangeDomainAccount = useSelector(
    (state) => state.detailUserDeactivate.confirmEditDomain
  );

  const verifiedAccountStatus = useSelector(
    (state) => state.detailUserDeactivate.verifiedStatus
  );

  const callDetailsDeactivateAccountFunction = useSelector(
    (state) => state.detailUserDeactivate.PostFunctionDeactivateUser
  );

  const callDetailsEditUsersFunction = useSelector(
    (state) => state.detailUserDeactivate.PostFunctionEditUsers
  );

  const callDetailsDeleteUsersFunction = useSelector(
    (state) => state.detailUserDeactivate.PostFunctionDeleteDomain
  );

  const callDetailsChangeDomainFunction = useSelector(
    (state) => state.detailUserDeactivate.PostFunctionEditDomain
  );

  // Start of: (superadmin) - Add Domain

  const pathname = usePathname();

  const isAddDomainPopup = useSelector(
    (state) => state.domainSearch.isAddDomainPopUp
  );

  const addDomainSelectOptions = useSelector(
    (state) => state.domainSearch.addDomainSelectOptions
  );

  const isAlreadyPopupAddDomain = useSelector(
    (state) => state.domainSearch.isAlreadyPopup
  );

  const userListAddDomain = useSelector(
    (state) => state.domainSearch.userListAddDomain
  );

  const emailChoosenAddDomain = useSelector(
    (state) => state.domainSearch.emailChoosenAddDomain
  );

  const allPageUsersAddDomain = useSelector(
    (state) => state.domainSearch.countAllPageAddDomain
  );

  // Start of: Add Url Domain (superadmin)

  const [urlAllDomain, setUrlAllDomain] = useState([{ id: 1, value: "" }]);
  const [isConfirmAddDomainForUsers, setIsConfirmAddDomainForUsers] =
    useState(false);
  const [finalUrlAllDomain, setFinalUrlAllDomain] = useState([]);
  const [errorMsgForAddUrlDomain, setErrorMsgForAddUrlDomain] = useState("");
  const [isSuccessAddUrlDomain, setIsSuccessUrlDomain] = useState(false);
  const [isErrorAddUrlDomain, setIsErrorUrlDomain] = useState(false);

  const addDomainPopUpStatus = useSelector(
    (state) => state.detailUserDeactivate.isAddDomainStatus
  );

  const idUsersForAddDomain = useSelector(
    (state) => state.detailUserDeactivate.idUsersForAddUrlDomain
  );

  const handleErrorStatePopup = () => {
    setIsErrorUrlDomain(false);
    dispatch(setIsAddDomainStatus(true));
  };

  const handleSuccessStatePopup = () => {
    setIsSuccessUrlDomain(false);
  };

  const handleAddDomainUrl = () => {
    setUrlAllDomain([...urlAllDomain, { id: uuidv4(), value: "" }]);
  };

  const handleDeleteAddDomainUrl = (itemId) => {
    console.log("clicked delete ", itemId);
    const newUrlAllDomain = urlAllDomain.filter((item) => item.id !== itemId);
    setUrlAllDomain(newUrlAllDomain);
  };

  const handleAddUrlDomain = (event, itemId) => {
    const newInputAllDomain = urlAllDomain.map((input, i) =>
      input.id === itemId ? { ...input, value: event.target.value } : input
    );
    setUrlAllDomain(newInputAllDomain);
  };

  console.log("url all domain: ", urlAllDomain);

  const handleAddDomainCancel = () => {
    dispatch(setIsAddDomainStatus(false));
  };

  const handleAddDomainsUrlCancelConfirmation = () => {
    setIsConfirmAddDomainForUsers(false);
    dispatch(setIsAddDomainStatus(true));
  };

  const handleAddDomainsUrlYesConfirmation = () => {
    setIsConfirmAddDomainForUsers(false);
    PostAddDomainsToSpecificUsersWithRefreshToken();
  };

  const handleAddDomainYes = () => {
    setIsConfirmAddDomainForUsers(true);
    dispatch(setIsAddDomainStatus(false));
    const newFinalUrlAllDomain = urlAllDomain.map((item) => item.value);
    setFinalUrlAllDomain(newFinalUrlAllDomain);
  };

  console.log("url all domain final:  ", finalUrlAllDomain);

  const PostAddDomainsToSpecificUsers = async () => {
    try {
      dispatch(setLoadingState(true));

      dispatch(setTriggerChangeAfterAddDomain(false));

      const res = await fetch(`${APIDATAV1}root/admin/domain`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: idUsersForAddDomain,
          name_domain: finalUrlAllDomain,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        throw res;
      }

      console.log("status adding domains to specific users: ", data);

      if (data.data) {
        dispatch(setTriggerChangeAfterAddDomain(true));
        setIsSuccessUrlDomain(true);
        setFinalUrlAllDomain([]);
        setUrlAllDomain([{ id: 1, value: "" }]);
        setTimeout(() => {
          setIsSuccessUrlDomain(false);
        }, 5000);
        return res;
      }
    } catch (error) {
      console.log("error while adding domains to specific users: ", error);
      setIsErrorUrlDomain(true);
      setErrorMsgForAddUrlDomain(error.message);
      setTimeout(() => {
        setIsErrorUrlDomain(false);
        dispatch(setIsAddDomainStatus(true));
      }, 5000);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const PostAddDomainsToSpecificUsersWithRefreshToken = async () => {
    await fetchWithRefreshToken(
      PostAddDomainsToSpecificUsers,
      router,
      dispatch
    );
  };

  // Start of: Add Url Domain (superadmin)

  const handleCloseDetailExecutivePopup = () => {
    dispatch(setDetailsIsOpen(false));
  };

  const handleCloseIsAddDomainPopup = () => {
    dispatch(setIsAddDomainPopup(false));
  };

  const handleRoleChange = (value) => {
    console.log("value role: ", value);
    setUserListPage(1);
    setRole(value);
    dispatch(setUserListAddDomain([]));
  };

  const handleAddDomainSearch = (e) => {
    console.log("add domain search ", e.target.value);
    setAddDomainSearch(e.target.value);
    dispatch(setUserListAddDomain([]));
    if (!addDomainSearch) {
      setUserListPage(1);
    }
  };

  const handleChooseEmailForAddDomain = (value) => {
    console.log("value add domain: ", value);
    setEmailChoosedAddDomain(value.id);
    setUsersChoosedAddDomain(value.email);
  };

  const handleAddDomainConfirmationPopUp = () => {
    if (emailChoosedAddDomain.length === 0) {
      return;
    } else {
      dispatch(setIsAddDomainPopup(false));
      setAddDomainConfirmation(true);
    }
  };

  const handleAddDomainConfirmationCancel = () => {
    setAddDomainConfirmation(false);
    dispatch(setIsAddDomainPopup(true));
  };

  const handleAddDomainConfirmationYes = () => {
    PostAddDomainWithRefreshToken();
  };

  const handleScrollUserList = (e) => {
    console.log("reach bottom: ", reachBottomUserList);
    if (userListPage < allPageUsersAddDomain) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
        setReachBottomUserList(true);
        setUserListPage(userListPage + 1);
        // setReachBottomUserList(false);
      }
    } else {
      setReachBottomUserList(false);
      return;
    }
  };

  console.log("emailchoosedadddomain: ", emailChoosedAddDomain);
  console.log("add domain confirmation: ", addDomainConfirmation);
  console.log("user list page: ", userListPage);
  console.log("allpage add domain: ", allPageUsersAddDomain);

  // End of: (superadmin) - Add Domain

  //   (superadmin)

  // Start of: Tooptips in notifications

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // End of: Tooltips in notifications

  const router = useRouter();
  const dispatch = useDispatch();

  const changeUrlState = useSelector((state) => state.changeUrl.status);
  const UrlsList = useSelector((state) => state.chooseUrl.urlData);
  const loadingCompromisedData = useSelector(
    (state) => state.compromised.status
  );
  const loadingActivityLogData = useSelector(
    (state) => state.activityLogLoading.status
  );
  const loadingStealerData = useSelector(
    (state) => state.stealerLoading.status
  );
  const detailsCompromisedState = useSelector(
    (state) => state.detailComrpomise.status
  );
  const detailsCompromisedData = useSelector(
    (state) => state.detailComrpomise.data
  );
  const detailsExecutiveProtectionsState = useSelector(
    (state) => state.detailComrpomise.statusExecutive
  );
  const detailsExecutiveProtectionsKeysData = useSelector(
    (state) => state.detailComrpomise.dataExecutiveKeys
  );
  const detailsExecutiveProtectionsValuesData = useSelector(
    (state) => state.detailComrpomise.dataExecutiveValues
  );

  console.log(
    "executive protections keys: ",
    detailsExecutiveProtectionsKeysData
  );
  console.log(
    "executive protections values: ",
    detailsExecutiveProtectionsValuesData
  );

  const sessionExpiredRefreshToken = useSelector(
    (state) => state.refreshTokenExpired.status
  );

  //   Start of: Add role user (superadmin)

  const confirmAddUserRole = useSelector((state) => state.addUserRole.confirm);
  const callAddUserRole = useSelector(
    (state) => state.addUserRole.PostFunctionAddUser
  );

  const handleCancelAddUserRole = () => {
    dispatch(setConfirmAddUsersRole(false));
  };

  const handleYesAddUserRole = () => {
    callAddUserRole();
    dispatch(setConfirmAddUsersRole(false));
  };

  const handleCancelDeactivateAccount = () => {
    dispatch(setConfirmDetailUserDeactivateState(false));
  };

  const handleYesDeactivateAccount = () => {
    callDetailsDeactivateAccountFunction();
    dispatch(setConfirmDetailUserDeactivateState(false));
  };

  const handleCancelEditUsers = () => {
    dispatch(setConfirmEditUsers(false));
  };

  const handleYesEditUsers = () => {
    callDetailsEditUsersFunction();
    dispatch(setConfirmEditUsers(false));
  };

  const handleCancelDeleteDomain = () => {
    dispatch(setConfirmDeleteDomain(false));
  };

  const handleCancelChangeDomain = () => {
    dispatch(setConfirmEditDomain(false));
  };

  const handleYesDeleteDomain = () => {
    callDetailsDeleteUsersFunction();
    dispatch(setConfirmDeleteDomain(false));
  };

  const handleYesEditDomain = () => {
    callDetailsChangeDomainFunction();
    dispatch(setConfirmEditDomain(false));
  };

  const isSuccessAddUserRole = useSelector(
    (state) => state.addUserRole.successState
  );

  const handleDoneSuccessAddUserRole = () => {
    dispatch(setSuccessState(false));
    router.push("/credentials/dashboard/users");
  };

  const handleIsUploadToTxt = () => {
    setIsUploadTxt(true);
  };

  const handleCloseUploadTxt = () => {
    setIsUploadTxt(false);
  };

  const handleCloseSuccessPopupUploadTxt = () => {
    setSuccessUploadTxt(false);
  };

  const handleCloseSuccessPopupCompressTxt = () => {
    setSuccessCompressTxt(false);
  };

  const handleCloseSuccessPopupUploadTxtAndRedirectToUsers = () => {
    setSuccessUploadTxt(false);
    // router.push("/credentials/dashboard/users");
  };

  const handleCloseSuccessPopupCompressxtAndRedirectToUsers = () => {
    setSuccessCompressTxt(false);
    // router.push("/credentials/dashboard/users");
  };

  //   const uploadTxtProps = {
  //     name: "Upload_Txt",
  //     multiple: false,
  //     action: `'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'`,
  //     onChange(info) {
  //       const { status } = info.file;
  //       if (status !== "uploading") {
  //         console.log("file info: ", info.file, info.fileList);
  //       }
  //       if (status === "done") {
  //         message.success(`${info.file.name} file uploaded successfully.`);
  //       } else if (status === "error") {
  //         message.error(`${info.file.name} file upload failed.`);
  //       }
  //     },
  //     onDrop(e) {
  //       console.log("Dropped files", e.dataTransfer.files);
  //     },
  //   };

  const handleSubmitUploadTxt = async (data) => {
    if (fileList.length === 0) {
      message.error("You must Upload File First");
    } else {
      PostUploadTelegramTXTWithRefreshToken();
    }

    // console.log("file format formdata: ", typeof fileList.file);
  };

  const handleSubmitUploadCompressTxt = async (data) => {
    if (fileList.length === 0) {
      message.error("You must Upload File First");
    } else {
      PostUploadCompressTelegramTXTWithRefreshToken();
    }

    // console.log("file format formdata: ", typeof fileList.file);
  };

  const handleUploadFile = (data) => {
    console.log("uploaded file: ", data);
    setFileList(data.fileList);
  };

  const PostUploadTelegramTXT = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);

    try {
      dispatch(setLoadingState(true));
      setIsUploadTxt(false);

      const res = await fetch(`${APIDATAV1}root/admin/upload/telegram`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          //   "content-type": "multipart/form-data",
        },
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("upload TXT status: ", data);

      // if (data.data === null && res === 413) {
      //   setIsExceeds1Mb(true);
      //   setIsUploadTxt(true);
      //   throw res;
      // }

      if (data.data === null) {
        message.error("Opps.. there's something wrong when Upload TXT file ");
        setIsExceeds1Mb(true);
        setExceeds1MbMessage(data.message);
        setIsUploadTxt(true);
        throw res;
      }

      if (data.data) {
        setIsUploadTxt(false);
        setSuccessMessageUploadTxt(data.data);
        setSuccessUploadTxt(true);
        setIsExceeds1Mb(false);
        setFileList([]);
      }

      return res;
    } catch (error) {
      console.log("error upload txt: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const PostUploadTelegramTXTWithRefreshToken = async () => {
    await fetchWithRefreshToken(PostUploadTelegramTXT, router, dispatch);
  };

  const PostUploadCompressTelegramTXT = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);

    try {
      dispatch(setLoadingState(true));
      setIsUploadTxt(false);

      const res = await fetch(`${APIDATAV1}root/admin/compress/telegram`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          //   "content-type": "multipart/form-data",
        },
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      if (res.status === 400) {
        return res;
      }

      const data = await res.blob();

      console.log("compress TXT status: ", data);

      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Compressed-data-${dayjs(new Date()).format(
          "dddd-DD-MMMM-YYYY_HH-mm-ss-A"
        )}.zip`; // Set the desired file name

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsUploadTxt(false);
        setSuccessMessageCompressTxt("Download Zip Successful!");
        setSuccessCompressTxt(true);
        setIsExceeds1Mb(false);
        setFileList([]);
        return res;
      }
    } catch (error) {
      console.log("error compress txt: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const PostUploadCompressTelegramTXTWithRefreshToken = async () => {
    await fetchWithRefreshToken(
      PostUploadCompressTelegramTXT,
      router,
      dispatch
    );
  };

  console.log("file list: ", fileList);
  // console.log(
  //   "dayjs: ",
  //   dayjs(new Date()).format("dddd-DD-MMMM-YYYY_HH-mm-ss-A")
  // );

  const uploadTxtProps = {
    accept: ".txt",
    multiple: false,
    maxCount: 1,
    name: "upload_txt",
    fileList: fileList,
    onChange: handleUploadFile,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  //   End of: Add role user (superadmin)

  // Start of: Add domain (superadmin)

  const FetchAllUsersForAddDomain = async () => {
    try {
      dispatch(setLoadingState(true));
      setIsLoadingUserListAddDomain(true);

      const res = await fetch(
        `${APIDATAV1}root/admin/all/user?page=${userListPage}&limit=10&search=${addDomainSearch}&type=${role}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        dispatch(
          setUserListAddDomain("We can't find user with that email address")
        );
      }

      console.log("data all users for add domain: ", data);

      if (data.data) {
        dispatch(setUserListAddDomain([...userListAddDomain, ...data.data]));
        dispatch(setCountAllPageAddDomain(data.count_page));
        // setListUsersAddDomain(data.data);
        return res;
      }

      return res;
    } catch (error) {
      console.log("error all users for add domain: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setIsLoadingUserListAddDomain(false);
    }
  };

  const FetchAllUsersForAddDomainWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchAllUsersForAddDomain, router, dispatch);
  };

  const PostAddDomain = async () => {
    try {
      dispatch(setLoadingState(true));
      setAddDomainConfirmation(false);
      dispatch(setIsAddDomainPopup(false));

      const res = await fetch(`${APIDATAV1}root/admin/domain`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: emailChoosedAddDomain,
          name_domain: [emailChoosenAddDomain],
        }),
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setErrorStateAddDomain(true);
        setErrorMsgAddDomain(data.message);
        setTimeout(() => {
          dispatch(setIsAddDomainPopup(true));
        }, 4100);
      }

      console.log("test adding domain data ", data);

      if (data.data) {
        setSuccessStateAddDomain(true);
      }

      return res;
    } catch (error) {
      console.log("error while adding domain data: ", error);
      // setIsErrorWhileAddData(true);
      //   setMessageErrorWhileAddData(error.message);
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        setErrorStateAddDomain(false);
      }, 4000);
      setTimeout(() => {
        setSuccessStateAddDomain(false);
      }, 4000);
    }
  };

  const PostAddDomainWithRefreshToken = async () => {
    await fetchWithRefreshToken(PostAddDomain, router, dispatch);
  };

  useEffect(() => {
    if (
      isAlreadyPopupAddDomain === false &&
      pathname === "/credentials/dashboard/domain-search"
    ) {
      console.log("running add domain fetch all users");
      FetchAllUsersForAddDomainWithRefreshToken();
    }
  }, [role, pathname]);

  useEffect(() => {
    // console.log("running add domain fetch all users bawah");
    FetchAllUsersForAddDomainWithRefreshToken();
    setEmailChoosedAddDomain("");
  }, [role]);

  useEffect(() => {
    // console.log("running add domain fetch all users bawah");
    FetchAllUsersForAddDomainWithRefreshToken();
    setEmailChoosedAddDomain("");
  }, [addDomainSearch]);

  useEffect(() => {
    FetchAllUsersForAddDomainWithRefreshToken();
  }, [userListPage]);

  // End of: Add domain - (superadmin)

  const isScanEmailNow = useSelector((state) => state.scanEmail.isScanNow);
  const scannedEmail = useSelector((state) => state.scanEmail.scannedEmail);

  const isConfirmDeleteSearchHistory = useSelector(
    (state) => state.searchHistory.isConfirmdeleteHistory
  );

  const calldeleteSearchHistoryFunctionsFunctions = useSelector(
    (state) => state.searchHistory.callDeleteSearchHistory
  );

  const callScannedSendOtpFunctions = useSelector(
    (state) => state.scanEmail.callScannedEmailFunctions
  );

  const bookmarkCompromisedState = useSelector(
    (state) => state.bookmarkCompromise.status
  );

  const bookmarkCompromisedId = useSelector(
    (state) => state.bookmarkCompromise.id_data
  );

  const bookmarkCompromiseDomain = useSelector(
    (state) => state.bookmarkCompromise.domain
  );

  const unbookmarkCompromisedState = useSelector(
    (state) => state.unbookmarkCompromise.status
  );

  const unbookmarkCompromisedId = useSelector(
    (state) => state.unbookmarkCompromise.id_data
  );

  const unbookmarkCompromiseDomain = useSelector(
    (state) => state.unbookmarkCompromise.domain
  );

  const loadingBreachesOverview = useSelector(
    (state) => state.overviewLoading.breachesState.status
  );

  const loadingListDomainUsersOverview = useSelector(
    (state) => state.overviewLoading.listDomainUsersState.status
  );

  const loadingTopCompromisedUserOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseUserState.status
  );

  const loadingTopCompromiseUrlOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseUrlState.status
  );

  const loadingTopCompromiseAntivirusOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseAntivirusState.status
  );

  const loadingTopCompromiseMalwareOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseMalwareState.status
  );

  const documentationSectorOneStatus = useSelector(
    (state) => state.documentationSectorOne.documentationStatus
  );

  const isAddKeywordButtonIsCalled = useSelector(
    (state) => state.keywordSearch.isAddedKeyword
  );

  const callAddKeywordFunction = useSelector(
    (state) => state.keywordSearch.callAddKeywordFunctions
  );

  const isDeleteKeywordButtonIsCalled = useSelector(
    (state) => state.keywordSearch.isDeleteKeyword
  );

  const callDeleteKeywordFunction = useSelector(
    (state) => state.keywordSearch.callDeleteKeywordFunction
  );

  const freeTrialPopupStatus = useSelector(
    (state) => state.freeTrialPopup.status
  );

  const detailKeywordSearchActive = useSelector(
    (state) => state.keywordSearch.isDetailActive
  );

  const handleDetailKeywordSearchYesOrNo = () => {
    dispatch(setIsDetailActive(false));
  };

  const handleDocumentationSectorOneStatus = () => {
    dispatch(setDocumentationSectorApiStatus(false));
  };

  // console.log(
  //   "loading top compromise malware: ",
  //   loadingTopCompromiseMalwareOverview
  // );

  // Start of: Checking Users Credentials

  const CredentialsEmail = getCookie("email_credentials");
  const CredentialsAccess_Token = getCookie("access_token");
  const CredentialsRefresh_Token = getCookie("refresh_token");

  // console.log("cookie get user_status", getCookie("user_status") == "true");

  // console.log("loading compromised data: ", loadingCompromisedData);

  // End of: Checking Users Credentials

  const handleYesAddButtonKeywordSearch = () => {
    callAddKeywordFunction();
    dispatch(setIsAddedKeyword(false));
  };

  const handleNoAddButtonKeywordSearch = () => {
    dispatch(setIsAddedKeyword(false));
  };

  const handleYesDeleteButtonKeywordSearch = () => {
    callDeleteKeywordFunction();
    dispatch(setIsDeleteKeyword(false));
  };

  const handleNoDeleteButtonKeywordSearch = () => {
    dispatch(setIsDeleteKeyword(false));
  };

  const handleIsScanEmailNow = () => {
    // dispatch()
    dispatch(setIsScanNow(false));
  };

  const handleConfirmSendOtp = () => {
    callScannedSendOtpFunctions();
    dispatch(setIsScanNow(false));
  };

  const handleCancelDeleteSearchHistory = () => {
    dispatch(setIsConfirmDeleteHistory(false));
  };

  const handleConfirmDeleteSearchHistory = () => {
    calldeleteSearchHistoryFunctionsFunctions();
    dispatch(setIsConfirmDeleteHistory(false));
  };

  const toggleHideIcon = () => {
    setHide((prevState) => !prevState);
  };

  const handleChangeUrlClose = () => {
    dispatch(setChangeUrl(false));
  };

  const handleBookmarkCompromisedClose = () => {
    dispatch(setBookmarkConfirmState(false));
  };

  const handleUnBookmarkCompromisedClose = () => {
    dispatch(setUnBookmarkConfirmState(false));
  };

  // Start of: Handle Compromised Export to CSV

  const confirmCompromiseExportToCSV = useSelector(
    (state) => state.exportToCsvCompromise.confirm
  );

  const sectionCompromiseExportToCSV = useSelector(
    (state) => state.exportToCsvCompromise.section
  );

  const subSectionCompromiseExportToCSV = useSelector(
    (state) => state.exportToCsvCompromise.subSection
  );

  const callExportToCSVCompromise = useSelector(
    (state) => state.exportToCsvCompromise.callExportToCSVCompromise
  );

  const handleCloseCompromiseExportToCSV = () => {
    dispatch(setConfirmExportToCsvCompromise(false));
  };

  const handleConfirmYesCompromiseExportToCSV = () => {
    callExportToCSVCompromise();
    dispatch(setConfirmExportToCsvCompromise(false));
  };

  // End of: Handle Compromised Export to CSV

  // Start of: Handle Stealer Export to CSV

  const confirmStealerExportToCSV = useSelector(
    (state) => state.exportToCsv.confirm
  );

  const selectSectionStealer = useSelector(
    (state) => state.exportToCsv.selectSection
  );

  const exportToCSVDefaultStealer = useSelector(
    (state) => state.exportToCsv.exportToCsvDefault
  );

  const exportToCSVBookmarkStealer = useSelector(
    (state) => state.exportToCsv.exportToCsvBookmark
  );

  const handleCloseStealerExportToCsv = () => {
    dispatch(setConfirmExportToCsv(false));
  };

  const handleConfirmYesStealerExportToCsv = () => {
    switch (selectSectionStealer) {
      case "stealer":
        exportToCSVDefaultStealer();
        dispatch(setConfirmExportToCsv(false));
        break;
      case "bookmark-stealer":
        exportToCSVBookmarkStealer();
        dispatch(setConfirmExportToCsv(false));
        break;
      default:
        break;
    }
  };

  // End of: Handle Stelaer Export to CSV

  // Start of: Handle Checkboxes Bookmark in Compromised pages

  const allCheckboxesIdData = useSelector((state) => state.checkbox.ids);
  const confirmCheckboxIdsData = useSelector(
    (state) => state.checkbox.markedAsBookmark
  );
  const multipleBookmarkStatus = useSelector((state) => state.checkbox.status);

  const handleCloseConfirmCheckboxIdsData = () => {
    dispatch(setMarkedAsBookmark(false));
  };

  const handleMultipleBookmarkCheckbox = () => {
    // CheckboxMultipleBookmark();
    fetchCheckboxMultipleBookmarkWithRefreshToken();
    dispatch(clearIds());
    dispatch(setMarkedAsBookmark(false));
  };

  const CheckboxMultipleBookmark = async () => {
    try {
      dispatch(setSuccessMultipleBookmark(null));

      const res = await fetch(
        `${APIDATAV1}status/domain/${multipleBookmarkStatus}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: allCheckboxesIdData,
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      dispatch(setSuccessMultipleBookmark(true));
      dispatch(setBannerMultipleBookmark(true));
      dispatch(clearIds());
      return res;
    } catch (error) {
      dispatch(setBannerMultipleBookmark(false));
      dispatch(clearIds());
      return error;
    } finally {
      dispatch(clearIds());
      setTimeout(() => {
        dispatch(setBannerMultipleBookmark(null));
      }, 9000);
    }
  };

  const fetchCheckboxMultipleBookmarkWithRefreshToken = async () => {
    await fetchWithRefreshToken(CheckboxMultipleBookmark, router, dispatch);
  };

  // End of: Handle Checkboxes Bookmark in Compromised pages

  // Start of: Handle Checkboxes Validated in Compromised pages

  const confirmCheckboxIdsDataValidated = useSelector(
    (state) => state.checkbox.markedAsValidated
  );

  const handleCloseConfirmCheckboxIdsDataValidated = () => {
    dispatch(setMarkedAsValidated(false));
  };

  const handleMultipleValidatedCheckbox = () => {
    // CheckboxMultipleValidated();
    fetchCheckboxMultipleValidatedWithRefreshToken();
    dispatch(clearIds());
    dispatch(setMarkedAsValidated(false));
  };

  const CheckboxMultipleValidated = async () => {
    try {
      dispatch(setSuccessMultipleValidated(null));
      const res = await fetch(
        `${APIDATAV1}status/domain/${multipleBookmarkStatus}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: allCheckboxesIdData,
            status_validasi: "valid",
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      dispatch(setSuccessMultipleValidated(true));
      dispatch(setBannerMultipleValidated(true));
      dispatch(clearIds());
      return res;
    } catch (error) {
      dispatch(setBannerMultipleValidated(false));
      dispatch(clearIds());
      return error;
    } finally {
      dispatch(clearIds());
      setTimeout(() => {
        dispatch(setBannerMultipleValidated(null));
      }, 9000);
    }
  };

  const fetchCheckboxMultipleValidatedWithRefreshToken = async () => {
    await fetchWithRefreshToken(CheckboxMultipleValidated, router, dispatch);
  };

  // End of: Handle Checkboxes Validated in Compromised pages

  // Start of: Update Domain

  const handleUrlListSelected = (domain) => {
    if (getCookie("user_identifier") != domain) {
      setIsUrlListSelected(true);
      setIdDomainUrl(domain);
      console.log("domain: ", domain);
    }
  };

  const handleUrlListCancel = () => {
    setIdDomainUrl("");
    setIsUrlListSelected(false);
  };

  const handleUrlListYes = () => {
    // UpdateDomain();
    fetchUpdateDomainWithRefreshToken();

    // Check if the `window` object is defined (browser environment)
    // if (typeof window !== "undefined") {
    // window.location.reload();
    // }
  };

  const handleBookmarkCompromiseData = () => {
    // BookmarkCompromisedData();
    fetchBookmarkCompromisedDataWithRefreshToken();
    dispatch(setBookmarkConfirmState(false));
  };

  const handleUnBookmarkCompromiseData = () => {
    // UnBookmarkCompromisedData();
    fetchUnBookmarkCompromisedDataWithRefreshToken();
    dispatch(setUnBookmarkConfirmState(false));
  };

  const handleDetailCompromisedState = () => {
    dispatch(setDetailState(false));
  };

  const handleDetailExecutiveProtectionsState = () => {
    dispatch(setDetailExecutiveState(false));
  };

  const copyToClipboard = (text) => {
    copy(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const BookmarkCompromisedData = async () => {
    try {
      dispatch(setBookmarkStatusData(null));
      const res = await fetch(
        `${APIDATAV1}status/domain/${bookmarkCompromiseDomain}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: [`${bookmarkCompromisedId}`],
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      dispatch(setBookmarkStatusData(true));
      dispatch(setBookmarkBannerSuccess(true));
      return res;
    } catch (error) {
      dispatch(setBookmarkStatusData(false));
      dispatch(setBookmarkBannerSuccess(false));
      return error;
    } finally {
      setTimeout(() => {
        dispatch(setBookmarkBannerSuccess(null));
      }, 9000);
    }
  };

  const fetchBookmarkCompromisedDataWithRefreshToken = async () => {
    await fetchWithRefreshToken(BookmarkCompromisedData, router, dispatch);
  };

  const UnBookmarkCompromisedData = async () => {
    try {
      dispatch(setUnBookmarkStatusData(null));
      const res = await fetch(
        `${APIDATAV1}status/domain/${unbookmarkCompromiseDomain}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: [`${unbookmarkCompromisedId}`],
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      dispatch(setUnBookmarkStatusData(true));
      dispatch(setUnBookmarkBannerSuccess(true));
      return res;
    } catch (error) {
      dispatch(setUnBookmarkStatusData(false));
      dispatch(setUnBookmarkBannerSuccess(false));
      return error;
    } finally {
      setTimeout(() => {
        dispatch(setUnBookmarkBannerSuccess(null));
      }, 9000);
    }
  };

  const fetchUnBookmarkCompromisedDataWithRefreshToken = async () => {
    await fetchWithRefreshToken(UnBookmarkCompromisedData, router, dispatch);
  };

  const UpdateDomain = async () => {
    try {
      const res = await fetch(`${APIDATAV1}domain`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_domain: idDomainUrl,
        }),
      });

      // console.log("res update domain: ", res);

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        // console.log("res 401 | 403", res);
        setIsChangeDomainTokenExpired(true);
        return res;
      }

      const data = await res.json();

      // console.log("data update domain: ", data);

      // if (data.data.Severity === "ERROR") {
      //   // DeleteCookies();
      //   // RedirectToLogin();
      //   // return res;
      // }
      // setReloadChange(true);
      // console.log("res most bottom: ", res);
      setIsChangeDomainTokenExpired(false);
      return res;
    } catch (error) {
    } finally {
      if (!isChangeDomainTokenExpired) {
        setIsUrlListSelected(false);
        dispatch(setChangeUrl(false));
        // console.log("Running finally update domain");
        window.location.reload();
      }
    }
  };

  const fetchUpdateDomainWithRefreshToken = async () => {
    await fetchWithRefreshToken(UpdateDomain, router, dispatch);
  };

  // End of: Update Domain

  // Start of: Handle Logout

  const toggleAccount = () => {
    setAccountShow((prevState) => !prevState);
  };

  const Logout = async () => {
    try {
      setLogoutLoading(true);
      const res = await fetch(`${APIDATAV1}logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // return res;
        // throw new Error("");
        throw res;
      }

      const data = await res.json();

      if (data.success) {
        DeleteCookies();
        router.push("/auth/login");
        window.location.reload();
        return res;
      }
    } catch (error) {
      setErrorLogout(true);
      setTimeout(() => {
        setErrorLogout(false);
      }, 3000);
      return error;
    } finally {
      setLogoutLoading(false);
    }
  };

  const fetchLogoutFunctionWithRefreshToken = async () => {
    await fetchWithRefreshToken(Logout, router, dispatch);
  };

  // End of: Handle Logout

  // Start of: Handle Get Users and Get ID Users.

  const getUsersData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}setting/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setUsersData(data.data.email);
      setCookie("user_status", data.data.isDemo);
      return res;
    } catch (error) {
    } finally {
    }
  };

  const fetchGetUsersDataWithRefreshToken = async () => {
    await fetchWithRefreshToken(getUsersData, router, dispatch);
  };

  const getUserDomain = async () => {
    try {
      const res = await fetch(`${APIDATAV1}domain`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setCookie("user_identifier", data.data.id_domain);
      return res;
    } catch (error) {
    } finally {
    }
  };

  const fetchGetUserDomainWithRefreshToken = async () => {
    await fetchWithRefreshToken(getUserDomain, router, dispatch);
  };

  useEffect(() => {
    // getUsersData();
    // getUserDomain();
    fetchGetUsersDataWithRefreshToken();
    fetchGetUserDomainWithRefreshToken();
  }, []);

  // End of: Handle Get Users and Get ID Users.

  // Start of: Refresh Token

  // const getRefreshToken = async () => {
  //   try {
  //     const res = await fetch(`${APIKEY}refresh-token`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         Authorization: "app_secret!!!",
  //       },
  //     });

  //     console.log("refresh token res: ", res);

  //     if (res.status === 401 || res.status === 403 || res.status === 400) {
  //       setSessionExpired(true);
  //       setTimeout(() => {
  //         setSessionExpired(false);
  //         DeleteCookies();
  //         router.push("/auth/login");
  //       }, 7000);
  //     }

  //     const data = await res.json();

  //     deleteCookie("access_token");
  //     setCookie("access_token", data.data.access_token);

  //     console.log("refresh token data: ", data);
  //   } catch (error) {
  //   } finally {
  //   }
  // };

  // Commented because the mechanism is change to every request
  // useEffect(() => {
  //   const IntervalId = setInterval(() => {
  //     getRefreshToken();
  //   }, 15 * 60 * 1000);

  //   return () => clearInterval(IntervalId);
  // }, []);

  // End of: Refresh Token

  useEffect(() => {
    if (
      !getCookie("email_credentials") ||
      !getCookie("access_token") ||
      !getCookie("refresh_token")
    ) {
      return redirect("/auth/login");
    }
  }, []);

  useEffect(() => {
    if (getCookie("role") !== "superadmin") {
      DeleteCookies();
      router.push("/auth/login");
      window.location.reload();
      DeleteCookies();
    }
  }, []);

  console.log(
    "data executive admin baru (index) (details): ",
    dataLeakedDetails
  );

  return (
    <main className="relative bg-input-container">
      {/* Start of: Loading State Cards */}

      <LoadingStateCard loading={loadingStealerData} />
      <LoadingStateCard loading={loadingActivityLogData} />
      <LoadingStateCard loading={loadingCompromisedData} />

      {/* Start = Overview */}
      <LoadingStateCard loading={loadingBreachesOverview} />
      <LoadingStateCard loading={loadingListDomainUsersOverview} />
      <LoadingStateCard loading={loadingTopCompromisedUserOverview} />
      <LoadingStateCard loading={loadingTopCompromiseUrlOverview} />
      <LoadingStateCard loading={loadingTopCompromiseAntivirusOverview} />
      <LoadingStateCard loading={loadingTopCompromiseMalwareOverview} />

      {/* End = Overview */}

      {/* End of: Loading State Cards */}

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-40 flex items-center justify-center text-black ",
          isDetailsLeakedDataOpen ? "visible" : "hidden"
        )}
      >
        <div className="w-[30%] bg-white rounded-lg p-[32px]  overflow-y-scroll h-[650px] relative">
          <div
            className={clsx(
              "fixed right-[50%] translate-x-[50%] top-[50%]  bg-white p-2 border-2 border-input-border rounded-lg ",
              copied ? "visible" : "hidden"
            )}
          >
            <p className="text-Base-normal text-text-description">Copied!</p>
          </div>
          <div className="flex justify-between border-b-[1px] pb-6 border-[#D5D5D5] ">
            <h1 className="text-LG-strong">Details</h1>
            <CloseOutlined
              style={{ color: "#676767" }}
              onClick={handleCloseDetailExecutivePopup}
            />
          </div>
          <div className="mt-6">
            {dataLeakedDetails &&
              Object.entries(dataLeakedDetails).map(([key, values]) => {
                console.log("key (details): ", key);
                console.log("values (details): ", values);
                return (
                  <div className="mt-8" key={key}>
                    <h1 className="text-LG-strong">
                      {" "}
                      {Array.isArray(values) ? (
                        <></>
                      ) : typeof values === "object" ? (
                        Object.entries(values).map(([k, v]) => <></>)
                      ) : (
                        <p>{key}</p>
                      )}{" "}
                    </h1>
                    <h2
                      className="text-text-description text-LG-normal mt-1"
                      style={{
                        maxWidth: "450px",
                        wordWrap: "break-word",
                      }}
                    >
                      {Array.isArray(values) ? (
                        ""
                      ) : typeof values === "object" ? (
                        Object.entries(values).map(([k, v]) => (
                          <p key={k}>{/* {k} : {v} */}</p>
                        ))
                      ) : (
                        <p>{values}</p>
                      )}
                    </h2>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* (superadmin) */}

      {/* Start of: (superadmin) :-Add domain Features */}
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          successStateAddDomain ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg text-center">
          <CheckCircleIcon className={clsx("text-success-chart size-10")} />
          <p className={clsx("text-text-description text-Base-normal mt-4")}>
            Success Adding{" "}
            <span className="text-Base-strong">{emailChoosenAddDomain}</span> to{" "}
            <span className="text-Base-strong">{usersChoosedAddDomain}</span>{" "}
            <span className="text-Base-strong">{role}</span> <br />
          </p>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          errorStateAddDomain ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg text-center">
          <ErrorIcon className={clsx("text-error size-10")} />
          <p className={clsx("text-text-description text-Base-normal mt-4")}>
            Opps.. Error has occured <br />
            <span className="text-Base-strong">{errorMsgAddDomain}</span>
          </p>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          addDomainConfirmation ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] w-[400px] rounded-lg">
          <h1 className="text-black text-LG-strong mb-2">
            Add domain confirmation
          </h1>
          <p className="text-Base-normal text-text-description">
            Are you sure you want to add domain{" "}
            <span className="text-Base-strong">{emailChoosenAddDomain}</span> to{" "}
            <span className="text-Base-strong">{usersChoosedAddDomain}</span>{" "}
            {role}?
          </p>
          <div className="mt-[24px] ml-auto flex justify-end">
            <button
              className={clsx(
                " bg-white text-primary-base py-[4px] px-4 border-[1px] border-[#D5D5D5] text-Base-normal rounded-[6px]"
              )}
              onClick={handleAddDomainConfirmationCancel}
            >
              Cancel
            </button>
            <button
              className={clsx(
                "ml-[8px] bg-primary-base text-white py-[4px] px-4 border-[1px] border-primary-base text-Base-normal rounded-[6px]"
              )}
              onClick={handleAddDomainConfirmationYes}
            >
              Yes, sure
            </button>
          </div>
        </div>
      </div>

      {/* Start of: Add Url Domain - Edit Users page */}
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isSuccessAddUrlDomain ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg text-center">
          <CheckCircleIcon className={clsx("text-success-chart size-10")} />
          <p className={clsx("text-text-description text-Base-normal mt-4")}>
            Success Adding{" "}
            <span className="text-Base-strong italic">
              {finalUrlAllDomain.join(", ")}
            </span>{" "}
            domains to this user?
          </p>
          <button
            className={clsx(
              " bg-primary-base text-white py-[4px] px-4 border-[1px] border-primary-base text-Base-normal rounded-[6px] mt-8"
            )}
            onClick={handleSuccessStatePopup}
          >
            Close
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isErrorAddUrlDomain ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg text-center">
          <ErrorIcon className={clsx("text-error size-10")} />
          <p className={clsx("text-text-description text-Base-normal mt-4")}>
            Opps.. Error has occured <br />
            <span className="text-Base-strong">{errorMsgForAddUrlDomain}</span>
          </p>
          <button
            className={clsx(
              " bg-primary-base text-white py-[4px] px-4 border-[1px] border-primary-base text-Base-normal rounded-[6px] mt-8"
            )}
            onClick={handleErrorStatePopup}
          >
            Close
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isConfirmAddDomainForUsers ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] w-[400px] rounded-lg">
          <h1 className="text-black text-LG-strong mb-2">
            Add domains confirmation
          </h1>
          <p className="text-Base-normal text-text-description">
            Are you sure you want to add this{" "}
            <span className="text-Base-strong italic">
              {finalUrlAllDomain.join(", ")}
            </span>{" "}
            domains to this user?
          </p>
          <div className="mt-[24px] ml-auto flex justify-end">
            <button
              className={clsx(
                " bg-white text-primary-base py-[4px] px-4 border-[1px] border-[#D5D5D5] text-Base-normal rounded-[6px]"
              )}
              onClick={handleAddDomainsUrlCancelConfirmation}
            >
              Cancel
            </button>
            <button
              className={clsx(
                "ml-[8px] bg-primary-base text-white py-[4px] px-4 border-[1px] border-primary-base text-Base-normal rounded-[6px]"
              )}
              onClick={handleAddDomainsUrlYesConfirmation}
            >
              Yes, sure
            </button>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          addDomainPopUpStatus ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] w-[680px] rounded-lg">
          <div className={clsx("flex justify-between")}>
            <h1 className="text-black text-LG-strong mb-2">Add Domains</h1>
            <CloseOutlined
              style={{ color: "#676767" }}
              onClick={handleAddDomainCancel}
            />
          </div>
          <div className={clsx("mt-6  px-2 max-h-[390px] overflow-y-scroll")}>
            {urlAllDomain.map((item, index) => (
              <div
                key={item.id}
                className={clsx("flex justify-between items-center")}
              >
                <Form.Item
                  label={"Url"}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={clsx("text-Base-normal text-[#000000E0] w-full")}
                >
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleAddUrlDomain(e, item.id)}
                    value={item.value}
                    // defaultValue={item.value}
                  />
                </Form.Item>
                <DeleteOutlineIcon
                  className={clsx(
                    "ml-4 text-[#00000040] text-[20px] ",
                    index === 0 ? "hidden" : "visible"
                  )}
                  onClick={() => handleDeleteAddDomainUrl(item.id)}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 ml-auto flex justify-end">
            <button
              className={clsx(
                " bg-white text-primary-base py-[4px] px-4 border-[1px] border-[#D5D5D5] text-Base-normal rounded-[6px]"
              )}
              onClick={handleAddDomainUrl}
            >
              Add input
            </button>
            <button
              className={clsx(
                "ml-[8px] bg-primary-base text-white py-[4px] px-4 border-[1px] border-primary-base text-Base-normal rounded-[6px]"
              )}
              onClick={handleAddDomainYes}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* End of: Add Url Domain - Edit Users page */}

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center",
          isAddDomainPopup ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg max-w-[750px] w-[750px] max-h-[450px] h-[450px]">
          <div
            className={clsx(
              "text-Base-normal text-text-description mb-4 flex justify-between"
            )}
          >
            <h1>{emailChoosenAddDomain}</h1>
            <CloseOutlined
              style={{ color: "#676767" }}
              onClick={handleCloseIsAddDomainPopup}
            />
          </div>
          <div className={clsx("flex items-center justify-between")}>
            <h1 className={clsx("text-black text-LG-strong")}>User list</h1>
          </div>
          <div className={clsx("my-4 grid grid-cols-2 mb-4")}>
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    activeBorderColor: "#FF6F1E",
                  },
                },
                token: {
                  colorPrimary: "#FF6F1E",
                },
              }}
            >
              <Input
                placeholder="Search user emails"
                allowClear={false}
                style={{ width: 400 }}
                variant="filled"
                addonAfter={<SearchOutlined />}
                onChange={(e) => handleAddDomainSearch(e)}
                value={addDomainSearch}
                size="large"
              />
            </ConfigProvider>
            <div className={clsx("flex items-center justify-end")}>
              <div>
                <Form.Item
                  // label={"Role"}
                  // name={"role"}
                  // layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{ marginBottom: "0", width: 100 }}
                >
                  <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                    <Select
                      defaultValue={"user"}
                      options={addDomainSelectOptions}
                      size="large"
                      value={role}
                      onChange={handleRoleChange}
                    />
                  </ConfigProvider>
                </Form.Item>
              </div>
              <button
                className={clsx(
                  "py-[5px] px-4  rounded-[6px] border-[1px]  text-Base-normal ml-[9px] h-auto",
                  emailChoosedAddDomain.length === 0
                    ? "bg-[#0000000A] border-[#D5D5D5] text-[#00000040]"
                    : "bg-primary-base border-primary-base text-white"
                )}
                onClick={handleAddDomainConfirmationPopUp}
                disabled={emailChoosedAddDomain.length === 0}
              >
                Add Domain
              </button>
            </div>
          </div>
          <div
            className={clsx("overflow-scroll h-[270px] ")}
            onScroll={(e) => handleScrollUserList(e)}
          >
            {Array.isArray(userListAddDomain) &&
              userListAddDomain.map((data) => (
                <div
                  className={clsx(
                    "flex items-center mb-4 cursor-pointer w-[60%] transition-all p-2 rounded-md",
                    data.id === emailChoosedAddDomain
                      ? "bg-primary-base text-white"
                      : "hover:bg-[#edebeb]"
                  )}
                  onClick={() => handleChooseEmailForAddDomain(data)}
                  key={data.id}
                >
                  <EmailIcon
                    className={clsx(
                      data.id === emailChoosedAddDomain
                        ? "text-white"
                        : "text-[#00000073]",
                      "size-[20px]"
                    )}
                  />
                  <p
                    className={clsx(
                      " text-Base-normal ml-[8px]",
                      data.id === emailChoosedAddDomain
                        ? "text-white"
                        : "text-[#000000]"
                    )}
                  >
                    {data.email}
                  </p>
                </div>
              ))}
            {typeof userListAddDomain === "string" && (
              <p className={clsx("text-Base-normal text-[#CF1322]")}>
                {" "}
                {userListAddDomain}{" "}
              </p>
            )}
            {isLoadingUserListAddDomain ? (
              <div className={clsx("ml-[32px]")}>
                <LoadingOutlined className={clsx("text-primary-base")} />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* End of: (superadmin) - Add domain Features */}

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isDetailsEditChangeDomainAccount ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">
            Are you sure you want Change this domain for this account?
          </h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            this action cannot be undone
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <button
                className="py-2 px-4 rounded-md text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer  "
                onClick={handleCancelChangeDomain}
              >
                Cancel
              </button>
            </div>
            <div className="ml-4">
              <button
                onClick={handleYesEditDomain}
                className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isDetailsEditDeleteDomainAccount ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">
            Are you sure you want Delete this domain for this account?
          </h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            this action cannot be undone
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <button
                className="py-2 px-4 rounded-md text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer  "
                onClick={handleCancelDeleteDomain}
              >
                Cancel
              </button>
            </div>
            <div className="ml-4">
              <button
                onClick={handleYesDeleteDomain}
                className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isDetailsEditUsersAccount ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">
            Are you sure you want to save this changes account?
          </h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            this action cannot be undone
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <button
                className="py-2 px-4 rounded-md text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer  "
                onClick={handleCancelEditUsers}
              >
                Cancel
              </button>
            </div>
            <div className="ml-4">
              <button
                onClick={handleYesEditUsers}
                className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isDetailsDeactivateAccount ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">
            Are you sure to {verifiedAccountStatus ? "Deactivate" : "Activate"}{" "}
            this Account?
          </h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            this action cannot be undone
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <button
                className="py-2 px-4 rounded-md text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer  "
                onClick={handleCancelDeactivateAccount}
              >
                Cancel
              </button>
            </div>
            <div className="ml-4">
              <button
                onClick={handleYesDeactivateAccount}
                className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center",
          confirmAddUserRole ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">Are you sure to Add this Users?</h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            this action cannot be undone
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <button
                className="py-2 px-4 rounded-md text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer  "
                onClick={handleCancelAddUserRole}
              >
                Cancel
              </button>
            </div>
            <div className="ml-4">
              <button
                onClick={handleYesAddUserRole}
                className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          successCompressTxt ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[35%]">
          <div className="flex justify-between items-center">
            <h1 className="text-LG-strong  ">Compress TXT</h1>
            <div
              onClick={handleCloseSuccessPopupCompressTxt}
              className="cursor-pointer"
            >
              <CloseOutlinedIcon />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="mb-4">
              <Image
                alt="Success upload txt"
                src={"/images/Success_upload_txt.svg"}
                width={73}
                height={73}
                className="mx-auto"
              />
            </div>
            <h2 className="text-LG-strong text-black">Compress successful!</h2>
            <p className="text-Base-normal text-text-description mt-1">
              {" "}
              {successMessageCompressTxt}{" "}
            </p>
          </div>
          <div className="mt-4 flex justify-end ">
            <button
              onClick={handleCloseSuccessPopupCompressxtAndRedirectToUsers}
              className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          successUploadTxt ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[35%]">
          <div className="flex justify-between items-center">
            <h1 className="text-LG-strong  ">Upload TXT</h1>
            <div
              onClick={handleCloseSuccessPopupUploadTxt}
              className="cursor-pointer"
            >
              <CloseOutlinedIcon />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="mb-4">
              <Image
                alt="Success upload txt"
                src={"/images/Success_upload_txt.svg"}
                width={73}
                height={73}
                className="mx-auto"
              />
            </div>
            <h2 className="text-LG-strong text-black">Upload successful!</h2>
            <p className="text-Base-normal text-text-description mt-1">
              {" "}
              {successMessageUploadTxt}{" "}
            </p>
          </div>
          <div className="mt-4 flex justify-end ">
            <button
              onClick={handleCloseSuccessPopupUploadTxtAndRedirectToUsers}
              className="py-2 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center",
          isUploadTxt ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[35%]">
          <div className="flex justify-between items-center">
            <h1 className="text-LG-strong  ">Upload TXT</h1>
            <div onClick={handleCloseUploadTxt} className="cursor-pointer">
              <CloseOutlinedIcon />
            </div>
          </div>
          <div className="mt-4">
            <Dragger
              {...uploadTxtProps}
              // accept=".txt"
              // multiple={false}
              // maxCount={1}
              // name="upload_txt"
              // //   customRequest={handleSubmitUploadTxt}
              // onChange={handleUploadFile}
              // onDrop={handleDropFile}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#FF6F1E" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single file with TXT Format upload. (Max. 1 MB)
              </p>
            </Dragger>
            <button
              className=" mt-6 bg-white border-[1px] border-[#D5D5D5] rounded-md  text-primary-base text-Base-normal py-1.5 px-3 text-center w-full "
              onClick={handleSubmitUploadCompressTxt}
            >
              Compress TXT
            </button>
            <button
              className=" mt-2 bg-[#1677FF] rounded-md  text-white text-Base-normal py-1.5 px-3 text-center w-full "
              onClick={handleSubmitUploadTxt}
            >
              Upload TXT
            </button>
            <p
              className={clsx(
                "mt-2 text-SM-normal text-[#FF4D4F]",
                isExceeds1Mb ? "visible" : "hidden"
              )}
            >
              {exceeds1MbMessage}
            </p>
          </div>
          <div className="mt-8 flex justify-end "></div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center",
          isSuccessAddUserRole ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[25%]">
          <div className="mx-auto">
            <Image
              src={"/images/sector_image_auth_lock.svg"}
              alt="image logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
          <h1 className="text-LG-strong text-center ">Account created</h1>
          <p className="text-Base-normal text-text-description mt-2 text-center">
            Create account has been created successfully!
          </p>
          <div className="mt-8 flex justify-end ">
            <div className="ml-4">
              <button
                onClick={handleDoneSuccessAddUserRole}
                className="py-1 px-4 rounded-md text-Base-normal border-[1px]  hover:opacity-80 cursor-pointer text-white bg-primary-base border-primary-base"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center",
          sessionExpiredRefreshToken ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">User session expired</h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            You have been logged out. if you still operating this site you must
            re-Login
          </p>
          <p className="text-Base-strong text-primary-base mt-6">
            You will automatically redirected to Login Page or You can
            immedieately to Login Page by Clicking the button below
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <PrimaryButton value={"Login"} href={"/auth/login"} />
            </div>
          </div>
        </div>
      </div>

      <div className={clsx(logoutLoading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <nav className="py-3 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-10 bg-white border-b-2 border-b-input-border">
        <Image
          src={"/images/SectorOne.png"}
          alt="Logo Sector"
          width={120}
          height={38}
        />
        <div className="flex items-center">
          <div
            className={clsx(
              "cursor-pointer rounded-[6px] bg-[#1677FF] py-1.5 px-4 mr-4 flex items-center"
              // getCookie("user_status") === "true" ? "visible" : "hidden"
            )}
            onClick={handleIsUploadToTxt}
          >
            <p className="text-Base-normal text-white ">Upload TXT</p>
          </div>

          <div className="cursor-pointer" onClick={toggleAccount}>
            <AccountCircleOutlinedIcon
              style={{ fontSize: "28px", color: "#676767" }}
            />
          </div>
          <div
            className={clsx(
              "fixed right-[48px] top-[50px] bg-white p-[16px] shadow-xl rounded-2xl transition-all ",
              accountShow ? "visible" : "hidden"
            )}
          >
            <p className="text-heading-5"> {usersData && usersData} </p>
            <div className="w-full h-[1px] bg-input-border my-[16px]"></div>
            <div
              className="flex items-center cursor-pointer"
              onClick={fetchLogoutFunctionWithRefreshToken}
            >
              <div>
                <Image
                  src={"/images/image_logout.svg"}
                  alt="Avatar Profile"
                  width={16}
                  height={16}
                />
              </div>
              <p className="text-[#FF4D4F] ml-[8px] text-Base-normal">
                Log out of account
              </p>
            </div>
          </div>
        </div>
      </nav>
      <section className="bg-input-container flex relative">
        <div
          className={clsx(
            "fixed top-[50px] left-[50%] translate-x-[-50%] bg-white p-[20px] shadow-lg transition-all",
            errorLogout ? "visible" : "hidden"
          )}
        >
          <h1 className="text-text-description ">
            Oops ada keslaahan saat Logout
          </h1>
        </div>
        <aside
          className={clsx(
            " h-auth-screen  flex-none transition-all fixed left-0 bottom-0 bg-white z-10 border-t-2 border-t-input-border shadow-lg ",
            hide ? "w-[76px]" : "w-[260px] overflow-x-hidden overflow-y-hidden"
          )}
        >
          {/* <div className="mt-2 flex justify-end mr-5">
            <MenuFoldOutlined
              style={{ fontSize: "20px" }}
              className={clsx(
                "cursor-pointer mt-3",
                hide ? "hidden" : "visible"
              )}
              onClick={toggleHideIcon}
            />
            <MenuUnfoldOutlined
              style={{ fontSize: "20px" }}
              className={clsx(
                "cursor-pointer mt-3",
                hide ? "visible" : "hidden"
              )}
              onClick={toggleHideIcon}
            />
          </div> */}
          <Sidenav />
          <ConfigProvider
            theme={{
              components: {
                Popover: {
                  titleMinWidth: 15,
                  colorBgElevated: "#000000E0",
                  colorText: "#FFFFFF",
                  fontFamily: "inherit",
                  lineHeight: 0,
                  fontSize: 12,
                },
              },
            }}
          >
            <Popover content={hide ? "Show" : "Hide"} placement="right">
              <div
                className={clsx(
                  "bg-white  w-[32px] h-[32px] rounded-full fixed top-[208px] transition-all z-10 flex items-center justify-center cursor-pointer shadow-lg",
                  hide ? "left-[61px]" : "left-[240px]"
                )}
                onClick={toggleHideIcon}
              >
                <LeftOutlined
                  style={{ fontSize: "12px" }}
                  className={clsx(
                    "cursor-pointer",
                    hide ? "hidden" : "visible"
                  )}
                />
                <RightOutlined
                  style={{ fontSize: "12px" }}
                  className={clsx(
                    "cursor-pointer",
                    hide ? "visible" : "hidden"
                  )}
                />
              </div>
            </Popover>
          </ConfigProvider>
        </aside>
        <div
          className={clsx(
            "flex-grow min-h-screen h-full  min-w-screen w-full fixed bg-input-container left-0 right-0 overflow-y-auto  pt-[75px] transition-all pr-[32px] pb-[64px]",
            hide ? "pl-[104px]" : "pl-[290px]"
          )}
        >
          {children}
        </div>
      </section>
    </main>
  );
}
