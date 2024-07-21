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
import { useState, useEffect, Suspense } from "react";
import clsx from "clsx";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { useSearchParams, redirect, useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [agreements, setAgreements] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ---------- Start of: Page Access Validation -----------------
  const searchParams = useSearchParams();

  const code = searchParams.has("code");
  const codeValid = searchParams.get("code")?.length === 4;
  const tokenId = searchParams.has("id");
  const tokenIdValid = searchParams.get("id")?.length > 4;

  const theCode = searchParams.get("code");
  const theTokenId = searchParams.get("id");

  // ---------- End of:  Page Access Validation ------------

  const toggleShowPasswordVisibility = () => {
    setShowPassword((prevPasswordState) => !prevPasswordState);
  };
  const toggleShowRetypePasswordVisibility = () => {
    setShowRetypePassword((prevPasswordState) => !prevPasswordState);
  };

  const { passwordRequirement } = CheckPasswordRequirements(password);
  const { overallStrength } = CalculatePasswordStrength(password);
  const { strength_1, strength_2, strength_3, strength_4, strength_5 } =
    GetCalculatePasswordStrengthByNumber(overallStrength);

  const strengths = {
    strength_1,
    strength_2,
    strength_3,
    strength_4,
    strength_5,
    passwordRequirement,
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Check if retype password matches after password change
    setPasswordMatchError(retypePassword !== newPassword);

    // TODO
    // setAgreements(!passwordMatchError);
  };

  const handleRetypePasswordChange = (e) => {
    const newRetypePassword = e.target.value;
    setRetypePassword(newRetypePassword);

    // Check if retype password matches after retype password change
    setPasswordMatchError(password !== newRetypePassword);

    // TODO
    // setAgreements(!retypePassword);
  };

  const canSave =
    password && retypePassword && !passwordMatchError && passwordRequirement;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        setLoading(true);
        const res = await fetch(
          `${APIKEY}auth/new/password?code=${theCode}&id=${theTokenId}`,
          {
            method: "POST",
            body: JSON.stringify({
              password,
              confirm_password: retypePassword,
            }),
            headers: {
              Authorization: "app_secret!!!",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!data.success) {
          throw new Error("");
        }

        router.push("/confirmations/success-reset-password");
      } catch (error) {
        setError(true);
        router.push("/error/not-authorize");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!code || !codeValid || !tokenId || !tokenIdValid) {
      return redirect("/auth/login");
    }
  }, []);

  if (!code || !codeValid || !tokenId || !tokenIdValid) {
    return null;
  }

  return (
    <Suspense>
      <main className="h-screen bg-input-container flex items-center justify-center">
        <div className={clsx(loading ? "visible" : "hidden")}>
          <LoadingSpin />
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

            <h1 className="text-heading-2 text-black mb-4">Create password</h1>
            {/* <p className="text-text-description text-LG-normal mb-8">
              Your new password must be different from previous used passwords.
            </p> */}
            <div className="bg-input-container relative w-full text-left">
              <Password
                showPassword={showPassword}
                value={password}
                toggleShowIcon={toggleShowPasswordVisibility}
                isPasswordFocused={isPasswordFocused}
                passwordRequirement={passwordRequirement}
                onBlur={handlePasswordBlur}
                onFocus={handlePasswordFocus}
                onChange={handlePasswordChange}
                hasTooltip={true}
                passwordMatchError={false}
                placeholder={"New password"}
              />
            </div>
            <ProgressBar data={strengths} />
            <div className=" mt-4 text-left relative w-full ">
              <Password
                showPassword={showRetypePassword}
                value={retypePassword}
                toggleShowIcon={toggleShowRetypePasswordVisibility}
                onChange={handleRetypePasswordChange}
                hasTooltip={false}
                passwordMatchError={passwordMatchError}
                placeholder={"Re-confirm password"}
              />
            </div>
            <div className="w-full mt-2 text-left">
              <p
                className={clsx(
                  "text-Base-normal text-error",
                  passwordMatchError ? "block" : "hidden",
                  retypePassword.length === 0 ? "hidden" : "block"
                )}
              >
                Pasword do not match. Please try again.
              </p>
            </div>
            <div className="w-full m-8">
              <AuthButton
                value={"Reset password"}
                agreements={canSave}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
