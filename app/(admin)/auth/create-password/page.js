"use client";

import Image from "next/image";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "@/app/_ui/Tooltip.css";
import "@/app/_ui/CheckboxCustom.css";
import { useState, useRef, useEffect, Suspense } from "react";
import clsx from "clsx";
import {
  CalculatePasswordStrength,
  GetCalculatePasswordStrengthByNumber,
} from "@/app/_lib/CalculatePassword";
import { CheckPasswordRequirements } from "@/app/_lib/PasswordRequirements";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Password from "@/app/_ui/components/inputs/Password";
import { ProgressBar } from "@/app/_ui/components/utils/ProgressBar";
import { APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";

export default function CreatePasswordPage() {
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
  };

  const handleRetypePasswordChange = (e) => {
    const newRetypePassword = e.target.value;
    setRetypePassword(newRetypePassword);

    // Check if retype password matches after retype password change
    setPasswordMatchError(password !== newRetypePassword);
  };

  const handleAgreements = (e) => {
    setAgreements((prevState) => !prevState);
  };

  const canSave =
    agreements &&
    password &&
    retypePassword &&
    !passwordMatchError &&
    passwordRequirement;

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

        router.push("/confirmations/success-created-password");
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
      <main className="h-auth-screen -500 flex relative">
        <div className={clsx(loading ? "visible" : "hidden")}>
          <LoadingSpin />
        </div>
        <section className="flex-1 flex flex-col items-center justify-center h-full w-full ">
          <div className="">
            <h1 className="text-heading-1">Create password</h1>
            <p className="text-LG-normal text-text-description mt-[8px] mb-8">
              To get started, let’s set up a strong password for your account
            </p>

            <form action="">
              <div className="bg-input-container relative ">
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
                  placeholder={"Password"}
                />
              </div>
              <ProgressBar data={strengths} />
              <div className=" mt-4 text-right relative">
                <Password
                  showPassword={showRetypePassword}
                  value={retypePassword}
                  toggleShowIcon={toggleShowRetypePasswordVisibility}
                  onChange={handleRetypePasswordChange}
                  hasTooltip={false}
                  passwordMatchError={passwordMatchError}
                  placeholder={"Retype password"}
                />
              </div>
              <div className="w-full mt-2">
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

              <div className="mt-4 mb-8 flex items-center mr-1.5">
                <input
                  type="checkbox"
                  name=""
                  id="agreements"
                  value="I agree to the Terms & Conditions and Privacy Policy"
                  className=" text-Base-normal"
                  checked={agreements}
                  onChange={handleAgreements}
                />
                <label
                  htmlFor="agreements"
                  className="text-Base-normal ml-1.5 text-text-description"
                >
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>

              <AuthButton
                onClick={handleSubmit}
                agreements={canSave}
                value={"Create Password"}
              />
            </form>
          </div>
          <div className="absolute bottom-[10%] left-[9.5%]">
            <p className="text-Base-normal text-text-description">
              &copy; 2024 Sector. All right reserved.
            </p>
          </div>
        </section>
        <section className="flex-1 bg-primary-200 w-full h-full flex items-center justify-center">
          <Image
            src={"/images/sector_image_auth_lock.svg"}
            width={640}
            height={640}
            alt="hero image auth"
          />
        </section>
      </main>
    </Suspense>
  );
}
