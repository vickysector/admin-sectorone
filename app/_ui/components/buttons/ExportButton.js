import Image from "next/image";
import { DownloadOutlined } from "@ant-design/icons";
import clsx from "clsx";

export default function ExportButton({ onClick, disabled }) {
  return (
    <button
      className={clsx(
        " px-5 flex items-center   rounded-lg",
        disabled === null
          ? "cursor-not-allowed border-2 py-1.5 border-[#D5D5D5] bg-[#0000000A]"
          : "cursor-pointer opacity-100 py-2 bg-blue-export"
      )}
      onClick={onClick}
      disabled={disabled === null}
    >
      {disabled === null ? (
        <p className="text-[#00000040] text-LG-normal">Download CSV</p>
      ) : (
        <>
          <DownloadOutlined style={{ color: "white" }} />
          <p className="ml-3 text-white text-LG-normal">Download CSV</p>
        </>
      )}
    </button>
  );
}
