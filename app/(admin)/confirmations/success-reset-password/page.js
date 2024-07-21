import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import Image from "next/image";

export default function SuccessResetPasswordPage() {
  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className="bg-white w-[50%] p-[110px]">
        <div className="text-center flex items-center justify-center flex-col w-[90%] mx-auto">
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

          <h1 className="text-heading-2 text-black mb-4">Password changed!</h1>
          <p className="text-text-description text-LG-normal mb-8">
            Your password has been successfully. Remember to use your new
            password to access your account.
          </p>
          <PrimaryButton value={"Login"} href={"/auth/login"} />
        </div>
      </div>
    </main>
  );
}
