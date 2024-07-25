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

export default function DetailRoleUsers({ params }) {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: Functions Handler

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  //   End of: Functions Handler

  // Start of: API Intregations

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
              <Select
                defaultValue="lucy"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
                size="large"
              />
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
