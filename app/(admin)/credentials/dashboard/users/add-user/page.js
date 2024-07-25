"use client";

import { useRouter, redirect, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import {
  MARKETING_SECTION_ROLE_SECTION,
  USERS_SECTION_ROLE_SECTION,
} from "@/app/_lib/variables/Variables";
import { ConfigProvider, Switch, Select, Input, Form } from "antd";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { useEffect, useState } from "react";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { getCookie } from "cookies-next";

export default function DetailRoleUsers({ params }) {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: All State

  const [selectOptions, setSelecOptions] = useState([]);

  //   End of: All State

  //   Start of: Functions Handler

  const handleBackToAllcyberattacks = () => {
    router.back();
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

      console.log("all role: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        const updatedData = data.data.map((item) => {
          return {
            value: item.id,
            label:
              item.name_role.charAt(0).toUpperCase() + item.name_role.slice(1),
          };
        });

        setSelecOptions(updatedData);

        console.log("all role (selectoptions): ", updatedData);

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

  useEffect(() => {
    FetchAllRolesWithRefreshToken();
  }, []);

  // End of: API Intregations

  return (
    <main>
      {/* Section Users */}
      <section>
        <div className={clsx("flex items-center justify-between mb-4")}>
          <div className="flex items-center">
            <div
              onClick={handleBackToAllcyberattacks}
              className="cursor-pointer"
            >
              <ArrowBackIcon />
            </div>
            <h1 className="text-heading-2 text-black  ml-4">Add user</h1>
          </div>
          <div>
            <button
              className={clsx(
                `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
              )}
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-8 bg-white rounded-lg mt-8">
          <section className="flex items-center justify-between">
            <div>
              <h2 className="text-heading-5 text-black mb-1">
                Activate free trial mode
              </h2>
              <p className="text-text-description text-Base-normal">
                By activating this mode, users will be restricted from accessing
                some features on the SectorOne dashboard.
              </p>
            </div>
            <div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#FF6F1E",
                  },
                }}
              >
                <Switch />
              </ConfigProvider>
            </div>
          </section>
          <section className="mt-8 grid grid-cols-2 gap-4   ">
            <Form.Item
              label={"Role"}
              name={"role"}
              layout="vertical"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <ConfigProvider theme={{ token: { colorPrimary: "FF6F1E" } }}>
                <Select defaultValue={3} options={selectOptions} size="large" />
              </ConfigProvider>
            </Form.Item>
            <Form.Item
              label={"Name"}
              name={"name"}
              layout="vertical"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="John Smith" variant="filled" size="large" />
            </Form.Item>
            <Form.Item
              label={"Phone number"}
              name={"phone"}
              layout="vertical"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="08123456789" variant="filled" size="large" />
            </Form.Item>
            <Form.Item
              label={"Email"}
              name={"email"}
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
              />
            </Form.Item>
          </section>
        </div>
      </section>
      {/* Section Users */}
    </main>
  );
}
