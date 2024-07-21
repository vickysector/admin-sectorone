import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import Image from "next/image";

export default function ResetPasswordPage() {
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

          <h1 className="text-heading-2 text-black mb-4">Password reset</h1>
          <p className="text-text-description text-LG-normal mb-8">
            A request has been received to change the password for your Sector
            account.
          </p>
          <PrimaryButton href={"#"} value={"Reset password"} />

          <p className="text-LG-normal text-text-description mt-8">
            If you did not initiate this request, please contact us immediately
            at{" "}
            <span className="text-Base-strong text-black">
              support@sector.co.id
            </span>
          </p>

          <p className="text-LG-normal text-text-description mt-8">
            Thank you, Sector team.
          </p>
        </div>
      </div>
    </main>
  );
}
