"use client";

import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingLogState } from "@/app/_lib/store/features/LogActivity/LoadingLogSlices";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { Pagination, Table } from "antd";
import clsx from "clsx";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AcitivityLogPage(query_params) {
  // Start of: Route Params

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  // End of: Route Params

  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  const [allTableData, setAllTableData] = useState();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10);

  const handleChangePages = (paging) => {
    setPage(paging);
    params.set("page", paging);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchKeyword = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleChangeToDetailPage = (param) => {
    router.push(`${pathname}/log/detail/${param.id}`);
  };

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  const fetchLogActivity = async () => {
    try {
      dispatch(setLoadingLogState(true));

      const res = await fetch(
        `${APIDATAV1}admin/user/detail/activity?page=${page}&limit=${limit}&id_user=${query_params.params.detail_id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          //   body: JSON.stringify({
          //     id_user: query_params.params.detail_id,
          //   }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      console.log("log activity: ", data);

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      setAllTableData(data);

      return res;
    } catch (error) {
      //   setLogActivityData(null);
      console.log("error Log details: ", error);
      return error;
    } finally {
      dispatch(setLoadingLogState(false));
    }
  };

  const fetchLogActivityWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchLogActivity, router, dispatch, keyword);
  };

  useEffect(() => {
    // fetchLogActivity(keywordSearch);
    fetchLogActivityWithRefreshToken();
    if (!searchParams.has("limit") || !searchParams.has("page")) {
      params.set("page", 1);
      params.set("limit", 10);
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [page]);

  const columnLogActivity = [
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
        return <p> {convertDateFormat(param1.create_at)} </p>;
      },
    },
    {
      title: "ID",
      key: "id",
      render: (param1) => {
        return <p> {param1.id} </p>;
      },
    },
    {
      title: "ID User",
      key: "id_user",
      render: (param1) => {
        return <p> {param1.id_user} </p>;
      },
    },
    {
      title: "Company Name",
      key: "company_name",
      render: (param1) => {
        return <p> {param1.company_name} </p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p>{param1.description}</p>
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
              //   onClick={() =>
              //     handleChangeToDetailPage(param1.id, USERS_SECTION_ROLE_SECTION)
              //   }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  console.log("all table data log", allTableData);

  return (
    <main>
      <section>
        <div className="flex items-center">
          <div onClick={handleBackToAllcyberattacks} className="cursor-pointer">
            <ArrowBackIcon />
          </div>
          <h1 className="text-heading-2 text-black ml-4">Log Details</h1>
        </div>
        <div className="mt-8 bg-white  rounded-lg">
          <section className="p-8">
            <div className=" ">
              <p className={clsx("text-text-description text-Base-normal")}>
                Below is the details activity of{" "}
                <span className={clsx("text-heading-5 text-black")}>
                  [company]
                </span>{" "}
                page
              </p>
            </div>
          </section>
          <section className="p-8 mt-[-30px]">
            <div className="border-[1px] rounded-lg border-input-border">
              <Table
                columns={columnLogActivity}
                dataSource={allTableData && allTableData.data}
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
                  Showing {allTableData && allTableData.size} to{" "}
                  {allTableData && allTableData.count_data} entries
                </p>
                <Pagination
                  type="primary"
                  defaultCurrent={1}
                  total={allTableData && allTableData.count_data}
                  showSizeChanger={false}
                  style={{ color: "#FF6F1E" }}
                  hideOnSinglePage={true}
                  onChange={handleChangePages}
                  current={page}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
