"use client";

import { useRouter, redirect, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import {
  MARKETING_SECTION_ROLE_SECTION,
  USERS_SECTION_ROLE_SECTION,
} from "@/app/_lib/variables/Variables";
import { ConfigProvider, Form, Input, Select, Switch } from "antd";

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
              >
                Deactivate accounts
              </button>
              <button
                className={clsx(
                  `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `
                )}
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
                    Activate free trial mode
                  </h2>
                  <p className="text-text-description text-Base-normal">
                    By activating this mode, users will be restricted from
                    accessing some features on the SectorOne dashboard.
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
                    {/* <Switch onChange={handleDemoChange} value={demo} /> */}
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
                    <Select
                      defaultValue={"user"}
                      // options={selectOptions}
                      size="large"
                      // value={role}
                      // onChange={handleRoleChange}
                    />
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
                  <Input
                    placeholder="John Smith"
                    variant="filled"
                    size="large"
                    onChange={(e) => handleNameChange(e)}
                    // value={name}
                  />
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
                  <Input
                    placeholder="08123456789"
                    variant="filled"
                    size="large"
                    // value={phone}
                    onChange={(e) => handlePhoneChange(e)}
                  />
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
                    // value={email}
                    onChange={(e) => handleEmailChange(e)}
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
                <Form.Item
                  label={"Url"}
                  name={"url"}
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="gmail.com"
                    variant="filled"
                    size="large"
                    // onChange={handleRequiredUrlChange}
                    // value={requiredUrl}
                  />
                </Form.Item>
              </section>
            </div>
          </div>
        </section>
      )}
      {/* Section Users */}

      {/* Section Marketing */}
      {params.type_users === MARKETING_SECTION_ROLE_SECTION && (
        <section>
          <h1>Marketing</h1>
        </section>
      )}
      {/* Section Marketing */}
    </main>
  );
}
