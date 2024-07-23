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

export default function UsersDashboardPage() {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: State

  const [totalUsers, setTotalUsers] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [inactiveUsers, setInactiveUser] = useState();

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
      }

      return res;
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
    </main>
  );
}
