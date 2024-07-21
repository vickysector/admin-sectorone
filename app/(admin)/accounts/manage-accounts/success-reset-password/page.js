"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";

export default function ManageAccountSuccessResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  }, []);

  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className="bg-white w-[50%] py-[40px] px-[110px]">
        <div className="text-center flex items-center justify-center flex-col w-[80%] mx-auto">
          <Image
            src={"/images/SectorOne.png"}
            alt="Logo Sector"
            width={92}
            height={38}
          />

          <Image
            src={"/images/sector_confirmation_created_password_success.svg"}
            alt="Logo Sector"
            width={300}
            height={300}
          />

          <h1 className="text-heading-2 text-black mb-4">Password Changed</h1>
          <p className="text-text-description text-LG-normal mb-8">
            You have successfully Change Password. You will be automatically
            redirected to Login page...
          </p>

          <p className="text-LG-normal text-text-description mt-8">
            Thank you, Sector team.
          </p>
        </div>
      </div>
    </main>
  );
}
