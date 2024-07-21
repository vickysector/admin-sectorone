import clsx from "clsx";
import Image from "next/image";

export default function LoadingStateCard({ loading }) {
  return (
    <div
      className={clsx(
        "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-40 flex items-center justify-center text-black ",
        loading ? "visible" : "hidden"
      )}
    >
      <div
        className={clsx(
          "rounded-xl bg-white p-[24px] w-[20%] text-center flex justify-center items-center flex-col"
        )}
      >
        <div>
          <Image
            src={"/images/Loading_image_gif.gif"}
            alt="search icon"
            width={150}
            height={150}
          />
        </div>
        <h1 className="text-LG-strong">Scanning data</h1>
        <p className="text-text-description text-Base-normal mt-[-2px]">
          This will take a moment...
        </p>
      </div>
    </div>
  );
}
