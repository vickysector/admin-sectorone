"use client";

import {
  CalculatePasswordStrengthWithReturnPlainString,
  convertDateFormat,
} from "@/app/_lib/CalculatePassword";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import {
  setDetailBreachesEmployee,
  setDetailBreachesThirdParty,
  setDetailBreachesTotal,
  setDetailBreachesUser,
  setDetailsDomainSearch,
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
import {
  DOMAIN_SEARCH_EMPLOYEE,
  DOMAIN_SEARCH_THIRDPARTY,
  DOMAIN_SEARCH_USERS,
} from "@/app/_lib/variables/Variables";
import { DomainBreaches } from "@/app/_ui/components/breaches/DomainBreaches";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import { Alert, ConfigProvider, Pagination, Table } from "antd";
import clsx from "clsx";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DomainSearchPage() {
  // Start : Route Params

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  // End : Route Params

  const [email, setEmail] = useState(getCookie("scanned_domain") || "");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [selectedButton, setSelectedButton] = useState(
    searchParams.get("type") || DOMAIN_SEARCH_EMPLOYEE
  );
  const [allRecentSearch, setAllRecentSearch] = useState();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [triggerChange, setTriggerChange] = useState(false);

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

  const dataBreachesUsers = useSelector(
    (state) => state.domainSearch.detailBreachesUser
  );
  const dataBreachesEmployee = useSelector(
    (state) => state.domainSearch.detailBreachesEmployee
  );
  const dataBreachesThirdParty = useSelector(
    (state) => state.domainSearch.detailBreachesThirdParty
  );
  const dataBreachesTotal = useSelector(
    (state) => state.domainSearch.detailBreachesTotal
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
            {convertDateFormat(param1.datetime_compromised)}{" "}
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
              onClick={() =>
                handleDetails(
                  param1.id,
                  dispatch(setDetailsDomainSearch(param1))
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

  const handleChangeEmail = (e) => {
    setEmail(e.target.value.trim());
    // setCookie("scanned_domain", e.target.value.trim());
  };

  const handleScanNow = () => {
    console.log("scan now..");
    callGetDetailLeakedDataWithRefeshToken(selectedButton, email);
    callPostKeywordDomainSearchWithRefreshToken(email);
    callGetBreachesDataWithRefeshToken(email);
    params.set("query", email);
    params.set("page", page);
    params.set("type", selectedButton);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDetails = (id, item) => {
    console.log("details page: ", item);
    router.push(`/credentials/dashboard/domain-search/details/${id}`);
  };

  const handleChangePage = (paging) => {
    setPage(paging);
    params.set("page", paging);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
    setPage(1);

    params.set("type", value.target.name);
    params.set("page", 1);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReturnValueOfSafeState = () => {
    switch (selectedButton) {
      case DOMAIN_SEARCH_EMPLOYEE:
        return "Employee";
      case DOMAIN_SEARCH_USERS:
        return "Users";
      case DOMAIN_SEARCH_THIRDPARTY:
        return "Third-Party";
      default:
        return "";
    }
  };

  const handleIsEmailFocusTrue = () => {
    setIsEmailFocused(true);
  };

  const handleIsEmailFotusFalse = () => {
    setIsEmailFocused(false);
  };

  const handleDeleteIndividual = (id) => {
    deleteRecentSearchData(id);
  };

  const handleDeleteAll = () => {
    deleteAllRecentSearchData();
  };

  const handleClickSearchHistoryEmail = (email) => {
    console.log("search history: ", email);
    setEmail(email);
    callGetDetailLeakedDataWithRefeshToken(selectedButton, email);
    callGetBreachesDataWithRefeshToken(email);
    callRecentSearchData();

    setCookie("scanned_domain", email);
    params.set("query", getCookie("scanned_domain"));
    router.push(`${pathname}?${params.toString()}`);
  };

  const callGetDetailLeakedDataWithRefeshToken = async (type, keyword) => {
    await fetchWithRefreshToken(
      fetchGetDetailLeakedData,
      router,
      dispatch,
      type,
      keyword
    );
  };

  const fetchGetDetailLeakedData = async (type, keyword) => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}compromised/${type}?page=${page}&search=&search_domain=${keyword}`,
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

      if (data.data === null) {
        dispatch(setDomainSearchData(null));
        setCookie("scanned_domain", keyword);
        throw res;
      }

      //   return res;

      if (data.data) {
        console.log("data executive admin: ", data);
        setCookie("scanned_domain", keyword);

        dispatch(setDomainSearchData(data.data));
        dispatch(setTotalExposuresDomainSearch(data.count_data));
        dispatch(setTotalPerPageDomainSearch(data.size));
        dispatch(setTotalAllPageDomainSearch(data.count_page));
        params.set("query", getCookie("scanned_domain"));
        params.set("page", page);
        params.set("type", selectedButton);
        router.push(`${pathname}?${params.toString()}`);
        return res;
      }
    } catch (error) {
      console.log("error get leaked data: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callGetBreachesDataWithRefeshToken = async (keyword) => {
    await fetchWithRefreshToken(
      fetchGetAllDataBreaches,
      router,
      dispatch,
      keyword
    );
  };

  const fetchGetAllDataBreaches = async (keyword) => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}root/admin/count/breaches?search=${keyword}`,
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

      console.log("data breaches: ", data);

      //   return res;

      if (data.data) {
        console.log("data breaches: ", data);
        dispatch(setDetailBreachesUser(data.data.user_compromise));
        dispatch(setDetailBreachesEmployee(data.data.employee_compromise));
        dispatch(setDetailBreachesThirdParty(data.data.thidparty_compromise));
        dispatch(setDetailBreachesTotal(data.data.total_compromise));
        return res;
      }
    } catch (error) {
      console.log("error get breaches data: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callPostKeywordDomainSearchWithRefreshToken = async (key) => {
    await fetchWithRefreshToken(postKeywordDomainSearch, router, dispatch, key);
  };

  const postKeywordDomainSearch = async (key) => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}recent/search-domain?q=${key}`, {
        method: "POST",
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
        console.log("post keyword: ", data);
        throw res;
      }

      //   return res;

      if (data.data) {
        console.log("success post keyword: ", data);
        return res;
      }
    } catch (error) {
      console.log("error send keyword: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchRecentSearchData = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}recent/search-domain`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("recent search data: ", data);

      if (data.data === null) {
        setAllRecentSearch();
        throw res;
      }

      setAllRecentSearch(data.data);
      return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callRecentSearchData = async () => {
    await fetchWithRefreshToken(fetchRecentSearchData, router, dispatch);
  };

  const DeleteRecentSearchData = async (deleteId = "") => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}recent/search-domain`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setTriggerChange(true);
        throw res;
      }

      // return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const deleteRecentSearchData = async (id) => {
    await fetchWithRefreshToken(DeleteRecentSearchData, router, dispatch, id);
  };

  const DeleteAllRecentSearchData = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}recent/search-domain`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setTriggerChange(true);
        throw res;
      }

      // return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const deleteAllRecentSearchData = async () => {
    await fetchWithRefreshToken(DeleteAllRecentSearchData, router, dispatch);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsErrorEmail(false);
    }, 5000);
  }, [isErrorEmail]);

  useEffect(() => {
    if (hasCookie("scanned_domain") && email) {
      switch (selectedButton) {
        case DOMAIN_SEARCH_EMPLOYEE:
          callGetDetailLeakedDataWithRefeshToken(DOMAIN_SEARCH_EMPLOYEE, email);
          callGetBreachesDataWithRefeshToken(email);
          if (
            !searchParams.has("query") ||
            !searchParams.has("page") ||
            !searchParams.has("type")
          ) {
            params.set("query", getCookie("scanned_domain"));
            params.set("page", page);
            params.set("type", DOMAIN_SEARCH_EMPLOYEE);
            router.push(`${pathname}?${params.toString()}`);
          }
          break;
        case DOMAIN_SEARCH_USERS:
          callGetDetailLeakedDataWithRefeshToken(DOMAIN_SEARCH_USERS, email);
          callGetBreachesDataWithRefeshToken(email);
          if (
            !searchParams.has("query") ||
            !searchParams.has("page") ||
            !searchParams.has("type")
          ) {
            params.set("query", getCookie("scanned_domain"));
            params.set("page", page);
            params.set("type", DOMAIN_SEARCH_USERS);
            router.push(`${pathname}?${params.toString()}`);
          }
          break;
        case DOMAIN_SEARCH_THIRDPARTY:
          callGetDetailLeakedDataWithRefeshToken(
            DOMAIN_SEARCH_THIRDPARTY,
            email
          );
          callGetBreachesDataWithRefeshToken(email);
          if (
            !searchParams.has("query") ||
            !searchParams.has("page") ||
            !searchParams.has("type")
          ) {
            params.set("query", getCookie("scanned_domain"));
            params.set("page", page);
            params.set("type", DOMAIN_SEARCH_THIRDPARTY);
            router.push(`${pathname}?${params.toString()}`);
          }
          break;
        default:
          break;
      }
    } else {
      deleteCookie("scanned_domain");
      params.delete("query");
      params.delete("page");
      params.delete("type");
      router.push(`${pathname}`);
    }
  }, [page, selectedButton]);

  useEffect(() => {
    setTriggerChange(false);
    callRecentSearchData();
  }, [triggerChange]);

  useEffect(() => {
    callRecentSearchData();
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
              onFocus={handleIsEmailFocusTrue}
              // onBlur={handleIsEmailFotusFalse}
              onMouseEnter={handleIsEmailFocusTrue}
              // onMouseLeave={handleIsEmailFotusFalse}
            />
            {isEmailFocused && allRecentSearch && (
              <div
                className="bg-white drop-shadow-lg rounded-md p-4 absolute top-[50px] left-[20%] right-[31%] max-h-[320px] overflow-y-scroll pointer-events-auto z-10"
                onMouseEnter={handleIsEmailFocusTrue}
                onMouseLeave={handleIsEmailFotusFalse}
              >
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <h1 className="text-Base-strong text-black">
                      Search history
                    </h1>
                    <p className="text-text-description text-SM-normal mt-1">
                      Rescanning these email addresses does not reduce your
                      search credit count.
                    </p>
                  </div>
                  <button
                    className="text-primary-base text-Base-normal"
                    onClick={handleDeleteAll}
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-5">
                  {allRecentSearch &&
                    allRecentSearch.map((data) => (
                      <div
                        key={data.id}
                        className="mt-4 flex items-center justify-between cursor-pointer hover:bg-[#FFEBD4] px-1.5 py-1 rounded-md"
                      >
                        <div className="flex items-center">
                          <div>
                            <Image
                              src={"/images/recent_search_logo.svg"}
                              alt="search icon"
                              width={18}
                              height={18}
                            />
                          </div>
                          <h1
                            className="text-Base-normal text-black ml-3"
                            onClick={() =>
                              handleClickSearchHistoryEmail(data.search_domain)
                            }
                          >
                            {data.search_domain}
                          </h1>
                        </div>
                        <div className="cursor pointer">
                          <Image
                            src={"/images/close_recent_search_logo.svg"}
                            alt="search icon"
                            width={9}
                            height={9}
                            onClick={() => handleDeleteIndividual(data.id)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
          "mt-10 bg-white min-h-[470px] rounded-lg shadow-md p-8 flex flex-col "
        )}
      >
        <section
          className={clsx(
            "grid grid-cols-4 gap-4 mb-[48px]",
            typeof dataLeakedDomain === "string" ? "hidden" : "visible"
          )}
        >
          <DomainBreaches
            dataBreaches={dataBreachesTotal}
            text={"Total compromises"}
          />
          <DomainBreaches
            dataBreaches={dataBreachesEmployee}
            text={"Employee compromises"}
          />
          <DomainBreaches
            dataBreaches={dataBreachesUsers}
            text={"User compromises"}
          />
          <DomainBreaches
            dataBreaches={dataBreachesThirdParty}
            text={"Third-party  compromises"}
          />
        </section>
        <section
          className={clsx(
            "flex  mr-auto",
            typeof dataLeakedDomain === "string" ? "hidden" : "visible"
          )}
        >
          <CompromiseButton
            isActive={selectedButton === DOMAIN_SEARCH_EMPLOYEE}
            // total={employeeData && employeeData.count}
            value={"Employee"}
            onClick={handleButtonClick}
            nameData={DOMAIN_SEARCH_EMPLOYEE}
          />

          <CompromiseButton
            isActive={selectedButton === DOMAIN_SEARCH_USERS}
            // total={usersData && usersData.count}
            value={"Users"}
            onClick={handleButtonClick}
            nameData={DOMAIN_SEARCH_USERS}
          />

          <CompromiseButton
            isActive={selectedButton === DOMAIN_SEARCH_THIRDPARTY}
            // totalt={totalThirdParty && totalThirdParty}
            value={"Third-party"}
            onClick={handleButtonClick}
            nameData={DOMAIN_SEARCH_THIRDPARTY}
          />
        </section>

        {/* Start: Email not been search */}
        <div
          className={clsx(
            "flex items-center justify-center my-auto",
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

        <div className={clsx()}>
          {/* Start: Email Searched */}
          <div
            className={clsx(
              "flex flex-col justify-center items-center bg-white rounded-lg  text-center mt-8 overflow-scroll ",
              // hasCookie("scanned_verified") &&
              //   getCookie("scanned_verified") === "true"
              //   ? "visible"
              //   : "hidden"
              dataLeakedDomain && dataLeakedDomain !== null
                ? "visible"
                : "hidden"
            )}
          >
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
                  <Pagination
                    type="primary"
                    defaultCurrent={1}
                    total={totalExposuresDomain && totalExposuresDomain}
                    showSizeChanger={false}
                    style={{ color: "#FF6F1E" }}
                    hideOnSinglePage={true}
                    onChange={handleChangePage}
                    current={page}
                  />
                </ConfigProvider>
              </div>
            </div>
          </div>
          {/* End: Email Searched */}

          {/* Start: Email is safe */}
          <div
            className={clsx(
              "flex flex-col justify-center items-center bg-white rounded-lg  text-center mt-8 relative top-[50%] ",
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
            <h1 className="text-heading-4 text-black">
              Your {handleReturnValueOfSafeState()} data websites is safe!
            </h1>
            <h2 className="text-LG-normal text-text-description mt-3 max-w-[450px]">
              Nothing was found after scanning {handleReturnValueOfSafeState()}{" "}
              data from your websites.
            </h2>
          </div>
          {/* End: Email is safe */}
        </div>
      </section>
    </main>
  );
}
