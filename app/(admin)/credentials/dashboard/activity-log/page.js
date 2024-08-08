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

export default function AcitivityLogPage() {
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
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("search") || ""
  );

  const handleChangePages = (paging) => {
    setPage(paging);
    params.set("page", paging);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleHitSearch = () => {
    fetchLogActivityWithRefreshToken();
    params.set("search", searchKeyword);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchKeyword = (e) => {
    setSearchKeyword(e.target.value);
  };

  const fetchLogActivity = async () => {
    try {
      dispatch(setLoadingLogState(true));

      const res = await fetch(
        `${APIDATAV1}admin/user/activity?page=${page}&limit=${limit}&search=${searchKeyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
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
    if (
      !searchParams.has("search") ||
      !searchParams.has("limit") ||
      !searchParams.has("page")
    ) {
      params.set("search", searchKeyword);
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

  console.log("all table data log", allTableData);

  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-8">Activity log</h1>
        <div className="mt-4 bg-white  rounded-lg">
          <section className="p-8">
            <div className=" ">
              <div className="flex items-center">
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]">
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                    )}
                    placeholder={"Search Company  "}
                    onChange={handleSearchKeyword}
                    value={searchKeyword}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleHitSearch();
                      }
                    }}
                  />
                  <div
                    className="px-3 cursor-pointer"
                    onClick={handleHitSearch}
                  >
                    <Image
                      src={"/images/sector_image_search.svg"}
                      alt="search icon"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
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
