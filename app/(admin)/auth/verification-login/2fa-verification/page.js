"use client";

import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import Password from "@/app/_ui/components/inputs/Password";
import { APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useRouter, redirect } from "next/navigation";

export default function FaAuthPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [errorOtp, setErrorOtp] = useState(false);
  const [errorOtpMessage, setErrorOtpMessage] = useState("");

  const router = useRouter();

  const toggleShowOtpVisibility = () => {
    setShowOtp((prevPasswordState) => !prevPasswordState);
  };

  const handleOtpChange = (e) => {
    const newPassword = e.target.value;
    setOtp(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp) {
      try {
        setLoadingSendOtp(true);

        const res = await fetch(`${APIKEY}verified/2fa`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: otp,
          }),
        });

        const data = await res.json();

        if (data.data === null) {
          throw new Error("Error");
        }

        deleteCookie("access_token");
        setCookie("refresh_token", data.data.refresh_token);
        setCookie("access_token", data.data.access_token);
        setCookie("email_credentials", data.data.email);
        router.push("/credentials/dashboard");
      } catch (error) {
        setErrorOtpMessage("Inccorrect OTP. Please try again");
        setErrorOtp(true);
      } finally {
        setLoadingSendOtp(false);
      }
    }
  };

  useEffect(() => {
    if (!getCookie("access_token")) {
      return redirect("/auth/login");
    }
    if (getCookie("refresh_token")) {
      return redirect("/credentials/dashboard");
    }
  }, []);

  // if (!getCookie("access_token")) {
  //   return null;
  // }

  return (
    <main className="h-auth-screen -500 flex relative">
      <div className={clsx(loadingSendOtp ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <section className="flex-1 flex flex-col items-center justify-center h-full w-full ">
        <div className="w-[65%]">
          <h1 className="text-heading-1 w-[80%]">Enter verification code</h1>
          <p className="text-LG-normal text-text-description mt-[8px] mb-8">
            We notification you the four digit code to your 2FA account enter
            the code below to confirm your account.
          </p>

          <form action="">
            <div className="mb-8">
              <div className="bg-input-container relative ">
                <Password
                  showPassword={showOtp}
                  value={otp}
                  toggleShowIcon={toggleShowOtpVisibility}
                  onChange={handleOtpChange}
                  hasTooltip={false}
                  placeholder={"Input OTP"}
                  max={6}
                  errorState={errorOtp}
                />
              </div>
              <p
                className={clsx(
                  "text-Base-normal text-error mt-2 ",
                  errorOtp ? "visible" : "hidden"
                )}
              >
                {errorOtpMessage}
              </p>
            </div>

            <AuthButton
              value={"Verify"}
              agreements={otp}
              onClick={handleSubmit}
            />
          </form>
          <div className="flex items-center mt-4 justify-between">
            <a href="#" className="block text-text-description text-LG-normal">
              Need help?
            </a>
          </div>
        </div>

        <div className="absolute bottom-[10%] left-[9.5%]">
          <p className="text-Base-normal text-text-description">
            &copy; 2024 Sector. All right reserved.
          </p>
        </div>
      </section>
      <section className="flex-1 bg-primary-200 w-full h-full flex items-center justify-center">
        <Image
          src={"/images/sector_2fa_auth_verif.svg"}
          width={500}
          height={500}
          alt="hero image auth"
        />
      </section>
    </main>
  );
}
