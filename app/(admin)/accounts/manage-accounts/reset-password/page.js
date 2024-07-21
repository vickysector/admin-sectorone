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
import { useEffect, useState } from "react";
import clsx from "clsx";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useRouter, redirect } from "next/navigation";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";

export default function ResetPasswordUserAfterLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [messageErrorNewPassword, setMessageErrorNewPassword] = useState("");
  const [errorOldPassword, setErrorOldPassword] = useState(false);
  const [messageErrorOldPassword, setMessageErrorOldPassword] = useState("");

  const router = useRouter();

  const toggleShowPasswordVisibility = () => {
    setShowPassword((prevPasswordState) => !prevPasswordState);
  };
  const toggleShowRetypePasswordVisibility = () => {
    setShowRetypePassword((prevPasswordState) => !prevPasswordState);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setOldPassword(newPassword);
  };

  const handleRetypePasswordChange = (e) => {
    const newRetypePassword = e.target.value;
    setNewPassword(newRetypePassword);
  };

  const canSave = oldPassword && newPassword;

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${APIDATAV1}setting/change/password`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (
        data.message.includes("sandi") ||
        data.message.includes("satu huruf")
      ) {
        setErrorNewPassword(true);
        setMessageErrorNewPassword(data.message);
        console.log(data.message);
        setTimeout(() => {
          setErrorNewPassword(false);
        }, 3000);
      }

      if (data.message.includes("Old") || data.message.includes("password")) {
        setErrorOldPassword(true);
        setMessageErrorOldPassword(data.message);
        console.log(data.message);
        setTimeout(() => {
          setErrorOldPassword(false);
        }, 3000);
      }

      if (data.message.includes("Token") || data.message.includes("expired")) {
        DeleteCookies();
        RedirectToLogin();
      }

      if (data.success) {
        DeleteCookies();
        router.push("/accounts/manage-accounts/success-reset-password");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getCookie("access_token") || !getCookie("refresh_token")) {
      RedirectToLogin();
    }
  }, []);

  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className={clsx(loading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <div
        className={clsx(
          "absolute left-[50%] translate-x-[-50%] top-[10%] bg-[#FFF1F0] py-2 px-8 text-Base-normal text-black rounded-lg shadow-lg z-20 ",
          errorOldPassword ? "visible" : "hidden"
        )}
      >
        <p> {errorOldPassword && messageErrorOldPassword} </p>
      </div>
      <div
        className={clsx(
          "absolute left-[50%] translate-x-[-50%] top-[10%] bg-[#FFF1F0] py-2 px-8 text-Base-normal text-black rounded-lg shadow-lg z-20 ",
          errorNewPassword ? "visible" : "hidden"
        )}
      >
        <p> {errorNewPassword && messageErrorNewPassword} </p>
      </div>
      <div className="bg-white w-[50%] py-[40px] px-[110px]">
        <div className="text-center flex items-center justify-center flex-col w-[80%] mx-auto">
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

          <h1 className="text-heading-2 text-black mb-4">Reset password</h1>
          <p className="text-text-description text-LG-normal mb-8">
            If you’d like to change your password, enter your current passwords
            here.
          </p>
          {/* <div className="bg-input-container w-full relative ">
            <input
              type="email"
              className={clsx(
                " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal border-input-border"
              )}
              placeholder={"Email"}
            />
          </div>
          <div className="bg-input-container w-full relative ">
            <input
              type="email"
              className={clsx(
                " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal border-input-border"
              )}
              placeholder={"Email"}
            />
          </div> */}
          <div className="bg-input-container relative w-full text-left">
            <Password
              showPassword={showPassword}
              value={oldPassword}
              toggleShowIcon={toggleShowPasswordVisibility}
              isPasswordFocused={isPasswordFocused}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              onChange={handlePasswordChange}
              placeholder={"Old Password"}
            />
          </div>
          <div className=" mt-4 text-left relative w-full ">
            <Password
              showPassword={showRetypePassword}
              value={newPassword}
              toggleShowIcon={toggleShowRetypePasswordVisibility}
              onChange={handleRetypePasswordChange}
              hasTooltip={false}
              placeholder={"New Password "}
            />
          </div>

          <div className="w-full m-8">
            <AuthButton
              value={"Reset password"}
              agreements={canSave}
              onClick={handleChangePassword}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
