import clsx from "clsx";
import Link from "next/link";

export function PrimaryButton({ value, href }) {
  return (
    <Link
      href={href}
      className="cursor-pointer w-full  py-1.5 px-3  rounded-lg text-Base-normal bg-primary-base border-2 border-primary-base text-white"
    >
      {" "}
      {value}{" "}
    </Link>
  );
}
