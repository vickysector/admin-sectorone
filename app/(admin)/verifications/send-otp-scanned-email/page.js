"use client";

import {
  CalculatePasswordStrength,
  GetCalculatePasswordStrengthByNumber,
} from "@/app/_lib/CalculatePassword";
import { CheckPasswordRequirements } from "@/app/_lib/PasswordRequirements";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Password from "@/app/_ui/components/inputs/Password";
import { ProgressBar } from "@/app/_ui/components/utils/ProgressBar";
import Image from "next/image";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { APIDATAV1, APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import { SecondaryButton } from "@/app/_ui/components/buttons/SecondaryButton";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import { useRouter, redirect } from "next/navigation";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useSelector, useDispatch } from "react-redux";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import dayjs from "dayjs";
import { Alert, Space } from "antd";
import {
  setEmailIsVerified,
  setEmailScannedData,
  setLeakedData,
} from "@/app/_lib/store/features/ExecutiveProtections/LeakedDataSlices";

export default function ResetPasswordPage() {
  const [agreements, setAgreements] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessResendCode, setIsSuccessResendCode] = useState(false);
  const [isErrorResendCode, setIsErrorResendCode] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isWaitResendCode, setIsWaitResendCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isActive, setIsActive] = useState(false);

  const handleOtp = (e) => {
    setEmail(e.target.value);
  };

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmitOtp = () => {
    callSendOtpScannedEmail();
  };

  const handleResendCode = () => {
    callResendOtpScannedEmail();
  };

  const toggleShowOtpVisibility = () => {
    setShowOtp((prevPass) => !prevPass);
  };

  const fetchSendOtpScannedEmail = async () => {
    try {
      setLoading(true);

      //   if (!filterApplied && (keyword || startDate || endDate)) {
      //     setPage(1);
      //     setFilterApplied(true);
      //   }

      const res = await fetch(`${APIDATAV1}validate/protection`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: getCookie("scanned_user"),
          code: email,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        // dispatch(setScannedId(data.data.id));
        // dispatch(setScannedEmail(data.data.search));
        setCookie("scanned_user", data.data.id);
        setCookie("scanned_email", data.data.search);
        setCookie("scanned_verified", data.data.verified);
        dispatch(setEmailScannedData(data.data.search));
        dispatch(setEmailIsVerified(true));
        // deleteCookie("scanned_user");
        // deleteCookie("scanned_email");
        router.push("/credentials/dashboard/executive-protections");

        return res;
      }
    } catch (error) {
      setError(true);
      setErrorMessage("OTP is Not Valid");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const callSendOtpScannedEmail = async () => {
    await fetchWithRefreshToken(fetchSendOtpScannedEmail, router, dispatch);
  };

  const fetchResendOtpScannedEmail = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${APIDATAV1}code/protection`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: getCookie("scanned_user"),
        }),
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      // if (data.data === null) {
      //   throw res;
      // }

      if (data.success) {
        setIsSuccessResendCode(true);
        setIsWaitResendCode(true);
        setIsActive(true);
        return res;
      }
    } catch (error) {
      setIsErrorResendCode(true);
      return error;
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsSuccessResendCode(false);
        setIsErrorResendCode(false);
      }, 4000);
    }
  };

  const callResendOtpScannedEmail = async () => {
    await fetchWithRefreshToken(fetchResendOtpScannedEmail, router, dispatch);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    return `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
  };

  useEffect(() => {
    if (isWaitResendCode) {
      setTimeout(() => {
        setIsWaitResendCode(false);
      }, timeLeft * 1000);
    }
  }, [isWaitResendCode]);

  useEffect(() => {
    if (!getCookie("access_token") || !getCookie("refresh_token")) {
      // router.push("/credentials/dashboard");
      return redirect("/auth/login");
    }
  }, []);

  useEffect(() => {
    let timerId;
    if (isActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimeLeft(60);
      setIsActive(false);
    }

    return () => clearInterval(timerId);
  }, [isActive, timeLeft]);

  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className={clsx(loading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      {/* <div className={clsx(emailFound ? "visible" : "hidden")}>
        <div className="fixed top-0 left-0 bottom-[0] right-0 z-20 bg-[#000000B2] flex items-center justify-center">
          <div className="bg-white rounded-lg p-[32px]">
            <h1 className="text-LG-strong">Enter security code</h1>
            <p className="text-Base-normal text-text-description mt-[30px] w-[85%]">
              Instructions to reset your password have been sent to:
            </p>
            <h2 className="text-Base-strong my-2">{email}</h2>
            <p className="text-Base-normal text-text-description mb-2">
              If you don’t receive it, Please contact support
            </p>
            <div className="flex mt-10 justify-end">
              <div>
                <SecondaryButton value={"Cancel"} href={"/auth/login"} />
              </div>
              <div className="ml-2 items-center">
                <PrimaryButton value={"Done"} href={"/auth/login"} />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-white w-[50%] py-[40px] px-[110px]">
        <div className="text-center flex items-center justify-center flex-col w-[80%] mx-auto relative">
          <Alert
            message={`Success Resend code`}
            type="success"
            style={{
              position: "absolute",
              top: "-64px",
              left: "32px",
              right: "32px",
              textAlign: "left",
            }}
            showIcon
            className={clsx(isSuccessResendCode ? "visible" : "hidden")}
          />
          <Alert
            message={`Something wrong when Resend code`}
            type="error"
            style={{
              position: "absolute",
              top: "-64px",
              left: "32px",
              right: "32px",
              textAlign: "left",
            }}
            showIcon
            className={clsx(isErrorResendCode ? "visible" : "hidden")}
          />
          <Image
            src={"/images/SectorOne.png"}
            alt="Logo Sector"
            width={92}
            height={38}
          />

          <Image
            src={"/images/sector_image_auth_lock.svg"}
            alt="Logo Sector"
            width={200}
            height={200}
          />

          <h1 className="text-heading-2 text-black mb-4">
            Enter security code
          </h1>
          <p className="text-text-description text-LG-normal mb-8">
            We sent a code to{" "}
            <span className="text-LG-strong text-black">
              {getCookie("scanned_email")}
            </span>
          </p>
          <div className="w-full">
            <div className="bg-input-container w-full relative ">
              {/* <input
                type="password"
                className={clsx(
                  " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal ",
                  error ? "border-error outline-error" : "border-input-border"
                )}
                placeholder={"Input OTP"}
                value={email}
                onChange={handleOtp}
              /> */}
              <Password
                placeholder={"Input OTP"}
                hasTooltip={false}
                value={email}
                onChange={handleOtp}
                showPassword={showOtp}
                toggleShowIcon={toggleShowOtpVisibility}
                passwordMatchError={error}
                max={4}
              />
            </div>
            <p
              className={clsx(
                "text-Base-normal text-error mt-2 text-left",
                error ? "visible" : "hidden"
              )}
            >
              {errorMessage}
            </p>
          </div>

          <div className="w-full m-8">
            <AuthButton
              value={"Validate"}
              agreements={email}
              onClick={handleSubmitOtp}
            />
          </div>
          <div>
            <p
              className={clsx(
                "text-LG-normal text-text-description",
                !isWaitResendCode ? "visible" : "hidden"
              )}
            >
              Did not get the code?{" "}
              <button
                className="underline cursor-pointer text-text-description text-LG-normal"
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            </p>
            <p
              className={clsx(
                "text-LG-normal text-text-description",
                isWaitResendCode ? "visible" : "hidden"
              )}
            >
              You can only Resend code after {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
