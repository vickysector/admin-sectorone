import Image from "next/image";

export default function SuccessCreatePasswordPage() {
  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className="bg-white w-[50%] p-[110px]">
        <div className="text-center flex items-center justify-center flex-col">
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

          <h1 className="text-heading-2 text-black mb-4">Password created!</h1>
          <p className="text-text-description text-LG-normal mb-8">
            Your password has been created successfully!
          </p>
          <a
            href="/auth/login"
            className="text-Base-normal text-white text-center p-2 bg-primary-base rounded-lg w-[300px]"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
