import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";

export default function NotAuthorizePage() {
  return (
    <main className=" h-[100vh] flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-heading-3">OOPPS... Something Wrong!.</h1>

        <div className="mt-8">
          <PrimaryButton value={"Back to Login"} href={"/auth/login"} />
        </div>
      </div>
    </main>
  );
}
