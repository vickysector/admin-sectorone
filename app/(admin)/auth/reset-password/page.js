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
import { APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import { SecondaryButton } from "@/app/_ui/components/buttons/SecondaryButton";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import { useRouter, redirect } from "next/navigation";
import { setCookie, getCookie, hasCookie } from "cookies-next";

export default function ResetPasswordPage() {
  const [agreements, setAgreements] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFound, setEmailFound] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (email) {
      try {
        setLoading(true);
        const res = await fetch(`${APIKEY}link/password`, {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
          headers: {
            Authorization: "app_secret!!!",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          setEmail("");
          throw new Error();
        }

        setEmailFound(true);
      } catch (error) {
        setError(true);
        setErrorMessage("Email Not Found!");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (getCookie("access_token") || getCookie("refresh_token")) {
      // router.push("/credentials/dashboard");
      return redirect("/credentials/dashboard/users");
    }
  }, []);

  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className={clsx(loading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <div className={clsx(emailFound ? "visible" : "hidden")}>
        <div className="fixed top-0 left-0 bottom-[0] right-0 z-20 bg-[#000000B2] flex items-center justify-center">
          <div className="bg-white rounded-lg p-[32px]">
            <h1 className="text-LG-strong">Password reset confirmation</h1>
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
            Enter your email and we’ll send you a link to reset your password
          </p>
          <div className="w-full">
            <div className="bg-input-container w-full relative ">
              <input
                type="email"
                className={clsx(
                  " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal ",
                  error ? "border-error outline-error" : "border-input-border"
                )}
                placeholder={"Email"}
                value={email}
                onChange={handleEmail}
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
              value={"Reset password"}
              agreements={email}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
