"use client";

import { useRouter, redirect, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import {
  MARKETING_SECTION_ROLE_SECTION,
  USERS_SECTION_ROLE_SECTION,
} from "@/app/_lib/variables/Variables";
import { ConfigProvider, Switch, Select, Input, Form, Alert } from "antd";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { useEffect, useState } from "react";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { getCookie } from "cookies-next";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { v4 as uuidv4 } from "uuid";

export default function DetailRoleUsers({ params }) {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  //   Start of: All State

  const [selectOptions, setSelecOptions] = useState([]);
  const [allInput, setAllInput] = useState([]);
  const [demo, setDemo] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState(3);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requiredUrl, setRequiredUrl] = useState("");
  const [isValidSave, setIsValidSave] = useState(null);

  //   End of: All State

  //   Start of: Functions Handler

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  const handleDemoChange = (checked) => {
    setDemo(checked);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleRequiredUrlChange = (event) => {
    setRequiredUrl(event.target.value);
  };

  const handleAddInputField = () => {
    console.log("input field clicked");
    setAllInput([...allInput, { id: uuidv4(), value: "" }]);
  };

  const handleDeleteField = (id) => {
    const newInputs = allInput.filter((input, i) => input.id !== id);
    setAllInput(newInputs);
  };

  const handleInputChange = (id, event) => {
    const newInputs = allInput.map((input, i) =>
      input.id === id ? { ...input, value: event.target.value } : input
    );
    setAllInput(newInputs);
  };

  const isSaveValid = name && phone && email && requiredUrl;

  const handleSaveButton = () => {
    if (isSaveValid) {
      console.log("clicked save button");
    } else {
      setIsValidSave(false);
    }
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
            value: item.id,
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

  useEffect(() => {
    FetchAllRolesWithRefreshToken();
  }, []);

  // End of: API Intregations

  console.log("allinputs: ", allInput);
  console.log("demo checked", demo);
  console.log("name change ", name);
  console.log("phone change ", phone);
  console.log("email change ", email);
  console.log("required url change ", requiredUrl);
  console.log("role change: ", role);

  //   Start of: Alert handle

  useEffect(() => {
    if (!isValidSave) {
      setTimeout(() => {
        setIsValidSave(true);
      }, 3000);
    }
  }, [isValidSave]);

  // End of: Alert Handle

  return (
    <main>
      {/* Section Users */}
      <section className="relative">
        <div
          className={clsx(
            !isValidSave && "visible",
            isValidSave === null ? "hidden" : "visible",
            isValidSave && "hidden",
            "absolute left-[50%] translate-x-[-50%]"
          )}
        >
          <Alert message="Required Field must be filled" banner closable />
        </div>
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
                `py-2 px-4 rounded-md text-Base-normal border-[1px] border-input-border hover:opacity-80 cursor-pointer ml-4 `,
                !isSaveValid
                  ? "text-[#00000040] "
                  : "text-white bg-primary-base border-primary-base"
              )}
              //   disabled={!isSaveValid}
              onClick={handleSaveButton}
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
                <Switch onChange={handleDemoChange} value={demo} />
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
                  defaultValue={3}
                  options={selectOptions}
                  size="large"
                  value={role}
                  onChange={handleRoleChange}
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
                value={name}
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
                value={phone}
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
                value={email}
                onChange={(e) => handleEmailChange(e)}
              />
            </Form.Item>
          </section>
        </div>
        <div className="mt-8">
          <section className="flex items-center justify-between">
            <div>
              <h2 className="text-heading-4 text-black">URL list</h2>
            </div>
            <div>
              <button
                className="text-LG-normal text-primary-base rounded-md py-2 px-4 bg-white border-[1px] border-input-border "
                onClick={handleAddInputField}
              >
                Add URL
              </button>
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
                onChange={handleRequiredUrlChange}
                value={requiredUrl}
              />
            </Form.Item>
            {allInput.map((item, index) => (
              <div
                key={item.id}
                className={clsx(" flex items-center justify-between ")}
              >
                <div className="flex-grow mr-4">
                  <Form.Item
                    label={`Url `}
                    name={"url"}
                    layout="vertical"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      value={item}
                      placeholder="gmail.com"
                      variant="filled"
                      size="large"
                      onChange={(e) => handleInputChange(item.id, e)}
                    />
                  </Form.Item>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => handleDeleteField(item.id)}
                >
                  <DeleteOutlineOutlinedIcon />
                </div>
              </div>
            ))}
          </section>
        </div>
      </section>
      {/* Section Users */}
    </main>
  );
}
