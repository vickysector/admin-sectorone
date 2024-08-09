"use client";

import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import { getCookie } from "cookies-next";
import Image from "next/image";
import {
  useRouter,
  redirect,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ConfigProvider,
  Table,
  Pagination,
  DatePicker,
  Spin,
  Select,
  Checkbox,
  Popover,
} from "antd";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import {
  ADMIN_SECTION_ROLE_SECTION,
  MARKETING_SECTION_ROLE_SECTION,
  PARTNER_SECTION_ROLE_SECTION,
  SUPERADMIN_SECTION_ROLE_SECTION,
  USERS_SECTION_ROLE_SECTION,
} from "@/app/_lib/variables/Variables";
import clsx from "clsx";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function UsersDashboardPage() {
  // Start of: Route Params

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  // End of: Route Params

  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: State
  const [selectedButton, setSelectedButton] = useState(
    searchParams.get("type") || PARTNER_SECTION_ROLE_SECTION
  );
  const [selectedOutlineButton, setSelectedOutlineButton] = useState(
    searchParams.get("demo") || "false"
  );
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10);
  const [allTableData, setAllTableData] = useState();
  const [totalData, setTotalData] = useState();
  const [sizeDataPerPage, setSizeDataPerPage] = useState();

  const [totalUsers, setTotalUsers] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [inactiveUsers, setInactiveUser] = useState();

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [inputSearch, setInputSearch] = useState(
    searchParams.get("search") || ""
  );

  //   End of: State

  // Start of: Get Data Users

  const FetchGetDataUserStatus = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}admin/count/user`, {
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

      console.log("data status role users: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setTotalUsers(data.data.all_user);
        setInactiveUser(data.data.deactive_user);
        setActiveUsers(data.data.active_user);

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

  const FetchGetDataUserStatusWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchGetDataUserStatus, router, dispatch);
  };

  useEffect(() => {
    FetchGetDataUserStatusWithRefreshToken();
  }, []);

  // End of: Get Data Users

  //   Start of: Get Table data by Partner

  const FetchGetAllTableData = async (type) => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}admin/user?page=${page}&limit=${limit}&search=${inputSearch}&type=${type}&is_demo=${selectedOutlineButton}&start_date=${startDate}&end_date=${endDate}`,
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

      console.log("all partner data: ", data);

      setAllTableData(data.data);

      setTotalData(data.count_data);
      setSizeDataPerPage(data.size);

      return res;
    } catch (error) {
      console.log("error partner Data: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchGetAllTableDataWithRefreshToken = async (type) => {
    await fetchWithRefreshToken(FetchGetAllTableData, router, dispatch, type);
  };

  useEffect(() => {
    switch (selectedButton) {
      case PARTNER_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(PARTNER_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page")
        ) {
          params.set("type", PARTNER_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case MARKETING_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(MARKETING_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page")
        ) {
          params.set("type", MARKETING_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case USERS_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(USERS_SECTION_ROLE_SECTION);

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page") ||
          !searchParams.has("demo")
        ) {
          params.set("type", USERS_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          params.set("demo", selectedOutlineButton);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case ADMIN_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(ADMIN_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page")
        ) {
          params.set("type", ADMIN_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case SUPERADMIN_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(SUPERADMIN_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page")
        ) {
          params.set("type", SUPERADMIN_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      default:
        break;
    }
  }, [selectedButton, page, selectedOutlineButton, startDate, endDate]);

  //   End of: Get Table data by Partner

  //   Start of: Handle Functions

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
    setPage(1);
    setLimit(10);
    setInputSearch("");
    setStartDate("");
    setEndDate("");
    params.delete("search");
    params.delete("demo");
    params.delete("startDate");
    params.delete("endDate");

    if (selectedButton !== USERS_SECTION_ROLE_SECTION) {
      params.delete("demo");

      params.set("type", value.target.name);
      params.set("page", 1);
      params.set("limit", 10);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      // params.delete("demo");
      params.set("type", value.target.name);
      params.set("page", 1);
      params.set("limit", 10);
      params.set("demo", selectedOutlineButton);

      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleButtonOutlineClick = (value) => {
    setSelectedOutlineButton(value.target.name);
    setInputSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    setLimit(10);
    params.delete("search");
    params.delete("startDate");
    params.delete("endDate");

    params.set("page", 1);
    params.set("limit", 10);
    params.set("demo", value.target.name);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleChangePages = (paging) => {
    setPage(paging);
    params.set("page", paging);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleChangeToDetailPage = (id, type) => {
    router.push(`${pathname}/detail/${id}/${type}`);
  };

  const handleChangeInputSearch = (e) => {
    setInputSearch(e.target.value);
  };

  const handleRangePicker = (date) => {
    if (date) {
      setStartDate(date[0].format("YYYY-MM-DD"));
      setEndDate(date[1].format("YYYY-MM-DD"));

      params.set("startDate", date[0].format("YYYY-MM-DD"));
      params.set("endDate", date[1].format("YYYY-MM-DD"));
      // console.log("start date: ", date[0].format("YYYY-MM-DD"));
      // console.log("end date: ", date[1].format("YYYY-MM-DD"));

      router.push(`${pathname}?${params.toString()}`);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleClickSearch = () => {
    params.set("search", inputSearch);
    router.push(`${pathname}?${params.toString()}`);
    switch (selectedButton) {
      case PARTNER_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(PARTNER_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page") ||
          !searchParams.has("search")
        ) {
          params.set("type", PARTNER_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          params.set("search", inputSearch);

          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case MARKETING_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(MARKETING_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page") ||
          !searchParams.has("search")
        ) {
          params.set("type", MARKETING_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          params.set("search", inputSearch);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case USERS_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(USERS_SECTION_ROLE_SECTION);

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page") ||
          !searchParams.has("demo") ||
          !searchParams.has("search")
        ) {
          params.set("type", USERS_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          params.set("demo");
          params.set("search", inputSearch);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case ADMIN_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(ADMIN_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page") ||
          !searchParams.has("search")
        ) {
          params.set("type", ADMIN_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          params.set("search", inputSearch);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      case SUPERADMIN_SECTION_ROLE_SECTION:
        FetchGetAllTableDataWithRefreshToken(SUPERADMIN_SECTION_ROLE_SECTION);
        params.delete("demo");

        if (
          !searchParams.has("type") ||
          !searchParams.has("limit") ||
          !searchParams.has("page") ||
          !searchParams.has("search")
        ) {
          params.set("type", SUPERADMIN_SECTION_ROLE_SECTION);
          params.set("page", 1);
          params.set("limit", 10);
          params.set("search", inputSearch);
          router.push(`${pathname}?${params.toString()}`);
        }
        break;
      default:
        break;
    }
  };

  //   End of: Handle Functions

  //   Start of: Table for Partner Data

  const columnPartnerTableData = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        return <p> {index + 1} </p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p> {convertDateFormat(param1.created_at)} </p>;
      },
    },
    {
      title: "ID User",
      key: "id_user",
      render: (param1) => {
        return <p> {param1.id} </p>;
      },
    },
    {
      title: "Login",
      key: "login",
      render: (param1) => {
        return <p> {param1.email} </p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p
              className={clsx(
                param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F6FFED] text-success inline text-Base-strong"
              )}
            >
              {" "}
              Active{" "}
            </p>
            <p
              className={clsx(
                !param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F5F5F5] text-text-description inline text-Base-strong"
              )}
            >
              {" "}
              Inactive{" "}
            </p>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1) => {
        return (
          <div>
            <button
              className={clsx(
                `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
              )}
              onClick={() =>
                handleChangeToDetailPage(
                  param1.id,
                  PARTNER_SECTION_ROLE_SECTION
                )
              }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  // End of: Table for Partner Data

  //   Start of: Table for Partner Data

  const columnMarketingTableData = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        return <p> {index + 1} </p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p> {convertDateFormat(param1.created_at)} </p>;
      },
    },
    {
      title: "ID User",
      key: "id_user",
      render: (param1) => {
        return <p> {param1.id} </p>;
      },
    },
    {
      title: "Login",
      key: "login",
      render: (param1) => {
        return <p> {param1.email} </p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p
              className={clsx(
                param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F6FFED] text-success inline text-Base-strong"
              )}
            >
              {" "}
              Active{" "}
            </p>
            <p
              className={clsx(
                !param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F5F5F5] text-text-description inline text-Base-strong"
              )}
            >
              {" "}
              Inactive{" "}
            </p>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1) => {
        return (
          <div>
            <button
              className={clsx(
                `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
              )}
              onClick={() =>
                handleChangeToDetailPage(
                  param1.id,
                  MARKETING_SECTION_ROLE_SECTION
                )
              }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  // End of: Table for Partner Data

  //   Start of: Table for Partner Data

  const columnUsersTableData = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        return <p> {index + 1} </p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p> {convertDateFormat(param1.created_at)} </p>;
      },
    },
    {
      title: "ID User",
      key: "id_user",
      render: (param1) => {
        return <p> {param1.id} </p>;
      },
    },
    {
      title: "Login",
      key: "login",
      render: (param1) => {
        return <p> {param1.email} </p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p
              className={clsx(
                param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F6FFED] text-success inline text-Base-strong"
              )}
            >
              {" "}
              Active{" "}
            </p>
            <p
              className={clsx(
                !param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F5F5F5] text-text-description inline text-Base-strong"
              )}
            >
              {" "}
              Inactive{" "}
            </p>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1) => {
        return (
          <div>
            <button
              className={clsx(
                `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
              )}
              onClick={() =>
                handleChangeToDetailPage(param1.id, USERS_SECTION_ROLE_SECTION)
              }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  // End of: Table for Partner Data

  //   Start of: Table for Partner Data

  const columnAdminTableData = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        return <p> {index + 1} </p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p> {convertDateFormat(param1.created_at)} </p>;
      },
    },
    {
      title: "ID User",
      key: "id_user",
      render: (param1) => {
        return <p> {param1.id} </p>;
      },
    },
    {
      title: "Login",
      key: "login",
      render: (param1) => {
        return <p> {param1.email} </p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p
              className={clsx(
                param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F6FFED] text-success inline text-Base-strong"
              )}
            >
              {" "}
              Active{" "}
            </p>
            <p
              className={clsx(
                !param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F5F5F5] text-text-description inline text-Base-strong"
              )}
            >
              {" "}
              Inactive{" "}
            </p>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1) => {
        return (
          <div>
            <button
              className={clsx(
                `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
              )}
              onClick={() =>
                handleChangeToDetailPage(param1.id, ADMIN_SECTION_ROLE_SECTION)
              }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  // End of: Table for Partner Data

  //   Start of: Table for Partner Data

  const columnSuperadminTableData = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        return <p> {index + 1} </p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p> {convertDateFormat(param1.created_at)} </p>;
      },
    },
    {
      title: "ID User",
      key: "id_user",
      render: (param1) => {
        return <p> {param1.id} </p>;
      },
    },
    {
      title: "Login",
      key: "login",
      render: (param1) => {
        return <p> {param1.email} </p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p
              className={clsx(
                param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F6FFED] text-success inline text-Base-strong"
              )}
            >
              {" "}
              Active{" "}
            </p>
            <p
              className={clsx(
                !param1.verified ? "visible" : "hidden",
                "px-4 py-1 rounded-md bg-[#F5F5F5] text-text-description inline text-Base-strong"
              )}
            >
              {" "}
              Inactive{" "}
            </p>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1) => {
        return (
          <div>
            <button
              className={clsx(
                `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
              )}
              onClick={() =>
                handleChangeToDetailPage(
                  param1.id,
                  SUPERADMIN_SECTION_ROLE_SECTION
                )
              }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  // End of: Table for Partner Data

  //   console.log("all table data: ", allTableData);
  return (
    <main>
      <section>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-heading-2 text-black mb-4">Users</h1>
          <div>
            <PrimaryButton
              href={"/credentials/dashboard/users/add-user"}
              value={"Add user"}
              key={"add_user"}
            />
          </div>
        </div>
        <div className="bg-white  p-12 rounded-xl shadow-md">
          <div className="mt-8 flex justify-between">
            <OverviewCard
              descriptions={"Corporate credentials found"}
              image={"/images/sector_image_magnifier.svg"}
              total={totalUsers && totalUsers}
            />
            <OverviewCard
              descriptions={"Employee compromised"}
              image={"/images/sector_image_location-like.svg"}
              total={activeUsers && activeUsers}
            />
            <OverviewCard
              descriptions={"User compromised"}
              image={"/images/sector_image_user-like.svg"}
              total={inactiveUsers && inactiveUsers}
            />
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="text-heading-4 text-black mb-4 ">User list</h2>
        <div className="bg-white  rounded-lg">
          <section className="py-8 mx-8 border-b-2 border-input-border ">
            <CompromiseButton
              isActive={selectedButton === PARTNER_SECTION_ROLE_SECTION}
              // total={employeeData && employeeData.count}
              value={"Partner"}
              onClick={handleButtonClick}
              nameData={PARTNER_SECTION_ROLE_SECTION}
            />
            <CompromiseButton
              isActive={selectedButton === MARKETING_SECTION_ROLE_SECTION}
              // total={usersData && usersData.count}
              value={"Marketing"}
              onClick={handleButtonClick}
              nameData={MARKETING_SECTION_ROLE_SECTION}
            />
            <CompromiseButton
              isActive={selectedButton === USERS_SECTION_ROLE_SECTION}
              // total={totalThirdParty && totalThirdParty}
              value={"Users"}
              onClick={handleButtonClick}
              nameData={USERS_SECTION_ROLE_SECTION}
            />
            <CompromiseButton
              isActive={selectedButton === ADMIN_SECTION_ROLE_SECTION}
              // total={totalDevice && totalDevice}
              value={"Admin"}
              onClick={handleButtonClick}
              nameData={ADMIN_SECTION_ROLE_SECTION}
            />
            <CompromiseButton
              isActive={selectedButton === SUPERADMIN_SECTION_ROLE_SECTION}
              // total={totalDevice && totalDevice}
              value={"Super admin"}
              onClick={handleButtonClick}
              nameData={SUPERADMIN_SECTION_ROLE_SECTION}
            />
            {selectedButton === USERS_SECTION_ROLE_SECTION && (
              <section className="pt-8 mb-[-20px] ">
                <OutlineButton
                  isActive={selectedOutlineButton === "false"}
                  // total={GetOutlineTotalDataCompromiseOutlineButton(selectedButton)}
                  value={"Full Access "}
                  onClick={handleButtonOutlineClick}
                  nameData={"false"}
                />
                <OutlineButton
                  isActive={selectedOutlineButton === "true"}
                  // total={GetOutlineTotalDataValidatedOutlineButton(
                  //   selectedButton
                  // )}
                  value={"Free Trial "}
                  onClick={handleButtonOutlineClick}
                  nameData={"true"}
                />{" "}
              </section>
            )}
          </section>
          <section className="p-8">
            <div className="">
              <div className="flex items-center relative">
                <div
                  className={clsx(
                    " bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]"
                  )}
                  //   onMouseEnter={handleMouseEnter}
                  //   onMouseLeave={handleMouseLeave}
                >
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                      // handleDisableExportButton() === null &&
                      //   "cursor-not-allowed"
                      // getCookie("user_status") === "true" &&
                      //   "cursor-not-allowed"
                    )}
                    placeholder={"Search by ID user or Login"}
                    onChange={handleChangeInputSearch}
                    value={inputSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleClickSearch();
                      }
                    }}
                    // disabled={handleDisableExportButton() === null}
                    // readOnly={handleDisableExportButton() === null}
                    // disabled={getCookie("user_status") === "true"}
                    // readOnly={getCookie("user_status") === "true"}
                  />
                  <div
                    className="px-3 cursor-pointer"
                    onClick={handleClickSearch}
                  >
                    <Image
                      src={"/images/sector_image_search.svg"}
                      alt="search icon"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
                {/* <Tooltip isActive={isHovered} right={"30px"} bottom={"30px"} /> */}
                <div>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: "#F7F7F7",
                        colorBorder: "#D5D5D5",
                        colorText: "#000000E0",
                        fontWeightStrong: true,
                        colorPrimary: "#FF6F1E",
                      },
                      components: {
                        DatePicker: {
                          cellHeight: 20,
                          cellWidth: 32,
                          hoverBorderColor: "#FF6F1E",
                          cellActiveWithRangeBg: "#FFEBD4",
                          cellRangeBorderColor: "#FFD3A8",
                          activeBorderColor: "#FFEBD4",
                        },
                      },
                    }}
                  >
                    <RangePicker
                      onChange={handleRangePicker}
                      className="ml-8"
                      size="large"
                      // disabled={handleDisableExportButton() === null}
                      // readOnly={handleDisableExportButton() === null}
                      // disabled={getCookie("user_status") === "true"}
                      // readOnly={getCookie("user_status") === "true"}
                      //   onMouseEnter={handleMouseEnterRangeDate}
                      //   onMouseLeave={handleMouseLeaveRangeDate}
                      value={[
                        startDate ? dayjs(startDate) : "",
                        endDate ? dayjs(endDate) : "",
                      ]}
                    />
                  </ConfigProvider>
                  {/* <Tooltip
                    isActive={isHoveredRangeDate}
                    right={"0"}
                    bottom={"50px"}
                  /> */}
                </div>
              </div>
            </div>
          </section>
          <section className="p-8 pt-0">
            <ConfigProvider
              theme={{
                components: {
                  Pagination: {
                    itemActiveBg: "#FF6F1E",
                    itemLinkBg: "#fff",
                    itemInputBg: "#fff",
                  },
                },
                token: {
                  colorPrimary: "white",
                },
              }}
            >
              {selectedButton === PARTNER_SECTION_ROLE_SECTION && (
                <div className="border-[1px] rounded-lg border-input-border">
                  <Table
                    columns={columnPartnerTableData}
                    dataSource={allTableData}
                    pagination={false}
                  />
                  <div
                    className={clsx(
                      "flex items-center justify-between my-[19px] mx-[16px]",
                      allTableData === null ? "hidden" : "visible"
                    )}
                  >
                    <p className="text-Base-normal text-[#676767]">
                      {" "}
                      Showing {sizeDataPerPage && sizeDataPerPage} to{" "}
                      {totalData && totalData} entries
                    </p>
                    <Pagination
                      type="primary"
                      defaultCurrent={1}
                      total={totalData && totalData}
                      showSizeChanger={false}
                      style={{ color: "#FF6F1E" }}
                      hideOnSinglePage={true}
                      onChange={handleChangePages}
                      current={page}
                    />
                  </div>
                </div>
              )}
              {selectedButton === MARKETING_SECTION_ROLE_SECTION && (
                <div className="border-[1px] rounded-lg border-input-border">
                  <Table
                    columns={columnMarketingTableData}
                    dataSource={allTableData}
                    pagination={false}
                  />
                  <div
                    className={clsx(
                      "flex items-center justify-between my-[19px] mx-[16px]",
                      allTableData === null ? "hidden" : "visible"
                    )}
                  >
                    <p className="text-Base-normal text-[#676767]">
                      {" "}
                      Showing {sizeDataPerPage && sizeDataPerPage} to{" "}
                      {totalData && totalData} entries
                    </p>
                    <Pagination
                      type="primary"
                      defaultCurrent={1}
                      total={totalData && totalData}
                      showSizeChanger={false}
                      style={{ color: "#FF6F1E" }}
                      hideOnSinglePage={true}
                      onChange={handleChangePages}
                      current={page}
                    />
                  </div>
                </div>
              )}
              {selectedButton === USERS_SECTION_ROLE_SECTION && (
                <div className="border-[1px] rounded-lg border-input-border">
                  <Table
                    columns={columnUsersTableData}
                    dataSource={allTableData}
                    pagination={false}
                  />
                  <div
                    className={clsx(
                      "flex items-center justify-between my-[19px] mx-[16px]",
                      allTableData === null ? "hidden" : "visible"
                    )}
                  >
                    <p className="text-Base-normal text-[#676767]">
                      {" "}
                      Showing {sizeDataPerPage && sizeDataPerPage} to{" "}
                      {totalData && totalData} entries
                    </p>
                    <Pagination
                      type="primary"
                      defaultCurrent={1}
                      total={totalData && totalData}
                      showSizeChanger={false}
                      style={{ color: "#FF6F1E" }}
                      hideOnSinglePage={true}
                      onChange={handleChangePages}
                      current={page}
                    />
                  </div>
                </div>
              )}
              {selectedButton === ADMIN_SECTION_ROLE_SECTION && (
                <div className="border-[1px] rounded-lg border-input-border">
                  <Table
                    columns={columnAdminTableData}
                    dataSource={allTableData}
                    pagination={false}
                  />
                  <div
                    className={clsx(
                      "flex items-center justify-between my-[19px] mx-[16px]",
                      allTableData === null ? "hidden" : "visible"
                    )}
                  >
                    <p className="text-Base-normal text-[#676767]">
                      {" "}
                      Showing {sizeDataPerPage && sizeDataPerPage} to{" "}
                      {totalData && totalData} entries
                    </p>
                    <Pagination
                      type="primary"
                      defaultCurrent={1}
                      total={totalData && totalData}
                      showSizeChanger={false}
                      style={{ color: "#FF6F1E" }}
                      hideOnSinglePage={true}
                      onChange={handleChangePages}
                      current={page}
                    />
                  </div>
                </div>
              )}
              {selectedButton === SUPERADMIN_SECTION_ROLE_SECTION && (
                <div className="border-[1px] rounded-lg border-input-border">
                  <Table
                    columns={columnSuperadminTableData}
                    dataSource={allTableData}
                    pagination={false}
                  />
                  <div
                    className={clsx(
                      "flex items-center justify-between my-[19px] mx-[16px]",
                      allTableData === null ? "hidden" : "visible"
                    )}
                  >
                    <p className="text-Base-normal text-[#676767]">
                      {" "}
                      Showing {sizeDataPerPage && sizeDataPerPage} to{" "}
                      {totalData && totalData} entries
                    </p>
                    <Pagination
                      type="primary"
                      defaultCurrent={1}
                      total={totalData && totalData}
                      showSizeChanger={false}
                      style={{ color: "#FF6F1E" }}
                      hideOnSinglePage={true}
                      onChange={handleChangePages}
                      current={page}
                    />
                  </div>
                </div>
              )}
            </ConfigProvider>
          </section>
        </div>
      </section>
    </main>
  );
}
