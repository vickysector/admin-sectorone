"use client";

import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter, redirect, useSearchParams } from "next/navigation";
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

const { RangePicker } = DatePicker;

export default function UsersDashboardPage() {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: State

  const [totalUsers, setTotalUsers] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [inactiveUsers, setInactiveUser] = useState();
  const [selectedButton, setSelectedButton] = useState(
    PARTNER_SECTION_ROLE_SECTION
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  //   Start of: Handle Functions

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
  };

  //   End of: Handle Functions

  return (
    <main>
      <section>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-heading-2 text-black mb-4">Users</h1>
          <div>
            <PrimaryButton href={"#"} value={"Add user"} key={"add_user"} />
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
                    // onChange={handleSearchKeyword}
                    // value={inputSearch}
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
                    // onClick={handleClickSearch}
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
                      //   onChange={handleRangePicker}
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
        </div>
      </section>
    </main>
  );
}
