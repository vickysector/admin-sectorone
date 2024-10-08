"use client";

import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import {
  setDetailsIsOpen,
  setDetailsLeakedData,
  setLeakedData,
  setTotalExposures,
} from "@/app/_lib/store/features/ExecutiveProtections/LeakedDataSlices";
import {
  setCallDeleteSearchHistory,
  setIsConfirmDeleteHistory,
} from "@/app/_lib/store/features/ExecutiveProtections/SearchHistorySlices";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import { Alert, ConfigProvider, Pagination } from "antd";
import clsx from "clsx";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ExecutiveProtectionPage() {
  const [email, setEmail] = useState(getCookie("scanned_email") || "");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allRecentSearch, setAllRecentSearch] = useState();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [triggerChange, setTriggerChange] = useState(false);

  const canSend = email;
  const dispatch = useDispatch();
  const router = useRouter();

  const dataLeaked = useSelector(
    (state) => state.executiveProtections.leakedData
  );

  //   const errorDataLeaked = useSelector(
  //     (state) => state.executiveProtections.errorLeakedData
  //   );

  const totalExposures = useSelector(
    (state) => state.executiveProtections.totalExposures
  );

  const dataLeakedDetails = useSelector(
    (state) => state.executiveProtections.detailsLeakedData.info_2
  );

  console.log(
    "data executive admin baru (index) (details): ",
    dataLeakedDetails
  );

  function sliceObject(obj, chunkSize = 3) {
    const entries = Object.entries(obj);
    if (entries.length <= chunkSize) return [obj];

    const result = [];
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      result.push(Object.fromEntries(chunk));
    }
    return result;
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value.trimStart());
    setCookie("scanned_email", e.target.value.trimStart());
  };

  const handleScanNow = () => {
    console.log("scan now..");
    callGetDetailLeakedDataWithRefeshToken();
  };

  const handleDetails = (item) => {
    console.log("item (details): ", item);
    dispatch(setDetailsLeakedData(item));
    dispatch(setDetailsIsOpen(true));
    // console.log("item leaked details: ", item);
  };

  const handleIsEmailFocusTrue = () => {
    setIsEmailFocused(true);
  };

  const handleIsEmailFotusFalse = () => {
    setIsEmailFocused(false);
  };

  const handleDeleteIndividual = (id) => {
    // dispatch(setIsConfirmDeleteHistory(true));
    // dispatch(setCallDeleteSearchHistory(() => deleteRecentSearchData(id)));
    deleteRecentSearchData(id);
  };

  const handleDeleteAll = () => {
    // dispatch(setIsConfirmDeleteHistory(true));
    // dispatch(setCallDeleteSearchHistory(deleteAllRecentSearchData));
    deleteAllRecentSearchData();
    // deleteAllRecentSearchData();
  };

  const handleClickSearchHistoryEmail = (email, verified) => {
    setEmail(email);
    // dispatch(setHistorySearchEmailVerified(verified));
    callGetDetailLeakedDataWithRefeshToken();
    setCookie("scanned_email", email);
  };

  const callGetDetailLeakedDataWithRefeshToken = async () => {
    await fetchWithRefreshToken(fetchGetDetailLeakedData, router, dispatch);
  };

  const fetchGetDetailLeakedData = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}protection?search=${email}&type_search=superadmin`,
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

      console.log("data executive admin: ", data);

      if (data.error) {
        // dispatch(setErrorLeakedData(true));
        return res;
      }

      if (data.success === false) {
        setIsErrorEmail(true);
        setErrorMessage(data.message);
        dispatch(setLeakedData(null));
        throw res;
      }

      //   return res;

      // if ("No results found" in data.List) {
      //   dispatch(setLeakedData(null));
      //   return res;
      // } else {
      //   let totalItems = Object.keys(data.List).length;
      //   dispatch(setLeakedData(data));
      //   dispatch(setTotalExposures(totalItems));
      //   return res;
      // }
      if (data.success === true) {
        dispatch(setLeakedData(data.result));
        dispatch(setTotalExposures(data.found));
        return res;
      }
    } catch (error) {
      console.log("error get leaked data: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchRecentSearchData = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}protection`, {
        method: "POST",
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

      const res = await fetch(`${APIDATAV1}protection`, {
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

      const res = await fetch(`${APIDATAV1}protection`, {
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

  // const MapLeakedData =
  //   dataLeaked &&
  //   Object.entries(dataLeaked.List).map(([website, data]) => {
  //     let leakedKeys = [];
  //     if (data.Data && data.Data.length > 0) {
  //       leakedKeys = Object.keys(data.Data[0]);
  //     }

  //     let idDetailData = dataLeaked.id;
  //     return { website, leakedKeys, idDetailData };
  //   });

  useEffect(() => {
    setTimeout(() => {
      setIsErrorEmail(false);
    }, 5000);
  }, [isErrorEmail]);

  useEffect(() => {
    if (hasCookie("scanned_email") && email) {
      callGetDetailLeakedDataWithRefeshToken();
    } else {
      deleteCookie("scanned_email");
    }
  }, []);

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
            Has your personal data been exposed?
          </h1>
          <h2 className="text-Base-normal text-text-description mt-[12px]">
            Scan your primary email to see your digital footprint.
          </h2>
        </div>
        <div className="mt-[32px] w-full">
          <div className="flex text-center justify-center items-center relative">
            <input
              type="text"
              className="rounded-md px-3 py-[5px] border-input-border border-2 w-[50%] text-LG-normal text-black"
              placeholder="name@mail.com"
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
                              handleClickSearchHistoryEmail(
                                data.search,
                                data.verified
                              )
                            }
                          >
                            {data.search}
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
          "mt-10 bg-white min-h-[470px] rounded-lg shadow-md flex items-center justify-center p-8 "
        )}
      >
        {/* Start: Email not been search */}
        <div
          className={clsx(
            "flex items-center justify-center",
            // dataLeaked.length === 0 ? "visible" : "hidden",
            typeof dataLeaked === "string" ? "visible" : "hidden"
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
              Start scanning your email
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
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center mt-8 ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "visible"
            //   : "hidden"
            dataLeaked && dataLeaked !== null ? "visible" : "hidden"
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
              message={`We found ${totalExposures} exposures of your data.`}
              type="warning"
              showIcon
              closable
              style={{
                textAlign: "left",
              }}
            />
          </div>

          <div className="border-2 rounded-xl border-input-border w-full">
            <table className="bg-white  w-full rounded-xl text-left">
              <thead className="text-black text-Base-strong bg-[#00000005]">
                <tr className="border-b-[1px] border-[#D5D5D5]">
                  <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                    No
                  </td>
                  <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                    Website Name
                  </td>
                  <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                    Leaked Data
                  </td>
                  <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody className="text-Base-normal text-text-description">
                {/* {MapLeakedData &&
                  MapLeakedData.map((data, index) => {
                    console.log("data leaked keys ", data.leakedKeys);
                    console.log(
                      "data leaked value ",
                      dataLeaked.List[data.website].Data[0]
                    );

                    console.log("data semua: ", data);

                    const formattedData = sliceObject(
                      dataLeaked.List[data.website].Data[0]
                    );

                    let allData = {
                      info_1: data,
                      info_2: dataLeaked.List[data.website].Data[0],
                      info_3: formattedData,
                    };

                    return (
                      <tr
                        className="border-b-[2px] border-[#D5D5D5]"
                        key={index}
                      >
                        <td className="py-[19px] px-[16px]"> {index + 1} </td>
                        <td className="py-[19px] px-[16px]">{data.website}</td>
                        <td className="py-[19px] px-[16px] w-[45%]">
                          {data.leakedKeys.map((key) => (
                            <>
                              <span
                                className="inline-block bg-white text-text-description rounded-[100px] border-[1px] border-[#D5D5D5] text-SM-normal py-1 px-4 mr-2 mt-2"
                                key={key}
                              >
                                {key}
                              </span>
                            </>
                          ))}
                        </td>
                        <td className="py-[19px] px-[16px]">
                          <button
                            className="rounded-md border-[1px] border-input-border text-primary-base text-Base-normal py-1.5 px-4"
                            onClick={() => handleDetails(allData)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })} */}
                {dataLeaked &&
                  dataLeaked.map((data, index) => {
                    console.log("data executive admin baru (data): ", data);
                    console.log("data executive admin baru (index): ", index);
                    let keys = Object.entries(data).map(([k, v]) => k);
                    // console.log("data executive admin baru (key): ", key);

                    return (
                      <tr
                        className="border-b-[2px] border-[#D5D5D5]"
                        key={index}
                      >
                        <td className="py-[19px] px-[16px]"> {index + 1} </td>
                        <td className="py-[19px] px-[16px]">
                          {data.source.name}
                        </td>
                        <td className="py-[19px] px-[16px] w-[45%]">
                          {keys.map((field) => (
                            <>
                              <span
                                className="inline-block bg-white text-text-description rounded-[100px] border-[1px] border-[#D5D5D5] text-SM-normal py-1 px-4 mr-2 mt-2"
                                key={field}
                              >
                                {field}
                              </span>
                            </>
                          ))}
                        </td>
                        <td className="py-[19px] px-[16px]">
                          <button
                            className="rounded-md border-[1px] border-input-border text-primary-base text-Base-normal py-1.5 px-4"
                            onClick={() => handleDetails(data)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="flex items-center justify-between my-[19px] mx-[16px]">
              <p className="text-Base-normal text-[#676767] ">
                Showing {totalExposures} to {totalExposures} entries
              </p>
              {/* <div>
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
                    total={totalExposures}
                    showSizeChanger={false}
                    style={{ color: "#FF6F1E" }}
                    // current={bookmarkPage}
                    // onChange={handleSetBookmarkPage}
                  />
                </ConfigProvider>
              </div> */}
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
            dataLeaked === null ? "visible" : "hidden"
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
            Your email account is safe!
          </h1>
          <h2 className="text-LG-normal text-text-description mt-3 max-w-[450px]">
            Nothing was found after scanning your email address.
          </h2>
        </div>
        {/* End: Email is safe */}
      </section>
    </main>
  );
}
