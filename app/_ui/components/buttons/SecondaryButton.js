import clsx from "clsx";
import Link from "next/link";

export function SecondaryButton({ value, href }) {
  return (
    <Link
      href={href}
      className="cursor-pointer w-full  py-1.5 px-3  rounded-lg text-Base-normal bg-white border-2 border-input-border  text-primary-base"
    >
      {" "}
      {value}{" "}
    </Link>
  );
}
