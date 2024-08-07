"use client";

import {
  CalculatePasswordStrengthWithReturnPlainString,
  convertDateFormat,
} from "@/app/_lib/CalculatePassword";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import {
  setDomainSearchData,
  setTotalAllPageDomainSearch,
  setTotalExposuresDomainSearch,
  setTotalPerPageDomainSearch,
} from "@/app/_lib/store/features/DomainSearch/DomainSearchSlices";
import {
  setDetailsIsOpen,
  setDetailsLeakedData,
  setLeakedData,
  setTotalExposures,
} from "@/app/_lib/store/features/ExecutiveProtections/LeakedDataSlices";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import { Alert, ConfigProvider, Pagination, Table } from "antd";
import clsx from "clsx";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DomainSearchPage() {
  const [email, setEmail] = useState(getCookie("scanned_domain") || "");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSend = email;
  const dispatch = useDispatch();
  const router = useRouter();

  const dataLeakedDomain = useSelector(
    (state) => state.domainSearch.domainSearchData
  );

  console.log("data leaked domain: ", dataLeakedDomain);

  const totalExposuresDomain = useSelector(
    (state) => state.domainSearch.totalExposures
  );

  const totalPerPageDomainSearch = useSelector(
    (state) => state.domainSearch.totalPerPageDomainSearch
  );

  const totalAllPageDomainSearch = useSelector(
    (state) => state.domainSearch.totalAllPageDomainSearch
  );

  const columnDomainSearch = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        return (
          <p className={clsx("text-Base-normal text-[#000000E0]")}>
            {" "}
            {index + 1}{" "}
          </p>
        );
      },
    },
    {
      title: "Date Compromised",
      key: "compromised",
      render: (param1) => {
        return (
          <p className={clsx("text-Base-normal text-[#000000E0]")}>
            {" "}
            {convertDateFormat(param1.date_time_compromised)}{" "}
          </p>
        );
      },
    },
    {
      title: "URL",
      key: "url",
      render: (param1) => {
        return (
          <p
            className={clsx("text-Base-normal text-[#000000E0 max-w-[200px] ")}
          >
            {" "}
            {param1.url}{" "}
          </p>
        );
      },
    },
    {
      title: "Login",
      key: "login",
      render: (param1) => {
        return (
          <p className={clsx("text-Base-normal text-[#000000E0]")}>
            {" "}
            {param1.login}{" "}
          </p>
        );
      },
    },
    {
      title: "Password",
      key: "password",
      render: (param1) => {
        return (
          <p className={clsx("text-Base-normal text-[#000000E0]")}>
            {" "}
            {param1.password}{" "}
          </p>
        );
      },
    },
    {
      title: "Password Strength",
      key: "status",
      render: (param1) => {
        return (
          <div>
            <p
              className={clsx(
                param1.password.includes("***") ? "visible" : "hidden",
                "px-4 py-1 rounded-md  text-[#000000E0] inline text-Base-strong"
              )}
            >
              Unknown
            </p>

            <p
              className={clsx(
                !param1.password.includes("***") ? "visible" : "hidden",
                CalculatePasswordStrengthWithReturnPlainString(
                  param1.password
                ) === "Bad" && "text-error",
                CalculatePasswordStrengthWithReturnPlainString(
                  param1.password
                ) === "Weak" && "text-pink",
                CalculatePasswordStrengthWithReturnPlainString(
                  param1.password
                ) === "Medium" && "text-text-orange",
                CalculatePasswordStrengthWithReturnPlainString(
                  param1.password
                ) === "Good" && "text-blue-600",
                CalculatePasswordStrengthWithReturnPlainString(
                  param1.password
                ) === "Strong" && "text-text-green"
              )}
            >
              {CalculatePasswordStrengthWithReturnPlainString(param1.password)}
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
              //   onClick={() =>
              //     handleChangeToDetailPage(
              //       param1.id,
              //       PARTNER_SECTION_ROLE_SECTION
              //     )
              //   }
            >
              Details
            </button>
          </div>
        );
      },
    },
  ];

  const handleChangeEmail = (e) => {
    setEmail(e.target.value.trim());
    setCookie("scanned_domain", e.target.value.trim());
  };

  const handleScanNow = () => {
    console.log("scan now..");
    callGetDetailLeakedDataWithRefeshToken();
  };

  const handleDetails = (item) => {
    dispatch(setDetailsLeakedData(item));
    dispatch(setDetailsIsOpen(true));
    // console.log("item leaked details: ", item);
  };

  const callGetDetailLeakedDataWithRefeshToken = async () => {
    await fetchWithRefreshToken(fetchGetDetailLeakedData, router, dispatch);
  };

  const fetchGetDetailLeakedData = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}search?q=${email}.com&page=1`, {
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
        setIsErrorEmail(true);
        setErrorMessage(data.message);
        throw res;
      }

      //   return res;

      if (data.data) {
        console.log("data executive admin: ", data);
        dispatch(setDomainSearchData(data.data));
        dispatch(setTotalExposuresDomainSearch(data.count_data));
        dispatch(setTotalPerPageDomainSearch(data.size));
        dispatch(setTotalAllPageDomainSearch(data.count_page));
        return res;
      }
    } catch (error) {
      console.log("error get leaked data: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsErrorEmail(false);
    }, 5000);
  }, [isErrorEmail]);

  useEffect(() => {
    if (hasCookie("scanned_domain") && email) {
      callGetDetailLeakedDataWithRefeshToken();
    } else {
      deleteCookie("scanned_domain");
    }
  }, []);

  return (
    <main>
      <section className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center px-[96px] py-8 relative ">
        <Alert
          message={errorMessage ? errorMessage : "Email is not valid"}
          type="error"
          showIcon
          closable={true}
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            right: "32px",
            textAlign: "left",
          }}
          className={clsx(isErrorEmail ? "visible" : "hidden")}
        />
        <div>
          <h1 className="text-heading-3 text-black">
            Has your data been exposed?
          </h1>
          <h2 className="text-Base-normal text-text-description mt-[12px]">
            Scan your domain to see your digital footprint.
          </h2>
        </div>
        <div className="mt-[32px] w-full">
          <div className="flex text-center justify-center items-center relative">
            <input
              type="text"
              className="rounded-md px-3 py-[5px] border-input-border border-2 w-[50%] text-LG-normal text-black"
              placeholder="Enter domain"
              value={email}
              onChange={handleChangeEmail}
            />
            <div className="ml-4">
              <AuthButton
                value={"Scan now"}
                agreements={canSend}
                onClick={handleScanNow}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className={clsx(
          "mt-10 bg-white min-h-[470px] rounded-lg shadow-md flex items-center justify-center p-8 "
        )}
      >
        {/* Start: Email not been search */}
        <div
          className={clsx(
            "flex items-center justify-center",
            // dataLeaked.length === 0 ? "visible" : "hidden",
            typeof dataLeakedDomain === "string" ? "visible" : "hidden"
          )}
        >
          <div className={clsx("text-center mx-auto")}>
            <Image
              src={"/images/fingerprint.svg"}
              width={100}
              height={100}
              alt="Fingerprint"
              className={clsx("mx-auto")}
            />
            <h3 className={clsx("text-heading-3 mt-4 mb-2")}>
              Start scanning your domain
            </h3>
            <p
              className={clsx(
                "text-LG-normal max-w-[387px] text-text-description"
              )}
            >
              We scan for data breaches to see if your data has been leaked.
            </p>
          </div>
        </div>
        {/* End: Email not been search */}

        {/* Start: Email Searched */}
        <div
          className={clsx(
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center mt-8 overflow-scroll ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "visible"
            //   : "hidden"
            dataLeakedDomain && dataLeakedDomain !== null ? "visible" : "hidden"
          )}
        >
          <h1 className="text-heading-4 text-black">
            Results of your data leak
          </h1>
          <h2 className="text-Base-normal text-text-description mt-3 max-w-[450px]">
            Get details on data breaches that leak your info on the dark web.
            See how you can become more secure based on each result.
          </h2>

          <div className="my-6 w-full">
            <Alert
              message={`We found ${totalExposuresDomain} exposures of your data.`}
              type="warning"
              showIcon
              closable
              style={{
                textAlign: "left",
              }}
            />
          </div>

          <div className="border-[1px] rounded-lg border-input-border w-auto ">
            <Table
              columns={columnDomainSearch}
              dataSource={dataLeakedDomain}
              pagination={false}
            />
            <div
              className={clsx(
                "flex items-center justify-between my-[19px] mx-[16px]",
                dataLeakedDomain === null ? "hidden" : "visible"
              )}
            >
              <p className="text-Base-normal text-[#676767]">
                {" "}
                Showing {totalPerPageDomainSearch &&
                  totalPerPageDomainSearch}{" "}
                to {totalExposuresDomain && totalExposuresDomain} entries
              </p>
              <Pagination
                type="primary"
                defaultCurrent={1}
                total={totalExposuresDomain && totalExposuresDomain}
                showSizeChanger={false}
                style={{ color: "#FF6F1E" }}
                hideOnSinglePage={true}
                // onChange={handleChangePages}
                // current={page}
              />
            </div>
          </div>
        </div>
        {/* End: Email Searched */}

        {/* Start: Email is safe */}
        <div
          className={clsx(
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center mt-8 ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "visible"
            //   : "hidden"
            dataLeakedDomain === null ? "visible" : "hidden"
          )}
        >
          <div>
            <Image
              src={"/images/sector_confirmation_created_password_success.svg"}
              alt="search icon"
              width={129}
              height={121}
            />
          </div>
          <h1 className="text-heading-4 text-black">Your websites is safe!</h1>
          <h2 className="text-LG-normal text-text-description mt-3 max-w-[450px]">
            Nothing was found after scanning your websites.
          </h2>
        </div>
        {/* End: Email is safe */}
      </section>
    </main>
  );
}
