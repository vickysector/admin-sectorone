"use client";

import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { DetailItems } from "@/app/_ui/components/details/detailsItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { useEffect, useState } from "react";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import {
  Pagination,
  ConfigProvider,
  DatePicker,
  Spin,
  Select,
  Checkbox,
  Popover,
  Alert,
} from "antd";
import clsx from "clsx";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { getCookie } from "cookies-next";
import { setDataDetails } from "@/app/_lib/store/features/Compromised/DetailSlices";
import {
  DETAIL_COMPROMISED_BOOKMARK,
  DETAIL_COMPROMISED_COMPROMISE_DEVICES,
} from "@/app/_lib/variables/Variables";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { FormattedParagraph } from "@/app/_ui/components/details/paragraphAi";
import { DetailDescriptions } from "@/app/_ui/components/details/detailsDescriptions";
import { setIsDetailActive } from "@/app/_lib/store/features/KeywordSearch/KeywordSearchSlices";

import dayjs from "dayjs";

export default function DetailsDomainSearch() {
  const detailsCompromisedData = useSelector(
    (state) => state.domainSearch.detailsDomainSearch
  );

  const [dataStealers, setDataStealers] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch();

  console.log("details compromised data: ", detailsCompromisedData);
  console.log("temporary data (state): ", dataStealers);

  const Date = {
    title: "Date",
    data: [
      {
        id: 1,
        key: "Date identified",
        value:
          hasOwnProperty("datetime_added") &&
          dayjs(detailsCompromisedData.datetime_added).format(
            "dddd, D MMMM YYYY HH:mm"
          ),
      },
      {
        id: 2,
        key: "Date compromised",
        value:
          dataStealers.length === 0
            ? hasOwnProperty("datetime_compromised") &&
              convertDateFormat(detailsCompromisedData.datetime_compromised)
            : dayjs(dataStealers[0].date_compromised).format(
                "dddd, D MMMM YYYY HH:mm"
              ),
      },
    ],
  };

  const Account = {
    title: "Account",
    data: [
      {
        id: 1,
        key: "URL",
        value: hasOwnProperty("url") && (
          <a
            href={`${detailsCompromisedData.url}`}
            className="underline"
            target="_blank"
          >
            {detailsCompromisedData.url}
          </a>
        ),
      },
      {
        id: 2,
        key: "Login",
        value: hasOwnProperty("login") && detailsCompromisedData.login,
      },
      {
        id: 3,
        key: "Password",
        value: hasOwnProperty("password") && detailsCompromisedData.password,
      },
    ],
  };

  const Devices = {
    title: "Devices",
    data: [
      {
        id: 1,
        key: "Device name",
        value:
          dataStealers.length === 0
            ? "-"
            : dataStealers[0].computer_name.includes("Found")
            ? "-"
            : dataStealers[0].computer_name,
      },
      {
        id: 2,
        key: "Machine ID",
        value:
          hasOwnProperty("machine_id") && detailsCompromisedData.machine_id,
      },
      {
        id: 3,
        key: "Path",
        value:
          dataStealers.length === 0
            ? "-"
            : dataStealers[0].malware_path.includes("Found")
            ? "-"
            : dataStealers[0].malware_path,
      },
      {
        id: 4,
        key: "Operating System",
        value:
          dataStealers.length === 0
            ? "-"
            : dataStealers[0].operating_system.includes("Found")
            ? "-"
            : dataStealers[0].operating_system,
      },
    ],
  };

  const Others = {
    title: "Others",
    data: [
      {
        id: 1,
        key: "IP Address",
        value:
          dataStealers.length === 0
            ? "-"
            : dataStealers[0].ip.includes("Found")
            ? "-"
            : dataStealers[0].ip,
      },
      {
        id: 2,
        key: "Location",
        value: hasOwnProperty("location") && detailsCompromisedData.location,
      },
      {
        id: 3,
        key: "Antivirus",
        value:
          //   hasOwnProperty("antivirus") &&
          //   detailsCompromisedData.antivirus.length === 0
          //     ? "-"
          //     : hasOwnProperty("antivirus") &&
          //       detailsCompromisedData.antivirus.join(),
          dataStealers.length === 0
            ? "-"
            : dataStealers[0].antiviruses.length === 0 ||
              dataStealers[0].antiviruses.includes("Found")
            ? "-"
            : dataStealers[0].antiviruses.join(", "),
      },
    ],
  };

  const FetchDataTemporaryUsername = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `http://18.138.131.113:8006/search-username?username=${
          hasOwnProperty("login") && detailsCompromisedData.login
        }`
      );

      const data = await res.json();

      setDataStealers(data.stealers);

      console.log("temporary data username: ", data);
    } catch (error) {
      console.log("error get temporary data username: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchDataTemporaryEmail = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `http://18.138.131.113:8006/search-email?email=${
          hasOwnProperty("login") && detailsCompromisedData.login
        }`
      );

      const data = await res.json();

      setDataStealers(data.stealers);

      console.log("temporary data email: ", data);
    } catch (error) {
      console.log("error get temporary data email: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  function hasOwnProperty(property) {
    return detailsCompromisedData.hasOwnProperty(property) ? true : false;
  }

  function handleBackToCompromise() {
    // router.back();
    router.back();
  }

  useEffect(() => {
    if (!hasOwnProperty("id")) {
      router.back();
    }
  }, []);

  useEffect(() => {
    if (hasOwnProperty("login") && detailsCompromisedData.login.includes("@")) {
      FetchDataTemporaryEmail();
    } else {
      FetchDataTemporaryUsername();
    }
  }, []);

  return (
    <>
      <section className="flex items-center relative">
        <div onClick={handleBackToCompromise} className="hover:cursor-pointer">
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black ml-3">Details</h1>
      </section>
      <section className="bg-white rounded-2xl px-8 py-8 mt-6">
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5]">
          <DetailItems items={Date} />
        </div>
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5] mt-8">
          <DetailItems items={Account} />
        </div>
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5] mt-8">
          <DetailItems items={Devices} />
        </div>
        <div className=" mt-8">
          <DetailItems items={Others} />
        </div>
      </section>
    </>
  );
}
