"use client";

import { useRouter, redirect, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import {
  ADMIN_SECTION_ROLE_SECTION,
  MARKETING_SECTION_ROLE_SECTION,
  PARTNER_SECTION_ROLE_SECTION,
  SUPERADMIN_SECTION_ROLE_SECTION,
  USERS_SECTION_ROLE_SECTION,
} from "@/app/_lib/variables/Variables";
import { ConfigProvider, Form, Input, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { getCookie } from "cookies-next";
import {
  setConfirmDeleteDomain,
  setConfirmDetailUserDeactivateState,
  setConfirmEditDomain,
  setConfirmEditUsers,
  setDetailUserDeactivateFunction,
  setIdUsersForAddUrlDomain,
  setIsAddDomainStatus,
  setPostFunctionDeleteDomain,
  setPostFunctionEditDomain,
  setPostFunctionEditUsers,
  setVerifiedStatus,
} from "@/app/_lib/store/features/Users/DetailUserSlice";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { v4 as uuidv4 } from "uuid";

export default function DetailRoleUsers({ params }) {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  console.log("params: ", params);
  // End of: Redux

  // Start of: State

  const [selectOptions, setSelecOptions] = useState([]);
  const [detailsData, setDetailsData] = useState();
  const [role, setRole] = useState("");
  const [demo, setDemo] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [allDomain, setAllDomain] = useState({ data: [] });
  const [protectionCredits, setProtectionCredits] = useState("");
  const [keywordCredits, setKeywordCredits] = useState("");
  const [triggerChange, setTriggerChange] = useState(false);

  // End of: State

  // Start of: Edit Domain

  const [isDomainEdited, setIsDomainEdited] = useState("");
  const [IsAvailableForSaveDomain, setIsAvailableForSaveDomain] =
    useState(false);
  const [domain, setDomain] = useState([]);

  const handleSaveChangesDomain = () => {
    console.log("edited domain");
    dispatch(setConfirmEditDomain(true));
    dispatch(setPostFunctionEditDomain(EditDetailsDataDomainWithRefreshToken));
  };

  const handleAddUrlNewDomain = () => {
    // setAllDomain((prev) => ({
    //   ...prev,
    //   data: [...(prev?.data || []), { id: uuidv4(), domain: "" }],
    // }));
    console.log("handle add url");
    dispatch(setIsAddDomainStatus(true));
    dispatch(setIdUsersForAddUrlDomain(params.id_users));
  };

  const handleEditDomainChange = (event, domainId) => {
    // console.log("testing: ", event.target.value);
    setIsAvailableForSaveDomain(true);
    console.log(
      "edit domain (id): ",
      allDomain.data.filter((item) => item.id === domainId)
    );

    const editedDomain = allDomain.data
      .filter((item) => item.id === domainId)
      .map((item) => ({
        id_domain: item.id,
        domain: event.target.value,
      }));

    console.log("edit domain (total): ", editedDomain);
    const newEditedDomain = allDomain.data
      .map((item) => ({
        id_domain: item.id,
        domain: item.domain,
      }))
      .filter((item) => item.id_domain !== domainId);

    setDomain([...newEditedDomain, ...editedDomain]);
  };

  console.log("edit domain: ", domain);

  const handleSetIsDomainEdited = (domainId) => {
    setIsDomainEdited(domainId);
    setIsAvailableForSaveDomain(false);
    FetchDetailsDataDomainWithRefreshToken();
  };

  console.log("domain edited: ", isDomainEdited);

  const handleSetIsDomainEditedCancel = () => {
    setIsDomainEdited("");
    setIsAvailableForSaveDomain(false);
    FetchDetailsDataDomainWithRefreshToken();
  };

  const handleDeleteDomainById = (domainId) => {
    dispatch(setConfirmDeleteDomain(true));
    dispatch(
      setPostFunctionDeleteDomain(() =>
        DeleteDetailsDataDomainWithRefreshToken(domainId)
      )
    );
  };

  // End of: Edit Domain

  // Start of: Edit Functionality
  const [isRoleEdited, setIsRoleEdited] = useState(false);
  const [isNameEdited, setIsNameEdited] = useState(false);
  const [isPhoneEdited, setIsPhoneEdited] = useState(false);
  const [isEmailEdited, setIsEmailEdited] = useState(false);
  const [isProtectionCreditsEdited, setIsProtectionCreditsEdited] =
    useState(false);
  const [isKeywordCreditsEdited, setIsKeywordCreditsEdited] = useState(false);
  const [isDemoEdited, setIsDemoEdited] = useState(false);
  const [isAvailableForSaveRole, setIsAvailableForSaveRole] = useState(false);
  const [isAvailableForSaveName, setIsAvailableForSaveName] = useState(false);
  const [isAvailableForSavePhone, setIsAvailableForSavePhone] = useState(false);
  const [isAvailableForSaveEmail, setIsAvailableForSaveEmail] = useState(false);
  const [isAvailableForSaveProtections, setIsAvailableForSaveProtections] =
    useState(false);
  const [isAvailableForSaveKeyword, setIsAvailableForSaveKeyword] =
    useState(false);
  const [isAvailableForDemo, setIsAvailableForDemo] = useState(false);
  const [isAvailableForSave, setIsAvailableForSave] = useState(false);

  // const isAvailableForSave =
  //   isAvailableForDemo ||
  //   isAvailableForSaveRole ||
  //   isAvailableForSaveName ||
  //   isAvailableForSavePhone ||
  //   isAvailableForSaveEmail ||
  //   isAvailableForSaveProtections ||
  //   isAvailableForSaveKeyword;

  console.log("is available for save ", isAvailableForSave);

  const handleSetIsDemoEdited = () => {
    setIsDemoEdited(true);
  };

  const handleSetIsDemoEditedCancel = () => {
    setIsDemoEdited(false);
    setIsAvailableForDemo(false);
    FetchDetailsDataDemoWithRefreshToken();
  };

  const handleSetIsRoleEdited = () => {
    setIsRoleEdited(true);
  };

  const handleSetIsRoleEditedCancel = () => {
    setIsRoleEdited(false);
    setIsAvailableForSaveRole(false);
    FetchDetailsDataRoleWithRefreshToken();
  };

  const handleSetIsNameEdited = () => {
    setIsNameEdited(true);
  };

  const handleSetIsNameEditedCancel = () => {
    setIsNameEdited(false);
    setIsAvailableForSaveName(false);
    FetchDetailsDataNameWithRefreshToken();
  };

  const handleSetIsPhoneEdited = () => {
    setIsPhoneEdited(true);
  };

  const handleSetIsPhoneEditedCancel = () => {
    setIsPhoneEdited(false);
    setIsAvailableForSavePhone(false);
    FetchDetailsDataPhoneWithRefreshToken();
  };

  const handleSetIsEmailEdited = () => {
    setIsEmailEdited(true);
  };

  const handleSetIsEmailEditedCancel = () => {
    setIsEmailEdited(false);
    setIsAvailableForSaveEmail(false);
    FetchDetailsDataEmailWithRefreshToken();
  };

  const handleSetIsProtectionCreditsEdited = () => {
    setIsProtectionCreditsEdited(true);
  };

  const handleSetIsProtectionCreditsEditedCancel = () => {
    setIsProtectionCreditsEdited(false);
    setIsAvailableForSaveProtections(false);
    FetchDetailsDataProtectionCreditsWithRefreshToken();
  };

  const handleSetIsKeywordCreditsEdited = () => {
    setIsKeywordCreditsEdited(true);
  };

  const handleSetIsKeywordCreditsEditedCancel = () => {
    setIsKeywordCreditsEdited(false);
    setIsAvailableForSaveKeyword(false);
    FetchDetailsDataKeywordCreditsWithRefreshToken();
  };

  const handleSaveChanges = () => {
    if (isAvailableForSave) {
      dispatch(setConfirmEditUsers(true));
      dispatch(setPostFunctionEditUsers(PostEditUsersAccountithRefreshToken));
    } else {
      return;
    }
  };

  const clearAllEditState = () => {
    setIsRoleEdited(false);
    setIsNameEdited(false);
    setIsPhoneEdited(false);
    setIsEmailEdited(false);
    setIsProtectionCreditsEdited(false);
    setIsKeywordCreditsEdited(false);
    setIsDemoEdited(false);
    setIsAvailableForDemo(false);
    setIsAvailableForSaveEmail(false);
    setIsAvailableForSaveName(false);
    setIsAvailableForSavePhone(false);
    setIsAvailableForSaveProtections(false);
    setIsAvailableForSaveKeyword(false);
    setIsAvailableForSaveRole(false);
  };

  console.log("is available fo save ", isAvailableForSave);

  useEffect(() => {
    setIsAvailableForSave(
      isAvailableForDemo ||
        isAvailableForSaveRole ||
        isAvailableForSaveName ||
        isAvailableForSavePhone ||
        isAvailableForSaveEmail ||
        isAvailableForSaveProtections ||
        isAvailableForSaveKeyword
    );
  }, [
    isAvailableForDemo,
    isAvailableForSaveRole,
    isAvailableForSaveName,
    isAvailableForSavePhone,
    isAvailableForSaveEmail,
    isAvailableForSaveProtections,
    isAvailableForSaveKeyword,
  ]);

  // End of: Edit Functionality

  //   Start of: Functions Handler

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setIsAvailableForSaveRole(true);
  };

  const handleDemoChange = (checked) => {
    setDemo(checked);
    setIsAvailableForDemo(true);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setIsAvailableForSaveName(true);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    setIsAvailableForSavePhone(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsAvailableForSaveEmail(true);
  };

  const handleExecutiveCreditsChange = (event) => {
    setProtectionCredits(event.target.value);
    setIsAvailableForSaveProtections(true);
  };

  const handleKeywordCreditsChange = (event) => {
    setKeywordCredits(event.target.value);
    setIsAvailableForSaveKeyword(true);
  };

  const handleDeactivateAccounts = (status) => {
    dispatch(setConfirmDetailUserDeactivateState(true));
    dispatch(
      setDetailUserDeactivateFunction(
        PostActiveOrDeactivateAccountWithRefreshToken
      )
    );
    dispatch(setVerifiedStatus(status));
    // PostActiveOrDeactivateAccountWithRefreshToken();
  };

  //   End of: Functions Handler

  // Start of: API Intregations

  const FetchAllRoles = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/all/role`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        const updatedData = data.data.map((item) => {
          return {
            value: item.name_role,
            label:
              item.name_role.charAt(0).toUpperCase() + item.name_role.slice(1),
          };
        });

        setSelecOptions(updatedData);

        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchAllRolesWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchAllRoles, router, dispatch);
  };

  const FetchDetailsData = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setDetailsData(data.data);
        setRole(data.data.role);
        setName(data.data.name);
        setPhone(data.data.phone);
        setEmail(data.data.email);
        setDemo(data.data.is_demo);
        setProtectionCredits(data.data.credit_executive);
        setKeywordCredits(data.data.credit_keyword);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsData, router, dispatch);
  };

  // Start of: fetch Detail Data ndividual

  const FetchDetailsDataDemo = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setDemo(data.data.is_demo);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataDemoWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsDataDemo, router, dispatch);
  };

  const FetchDetailsDataRole = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setRole(data.data.role);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataRoleWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsDataRole, router, dispatch);
  };

  const FetchDetailsDataName = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setName(data.data.name);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataNameWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsDataName, router, dispatch);
  };

  const FetchDetailsDataPhone = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setPhone(data.data.phone);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataPhoneWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsDataPhone, router, dispatch);
  };

  const FetchDetailsDataEmail = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setEmail(data.data.email);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataEmailWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsDataEmail, router, dispatch);
  };

  const FetchDetailsDataProtectionCredits = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setProtectionCredits(data.data.credit_executive);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataProtectionCreditsWithRefreshToken = async () => {
    await fetchWithRefreshToken(
      FetchDetailsDataProtectionCredits,
      router,
      dispatch
    );
  };

  const FetchDetailsDataKeywordCredits = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/user/${params.id_users}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setKeywordCredits(data.data.credit_keyword);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error user status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataKeywordCreditsWithRefreshToken = async () => {
    await fetchWithRefreshToken(
      FetchDetailsDataKeywordCredits,
      router,
      dispatch
    );
  };
  // End of: Fetch Detail Data Individual

  const EditDetailsDataDomain = async (domainId) => {
    console.log("domain status final: ", domain);
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}root/admin/domain`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(domain),
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details edit domain status: ", data);

      if (data.success === false) {
        throw res;
      }

      if (data.success) {
        setTriggerChange(true);
        setIsDomainEdited("");
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error edit domain status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const EditDetailsDataDomainWithRefreshToken = async () => {
    await fetchWithRefreshToken(EditDetailsDataDomain, router, dispatch);
  };

  const DeleteDetailsDataDomain = async (domainId) => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}root/admin/domain/${domainId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          // "Content-Type": "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details delete domain status: ", data);

      if (data.success === false) {
        throw res;
      }

      if (data.success) {
        setTriggerChange(true);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error delete domain status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const DeleteDetailsDataDomainWithRefreshToken = async (domainId) => {
    await fetchWithRefreshToken(
      DeleteDetailsDataDomain,
      router,
      dispatch,
      domainId
    );
  };

  const FetchDetailsDataDomain = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}root/admin/domain?id_user=${params.id_users}&page=1&size=10`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            // "Content-Type": "application/json",
          },
          // body: JSON.stringify({
          //   id_user: params.id_users,
          //   page: 1,
          //   size: 10,
          //   search: "",
          // }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("details data domain: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setAllDomain(data);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error domain status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDetailsDataDomainWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchDetailsDataDomain, router, dispatch);
  };

  const PostActiveOrDeactivateAccount = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);
      // dispatch(setTi);

      const res = await fetch(`${APIDATAV1}root/admin/deactive/user`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: params.id_users,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("deactivate status: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setTriggerChange(true);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error deactivate status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const PostActiveOrDeactivateAccountWithRefreshToken = async () => {
    await fetchWithRefreshToken(
      PostActiveOrDeactivateAccount,
      router,
      dispatch
    );
  };

  const PostEditUsersAccount = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);
      // dispatch(setTi);

      const res = await fetch(`${APIDATAV1}root/admin/user`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: params.id_users,
          email: email,
          role: role,
          name: name,
          phone: phone,
          credit_executive: Number(protectionCredits),
          credit_keyword: Number(keywordCredits),
          is_demo: demo,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("edit users status: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setTriggerChange(true);
        clearAllEditState();
        setIsAvailableForSave(false);
        return res;
      }

      //   return res;
    } catch (error) {
      console.log("error edit users status: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const PostEditUsersAccountithRefreshToken = async () => {
    await fetchWithRefreshToken(PostEditUsersAccount, router, dispatch);
  };

  useEffect(() => {
    setTriggerChange(false);
    FetchAllRolesWithRefreshToken();
    FetchDetailsDataWithRefreshToken();
    FetchDetailsDataDomainWithRefreshToken();
  }, [triggerChange]);

  // End of: API Intregations

  console.log("all domain ", allDomain);

  return (
    <main>
      {/* Section Users */}
      {params.type_users === USERS_SECTION_ROLE_SECTION && (
        <section>
          <div className={clsx("flex items-center justify-between mb-4")}>
            <div className="flex items-center">
              <div
                onClick={handleBackToAllcyberattacks}
                className="cursor-pointer"
              >
                <ArrowBackIcon />
              </div>
              <h1 className="text-heading-2 text-black  ml-4">Details</h1>
            </div>
            <div>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={() => handleDeactivateAccounts(detailsData.verified)}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                  isAvailableForSave
                    ? "text-white bg-primary-base"
                    : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                )}
                disabled={!isAvailableForSave}
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Demo" : "Full Access"} Mode
                  </h2>
                  {/* <h2 className="text-text-description text-Base-normal mb-1">
                    Users is on{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {demo ? "Demo" : "Full Access"}
                    </span>{" "}
                    Mode
                  </h2> */}
                  <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p>
                  <p className="text-text-description text-Base-normal mt-4 italic">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified ? (
                        <span className="text-primary-base"> Active</span>
                      ) : (
                        <span className="text-error">Inactive</span>
                      )}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex items-center">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#FF6F1E",
                      },
                    }}
                  >
                    <Switch
                      onChange={handleDemoChange}
                      value={demo}
                      defaultValue={demo}
                      disabled={!isDemoEdited}
                    />
                  </ConfigProvider>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEditedCancel}
                  />
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Role"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "FF6F1E" } }}
                    >
                      <Select
                        defaultValue={detailsData && detailsData.role}
                        options={selectOptions}
                        size="large"
                        value={role}
                        onChange={handleRoleChange}
                        disabled={!isRoleEdited}
                      />
                    </ConfigProvider>
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEditedCancel}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Name"}
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
                      onChange={(e) => handleNameChange(e)}
                      value={name}
                      defaultValue={name}
                      disabled={!isNameEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Phone number"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="08123456789"
                      variant="filled"
                      size="large"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                      defaultValue={phone}
                      disabled={!isPhoneEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Email"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="john@gmail.com"
                      variant="filled"
                      size="large"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                      defaultValue={email}
                      disabled={!isEmailEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Executive protection credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={protectionCredits}
                      onChange={(e) => handleExecutiveCreditsChange(e)}
                      defaultValue={protectionCredits}
                      disabled={!isProtectionCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Search by keywords credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={keywordCredits}
                      onChange={(e) => handleKeywordCreditsChange(e)}
                      defaultValue={keywordCredits}
                      disabled={!isKeywordCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEditedCancel}
                  />
                </div>
              </section>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <section className="flex items-center justify-between">
                <div
                  className={clsx("flex items-center justify-between w-full")}
                >
                  <h2 className="text-heading-4 text-black">URL list</h2>
                  <div>
                    <button
                      className={clsx(
                        `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                      )}
                      onClick={() => handleAddUrlNewDomain()}
                    >
                      Add URL
                    </button>
                    <button
                      className={clsx(
                        `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                        IsAvailableForSaveDomain
                          ? "text-white bg-primary-base"
                          : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                      )}
                      disabled={!IsAvailableForSaveDomain}
                      onClick={handleSaveChangesDomain}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
              <section className="bg-white rounded-md p-8 mt-4">
                {allDomain &&
                  allDomain.data.map((data) => (
                    <div
                      className="flex items-center justify-between"
                      key={data.id}
                    >
                      <Form.Item
                        label={"Url"}
                        name={data.domain}
                        layout="vertical"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        key={data.id}
                        className={clsx(
                          "text-Base-normal text-[#000000E0] w-full"
                        )}
                      >
                        <Input
                          placeholder="gmail.com"
                          variant="filled"
                          size="large"
                          onChange={(e) => handleEditDomainChange(e, data.id)}
                          value={data.domain}
                          defaultValue={data.domain}
                          disabled={isDomainEdited !== data.id}
                        />
                      </Form.Item>
                      <DeleteOutlineIcon
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited !== data.id ? "visible" : "hidden",
                          allDomain && allDomain.size > 1 ? "visible" : "hidden"
                        )}
                        onClick={() => handleDeleteDomainById(data.id)}
                      />
                      <EditOutlined
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited !== data.id ? "visible" : "hidden"
                        )}
                        onClick={() => handleSetIsDomainEdited(data.id)}
                      />
                      <CloseCircleOutlined
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited === data.id ? "visible" : "hidden"
                        )}
                        onClick={handleSetIsDomainEditedCancel}
                      />
                    </div>
                  ))}
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section Users */}

      {/* Section Marketing */}
      {params.type_users === MARKETING_SECTION_ROLE_SECTION && (
        <section>
          <div className={clsx("flex items-center justify-between mb-4")}>
            <div className="flex items-center">
              <div
                onClick={handleBackToAllcyberattacks}
                className="cursor-pointer"
              >
                <ArrowBackIcon />
              </div>
              <h1 className="text-heading-2 text-black  ml-4">Details</h1>
            </div>
            <div>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={() => handleDeactivateAccounts(detailsData.verified)}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                  isAvailableForSave
                    ? "text-white bg-primary-base"
                    : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                )}
                disabled={!isAvailableForSave}
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              {/* <section className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Demo" : "Full Access"} Mode
                  </h2>
              
                  <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p>
                  <p className="text-text-description text-Base-normal mt-4 italic">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified ? (
                        <span className="text-primary-base"> Active</span>
                      ) : (
                        <span className="text-error">Inactive</span>
                      )}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex items-center">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#FF6F1E",
                      },
                    }}
                  >
                    <Switch
                      onChange={handleDemoChange}
                      value={demo}
                      defaultValue={demo}
                      disabled={!isDemoEdited}
                    />
                  </ConfigProvider>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEditedCancel}
                  />
                </div>
              </section> */}
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Role"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "FF6F1E" } }}
                    >
                      <Select
                        defaultValue={detailsData && detailsData.role}
                        options={selectOptions}
                        size="large"
                        value={role}
                        onChange={handleRoleChange}
                        disabled={!isRoleEdited}
                      />
                    </ConfigProvider>
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEditedCancel}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Name"}
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
                      onChange={(e) => handleNameChange(e)}
                      value={name}
                      defaultValue={name}
                      disabled={!isNameEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Phone number"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="08123456789"
                      variant="filled"
                      size="large"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                      defaultValue={phone}
                      disabled={!isPhoneEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Email"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="john@gmail.com"
                      variant="filled"
                      size="large"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                      defaultValue={email}
                      disabled={!isEmailEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Executive protection credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={protectionCredits}
                      onChange={(e) => handleExecutiveCreditsChange(e)}
                      defaultValue={protectionCredits}
                      disabled={!isProtectionCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Search by keywords credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={keywordCredits}
                      onChange={(e) => handleKeywordCreditsChange(e)}
                      defaultValue={keywordCredits}
                      disabled={!isKeywordCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEditedCancel}
                  />
                </div>
              </section>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <section className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-4 text-black">URL list</h2>
                </div>
              </section>
              <section className="bg-white rounded-md p-8 mt-4">
                {allDomain &&
                  allDomain.data.map((data) => (
                    <Form.Item
                      label={"Url"}
                      name={data.domain}
                      layout="vertical"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      key={data.id}
                    >
                      <Input
                        placeholder="gmail.com"
                        variant="filled"
                        size="large"
                        // onChange={handleRequiredUrlChange}
                        value={data.domain}
                        defaultValue={data.domain}
                        disabled
                      />
                    </Form.Item>
                  ))}
                {!allDomain && (
                  <p className="text-text-description italic text-Base-normal">
                    No Url List yet
                  </p>
                )}
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section Marketing */}

      {/* Section Partner */}
      {params.type_users === PARTNER_SECTION_ROLE_SECTION && (
        <section>
          <div className={clsx("flex items-center justify-between mb-4")}>
            <div className="flex items-center">
              <div
                onClick={handleBackToAllcyberattacks}
                className="cursor-pointer"
              >
                <ArrowBackIcon />
              </div>
              <h1 className="text-heading-2 text-black  ml-4">Details</h1>
            </div>
            <div>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={() => handleDeactivateAccounts(detailsData.verified)}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                  isAvailableForSave
                    ? "text-white bg-primary-base"
                    : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                )}
                disabled={!isAvailableForSave}
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              {/* <section className="flex items-center justify-between">
              <div>
                <h2 className="text-heading-5 text-black mb-1">
                  Users is on {demo ? "Demo" : "Full Access"} Mode
                </h2>
            
                <p className="text-text-description text-Base-normal">
                  By activating this mode, users will be restricted from
                  accessing some features on the SectorOne dashboard.
                </p>
                <p className="text-text-description text-Base-normal mt-4 italic">
                  This Account is currently{" "}
                  <span className={clsx("text-heading-5 text-black")}>
                    {detailsData && detailsData.verified ? (
                      <span className="text-primary-base"> Active</span>
                    ) : (
                      <span className="text-error">Inactive</span>
                    )}
                  </span>{" "}
                </p>
              </div>
              <div className="flex items-center">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#FF6F1E",
                    },
                  }}
                >
                  <Switch
                    onChange={handleDemoChange}
                    value={demo}
                    defaultValue={demo}
                    disabled={!isDemoEdited}
                  />
                </ConfigProvider>
                <EditOutlined
                  className={clsx(
                    "ml-4 text-[#00000040] text-[20px] ",
                    !isDemoEdited ? "visible" : "hidden"
                  )}
                  onClick={handleSetIsDemoEdited}
                />
                <CloseCircleOutlined
                  className={clsx(
                    "ml-4 text-[#00000040] text-[20px] ",
                    isDemoEdited ? "visible" : "hidden"
                  )}
                  onClick={handleSetIsDemoEditedCancel}
                />
              </div>
            </section> */}
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Role"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "FF6F1E" } }}
                    >
                      <Select
                        defaultValue={detailsData && detailsData.role}
                        options={selectOptions}
                        size="large"
                        value={role}
                        onChange={handleRoleChange}
                        disabled={!isRoleEdited}
                      />
                    </ConfigProvider>
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEditedCancel}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Name"}
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
                      onChange={(e) => handleNameChange(e)}
                      value={name}
                      defaultValue={name}
                      disabled={!isNameEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Phone number"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="08123456789"
                      variant="filled"
                      size="large"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                      defaultValue={phone}
                      disabled={!isPhoneEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Email"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="john@gmail.com"
                      variant="filled"
                      size="large"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                      defaultValue={email}
                      disabled={!isEmailEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Executive protection credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={protectionCredits}
                      onChange={(e) => handleExecutiveCreditsChange(e)}
                      defaultValue={protectionCredits}
                      disabled={!isProtectionCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Search by keywords credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={keywordCredits}
                      onChange={(e) => handleKeywordCreditsChange(e)}
                      defaultValue={keywordCredits}
                      disabled={!isKeywordCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEditedCancel}
                  />
                </div>
              </section>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <section className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-4 text-black">URL list</h2>
                </div>
              </section>
              <section className="bg-white rounded-md p-8 mt-4">
                {allDomain &&
                  allDomain.data.map((data) => (
                    <Form.Item
                      label={"Url"}
                      name={data.domain}
                      layout="vertical"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      key={data.id}
                    >
                      <Input
                        placeholder="gmail.com"
                        variant="filled"
                        size="large"
                        // onChange={handleRequiredUrlChange}
                        value={data.domain}
                        defaultValue={data.domain}
                        disabled
                      />
                    </Form.Item>
                  ))}
                {!allDomain && (
                  <p className="text-text-description italic text-Base-normal">
                    No Url List yet
                  </p>
                )}
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section Partner */}

      {/* Section SuperAdmin */}
      {params.type_users === SUPERADMIN_SECTION_ROLE_SECTION && (
        <section>
          <div className={clsx("flex items-center justify-between mb-4")}>
            <div className="flex items-center">
              <div
                onClick={handleBackToAllcyberattacks}
                className="cursor-pointer"
              >
                <ArrowBackIcon />
              </div>
              <h1 className="text-heading-2 text-black  ml-4">Details</h1>
            </div>
            <div>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={() => handleDeactivateAccounts(detailsData.verified)}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                  isAvailableForSave
                    ? "text-white bg-primary-base"
                    : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                )}
                disabled={!isAvailableForSave}
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Demo" : "Full Access"} Mode
                  </h2>
                  {/* <h2 className="text-text-description text-Base-normal mb-1">
                  Users is on{" "}
                  <span className={clsx("text-heading-5 text-black")}>
                    {demo ? "Demo" : "Full Access"}
                  </span>{" "}
                  Mode
                </h2> */}
                  <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p>
                  <p className="text-text-description text-Base-normal mt-4 italic">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified ? (
                        <span className="text-primary-base"> Active</span>
                      ) : (
                        <span className="text-error">Inactive</span>
                      )}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex items-center">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#FF6F1E",
                      },
                    }}
                  >
                    <Switch
                      onChange={handleDemoChange}
                      value={demo}
                      defaultValue={demo}
                      disabled={!isDemoEdited}
                    />
                  </ConfigProvider>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEditedCancel}
                  />
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Role"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "FF6F1E" } }}
                    >
                      <Select
                        defaultValue={detailsData && detailsData.role}
                        options={selectOptions}
                        size="large"
                        value={role}
                        onChange={handleRoleChange}
                        disabled={!isRoleEdited}
                      />
                    </ConfigProvider>
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEditedCancel}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Name"}
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
                      onChange={(e) => handleNameChange(e)}
                      value={name}
                      defaultValue={name}
                      disabled={!isNameEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Phone number"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="08123456789"
                      variant="filled"
                      size="large"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                      defaultValue={phone}
                      disabled={!isPhoneEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Email"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="john@gmail.com"
                      variant="filled"
                      size="large"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                      defaultValue={email}
                      disabled={!isEmailEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Executive protection credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={protectionCredits}
                      onChange={(e) => handleExecutiveCreditsChange(e)}
                      defaultValue={protectionCredits}
                      disabled={!isProtectionCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Search by keywords credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={keywordCredits}
                      onChange={(e) => handleKeywordCreditsChange(e)}
                      defaultValue={keywordCredits}
                      disabled={!isKeywordCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEditedCancel}
                  />
                </div>
              </section>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <section className="flex items-center justify-between">
                <div
                  className={clsx("flex items-center justify-between w-full")}
                >
                  <h2 className="text-heading-4 text-black">URL list</h2>
                  <div>
                    {/* <button
                    className={clsx(
                      `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                    )}
                    onClick={() => handleAddUrlNewDomain()}
                  >
                    Add URL
                  </button> */}
                    <button
                      className={clsx(
                        `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                        IsAvailableForSaveDomain
                          ? "text-white bg-primary-base"
                          : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                      )}
                      disabled={!IsAvailableForSaveDomain}
                      onClick={handleSaveChangesDomain}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
              <section className="bg-white rounded-md p-8 mt-4">
                {allDomain &&
                  allDomain.data.map((data) => (
                    <div
                      className="flex items-center justify-between"
                      key={data.id}
                    >
                      <Form.Item
                        label={"Url"}
                        name={data.domain}
                        layout="vertical"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        key={data.id}
                        className={clsx(
                          "text-Base-normal text-[#000000E0] w-full"
                        )}
                      >
                        <Input
                          placeholder="gmail.com"
                          variant="filled"
                          size="large"
                          onChange={(e) => handleEditDomainChange(e, data.id)}
                          value={data.domain}
                          defaultValue={data.domain}
                          disabled={isDomainEdited !== data.id}
                        />
                      </Form.Item>
                      <DeleteOutlineIcon
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited !== data.id ? "visible" : "hidden",
                          allDomain && allDomain.size > 1 ? "visible" : "hidden"
                        )}
                        onClick={() => handleDeleteDomainById(data.id)}
                      />
                      <EditOutlined
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited !== data.id ? "visible" : "hidden"
                        )}
                        onClick={() => handleSetIsDomainEdited(data.id)}
                      />
                      <CloseCircleOutlined
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited === data.id ? "visible" : "hidden"
                        )}
                        onClick={handleSetIsDomainEditedCancel}
                      />
                    </div>
                  ))}
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section SuperAdmin */}

      {/* Section Admin */}
      {params.type_users === ADMIN_SECTION_ROLE_SECTION && (
        <section>
          <div className={clsx("flex items-center justify-between mb-4")}>
            <div className="flex items-center">
              <div
                onClick={handleBackToAllcyberattacks}
                className="cursor-pointer"
              >
                <ArrowBackIcon />
              </div>
              <h1 className="text-heading-2 text-black  ml-4">Details</h1>
            </div>
            <div>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={() => handleDeactivateAccounts(detailsData.verified)}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                  isAvailableForSave
                    ? "text-white bg-primary-base"
                    : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                )}
                disabled={!isAvailableForSave}
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Demo" : "Full Access"} Mode
                  </h2>
                  {/* <h2 className="text-text-description text-Base-normal mb-1">
                  Users is on{" "}
                  <span className={clsx("text-heading-5 text-black")}>
                    {demo ? "Demo" : "Full Access"}
                  </span>{" "}
                  Mode
                </h2> */}
                  <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p>
                  <p className="text-text-description text-Base-normal mt-4 italic">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified ? (
                        <span className="text-primary-base"> Active</span>
                      ) : (
                        <span className="text-error">Inactive</span>
                      )}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex items-center">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#FF6F1E",
                      },
                    }}
                  >
                    <Switch
                      onChange={handleDemoChange}
                      value={demo}
                      defaultValue={demo}
                      disabled={!isDemoEdited}
                    />
                  </ConfigProvider>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isDemoEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsDemoEditedCancel}
                  />
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Role"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "FF6F1E" } }}
                    >
                      <Select
                        defaultValue={detailsData && detailsData.role}
                        options={selectOptions}
                        size="large"
                        value={role}
                        onChange={handleRoleChange}
                        disabled={!isRoleEdited}
                      />
                    </ConfigProvider>
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isRoleEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsRoleEditedCancel}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Name"}
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
                      onChange={(e) => handleNameChange(e)}
                      value={name}
                      defaultValue={name}
                      disabled={!isNameEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isNameEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsNameEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Phone number"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="08123456789"
                      variant="filled"
                      size="large"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                      defaultValue={phone}
                      disabled={!isPhoneEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isPhoneEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsPhoneEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Email"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="john@gmail.com"
                      variant="filled"
                      size="large"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                      defaultValue={email}
                      disabled={!isEmailEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isEmailEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsEmailEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Executive protection credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={protectionCredits}
                      onChange={(e) => handleExecutiveCreditsChange(e)}
                      defaultValue={protectionCredits}
                      disabled={!isProtectionCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isProtectionCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsProtectionCreditsEditedCancel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Form.Item
                    label={"Search by keywords credits"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className={clsx("text-Base-normal text-[#000000E0] w-full")}
                  >
                    <Input
                      placeholder="10"
                      variant="filled"
                      size="large"
                      value={keywordCredits}
                      onChange={(e) => handleKeywordCreditsChange(e)}
                      defaultValue={keywordCredits}
                      disabled={!isKeywordCreditsEdited}
                    />
                  </Form.Item>
                  <EditOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      !isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEdited}
                  />
                  <CloseCircleOutlined
                    className={clsx(
                      "ml-4 text-[#00000040] text-[20px] ",
                      isKeywordCreditsEdited ? "visible" : "hidden"
                    )}
                    onClick={handleSetIsKeywordCreditsEditedCancel}
                  />
                </div>
              </section>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <section className="flex items-center justify-between">
                <div
                  className={clsx("flex items-center justify-between w-full")}
                >
                  <h2 className="text-heading-4 text-black">URL list</h2>
                  <div>
                    {/* <button
                    className={clsx(
                      `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                    )}
                    onClick={() => handleAddUrlNewDomain()}
                  >
                    Add URL
                  </button> */}
                    <button
                      className={clsx(
                        `py-2 px-4 rounded-md  text-Base-normal border-[1px] hover:opacity-80 cursor-pointer ml-4 `,
                        IsAvailableForSaveDomain
                          ? "text-white bg-primary-base"
                          : "bg-[#0000000A] border-[1px] border-[#D5D5D5] text-[#00000040]"
                      )}
                      disabled={!IsAvailableForSaveDomain}
                      onClick={handleSaveChangesDomain}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
              <section className="bg-white rounded-md p-8 mt-4">
                {allDomain &&
                  allDomain.data.map((data) => (
                    <div
                      className="flex items-center justify-between"
                      key={data.id}
                    >
                      <Form.Item
                        label={"Url"}
                        name={data.domain}
                        layout="vertical"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        key={data.id}
                        className={clsx(
                          "text-Base-normal text-[#000000E0] w-full"
                        )}
                      >
                        <Input
                          placeholder="gmail.com"
                          variant="filled"
                          size="large"
                          onChange={(e) => handleEditDomainChange(e, data.id)}
                          value={data.domain}
                          defaultValue={data.domain}
                          disabled={isDomainEdited !== data.id}
                        />
                      </Form.Item>
                      <DeleteOutlineIcon
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited !== data.id ? "visible" : "hidden",
                          allDomain && allDomain.size > 1 ? "visible" : "hidden"
                        )}
                        onClick={() => handleDeleteDomainById(data.id)}
                      />
                      <EditOutlined
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited !== data.id ? "visible" : "hidden"
                        )}
                        onClick={() => handleSetIsDomainEdited(data.id)}
                      />
                      <CloseCircleOutlined
                        className={clsx(
                          "ml-4 text-[#00000040] text-[20px] ",
                          isDomainEdited === data.id ? "visible" : "hidden"
                        )}
                        onClick={handleSetIsDomainEditedCancel}
                      />
                    </div>
                  ))}
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section Admin */}
    </main>
  );
}
