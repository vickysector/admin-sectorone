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
  setConfirmDetailUserDeactivateState,
  setDetailUserDeactivateFunction,
} from "@/app/_lib/store/features/Users/DetailUserSlice";

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
  const [allDomain, setAllDomain] = useState();
  const [protectionCredits, setProtectionCredits] = useState("");
  const [keywordCredits, setKeywordCredits] = useState("");
  const [triggerChange, setTriggerChange] = useState(false);

  // End of: State

  //   Start of: Functions Handler

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleDemoChange = (checked) => {
    setDemo(checked);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDeactivateAccounts = () => {
    dispatch(setConfirmDetailUserDeactivateState(true));
    dispatch(
      setDetailUserDeactivateFunction(
        PostActiveOrDeactivateAccountWithRefreshToken
      )
    );
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

  useEffect(() => {
    setTriggerChange(false);
    FetchAllRolesWithRefreshToken();
    FetchDetailsDataWithRefreshToken();
    FetchDetailsDataDomainWithRefreshToken();
  }, [triggerChange]);

  // End of: API Intregations

  console.log("all domain: ", allDomain);

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
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={handleDeactivateAccounts}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button> */}
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
              >
                Save
              </button> */}
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  {/* <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Full Access" : "Demo"} Mode
                  </h2> */}
                  <h2 className="text-text-description text-Base-normal mb-1">
                    Users is on{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {demo ? "Demo" : "Full Access"}
                    </span>{" "}
                    Mode
                  </h2>
                  {/* <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p> */}
                  <p className="text-text-description text-Base-normal">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified
                        ? "Active"
                        : "Inactive"}
                    </span>{" "}
                    and ready to be used.
                  </p>
                </div>
                <div>
                  {/* <ConfigProvider
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
                      disabled
                    />
                  </ConfigProvider> */}
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <Form.Item
                  label={"Role"}
                  name={role}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                    <Select
                      defaultValue={detailsData && detailsData.role}
                      options={selectOptions}
                      size="large"
                      value={role}
                      onChange={handleRoleChange}
                      disabled
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item
                  label={"Name"}
                  name={name}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={clsx("text-Base-normal text-[#000000E0]")}
                >
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleNameChange(e)}
                    value={name}
                    defaultValue={name}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Phone number"}
                  name={phone}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="08123456789"
                    variant="filled"
                    size="large"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e)}
                    defaultValue={phone}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Email"}
                  name={email}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="john@gmail.com"
                    variant="filled"
                    size="large"
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    defaultValue={email}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Executive protection credits"}
                  name={protectionCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={protectionCredits}
                    // onChange={(e) => handlePhoneChange(e)}
                    defaultValue={protectionCredits}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Search by keywords credits"}
                  name={keywordCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={keywordCredits}
                    // onChange={(e) => handleEmailChange(e)}
                    defaultValue={keywordCredits}
                    disabled
                  />
                </Form.Item>
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
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={handleDeactivateAccounts}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button> */}
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
              >
                Save
              </button> */}
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  {/* <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Full Access" : "Demo"} Mode
                  </h2> */}
                  <h2 className="text-text-description text-Base-normal mb-1">
                    Users is on{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {demo ? "Demo" : "Full Access"}
                    </span>{" "}
                    Mode
                  </h2>
                  {/* <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p> */}
                  <p className="text-text-description text-Base-normal">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified
                        ? "Active"
                        : "Inactive"}
                    </span>{" "}
                    and ready to be used.
                  </p>
                </div>
                <div>
                  {/* <ConfigProvider
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
                      disabled
                    />
                  </ConfigProvider> */}
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <Form.Item
                  label={"Role"}
                  name={role}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                    <Select
                      defaultValue={detailsData && detailsData.role}
                      options={selectOptions}
                      size="large"
                      value={role}
                      onChange={handleRoleChange}
                      disabled
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item
                  label={"Name"}
                  name={name}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={clsx("text-Base-normal text-[#000000E0]")}
                >
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleNameChange(e)}
                    value={name}
                    defaultValue={name}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Phone number"}
                  name={phone}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="08123456789"
                    variant="filled"
                    size="large"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e)}
                    defaultValue={phone}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Email"}
                  name={email}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="john@gmail.com"
                    variant="filled"
                    size="large"
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    defaultValue={email}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Executive protection credits"}
                  name={protectionCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={protectionCredits}
                    // onChange={(e) => handlePhoneChange(e)}
                    defaultValue={protectionCredits}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Search by keywords credits"}
                  name={keywordCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={keywordCredits}
                    // onChange={(e) => handleEmailChange(e)}
                    defaultValue={keywordCredits}
                    disabled
                  />
                </Form.Item>
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
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={handleDeactivateAccounts}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button> */}
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
              >
                Save
              </button> */}
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  {/* <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Full Access" : "Demo"} Mode
                  </h2> */}
                  <h2 className="text-text-description text-Base-normal mb-1">
                    Users is on{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {demo ? "Demo" : "Full Access"}
                    </span>{" "}
                    Mode
                  </h2>
                  {/* <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p> */}
                  <p className="text-text-description text-Base-normal">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified
                        ? "Active"
                        : "Inactive"}
                    </span>{" "}
                    and ready to be used.
                  </p>
                </div>
                <div>
                  {/* <ConfigProvider
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
                      disabled
                    />
                  </ConfigProvider> */}
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <Form.Item
                  label={"Role"}
                  name={role}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                    <Select
                      defaultValue={detailsData && detailsData.role}
                      options={selectOptions}
                      size="large"
                      value={role}
                      onChange={handleRoleChange}
                      disabled
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item
                  label={"Name"}
                  name={name}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={clsx("text-Base-normal text-[#000000E0]")}
                >
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleNameChange(e)}
                    value={name}
                    defaultValue={name}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Phone number"}
                  name={phone}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="08123456789"
                    variant="filled"
                    size="large"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e)}
                    defaultValue={phone}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Email"}
                  name={email}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="john@gmail.com"
                    variant="filled"
                    size="large"
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    defaultValue={email}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Executive protection credits"}
                  name={protectionCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={protectionCredits}
                    // onChange={(e) => handlePhoneChange(e)}
                    defaultValue={protectionCredits}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Search by keywords credits"}
                  name={keywordCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={keywordCredits}
                    // onChange={(e) => handleEmailChange(e)}
                    defaultValue={keywordCredits}
                    disabled
                  />
                </Form.Item>
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
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={handleDeactivateAccounts}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button> */}
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
              >
                Save
              </button> */}
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  {/* <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Full Access" : "Demo"} Mode
                  </h2> */}
                  <h2 className="text-text-description text-Base-normal mb-1">
                    Users is on{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {demo ? "Demo" : "Full Access"}
                    </span>{" "}
                    Mode
                  </h2>
                  {/* <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p> */}
                  <p className="text-text-description text-Base-normal">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified
                        ? "Active"
                        : "Inactive"}
                    </span>{" "}
                    and ready to be used.
                  </p>
                </div>
                <div>
                  {/* <ConfigProvider
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
                      disabled
                    />
                  </ConfigProvider> */}
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <Form.Item
                  label={"Role"}
                  name={role}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                    <Select
                      defaultValue={detailsData && detailsData.role}
                      options={selectOptions}
                      size="large"
                      value={role}
                      onChange={handleRoleChange}
                      disabled
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item
                  label={"Name"}
                  name={name}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={clsx("text-Base-normal text-[#000000E0]")}
                >
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleNameChange(e)}
                    value={name}
                    defaultValue={name}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Phone number"}
                  name={phone}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="08123456789"
                    variant="filled"
                    size="large"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e)}
                    defaultValue={phone}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Email"}
                  name={email}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="john@gmail.com"
                    variant="filled"
                    size="large"
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    defaultValue={email}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Executive protection credits"}
                  name={protectionCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={protectionCredits}
                    // onChange={(e) => handlePhoneChange(e)}
                    defaultValue={protectionCredits}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Search by keywords credits"}
                  name={keywordCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={keywordCredits}
                    // onChange={(e) => handleEmailChange(e)}
                    defaultValue={keywordCredits}
                    disabled
                  />
                </Form.Item>
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
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer `
                )}
                onClick={handleDeactivateAccounts}
              >
                {detailsData && detailsData.verified
                  ? "Deactivate"
                  : "Activate"}{" "}
                accounts
              </button> */}
              {/* <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
              >
                Save
              </button> */}
            </div>
          </div>
          <div>
            <div className="p-8 bg-white rounded-lg mt-8">
              <section className="flex items-center justify-between">
                <div>
                  {/* <h2 className="text-heading-5 text-black mb-1">
                    Users is on {demo ? "Full Access" : "Demo"} Mode
                  </h2> */}
                  <h2 className="text-text-description text-Base-normal mb-1">
                    Users is on{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {demo ? "Demo" : "Full Access"}
                    </span>{" "}
                    Mode
                  </h2>
                  {/* <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
                  </p> */}
                  <p className="text-text-description text-Base-normal">
                    This Account is currently{" "}
                    <span className={clsx("text-heading-5 text-black")}>
                      {detailsData && detailsData.verified
                        ? "Active"
                        : "Inactive"}
                    </span>{" "}
                    and ready to be used.
                  </p>
                </div>
                <div>
                  {/* <ConfigProvider
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
                      disabled
                    />
                  </ConfigProvider> */}
                </div>
              </section>
              <section className="mt-8 grid grid-cols-2 gap-4   ">
                <Form.Item
                  label={"Role"}
                  name={role}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                    <Select
                      defaultValue={detailsData && detailsData.role}
                      options={selectOptions}
                      size="large"
                      value={role}
                      onChange={handleRoleChange}
                      disabled
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item
                  label={"Name"}
                  name={name}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={clsx("text-Base-normal text-[#000000E0]")}
                >
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleNameChange(e)}
                    value={name}
                    defaultValue={name}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Phone number"}
                  name={phone}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="08123456789"
                    variant="filled"
                    size="large"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e)}
                    defaultValue={phone}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Email"}
                  name={email}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="john@gmail.com"
                    variant="filled"
                    size="large"
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    defaultValue={email}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Executive protection credits"}
                  name={protectionCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={protectionCredits}
                    // onChange={(e) => handlePhoneChange(e)}
                    defaultValue={protectionCredits}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={"Search by keywords credits"}
                  name={keywordCredits}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="10"
                    variant="filled"
                    size="large"
                    value={keywordCredits}
                    // onChange={(e) => handleEmailChange(e)}
                    defaultValue={keywordCredits}
                    disabled
                  />
                </Form.Item>
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
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section Admin */}
    </main>
  );
}
