import Image from "next/image";
import clsx from "clsx";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function Menu({ data, onClick }) {
  const { imageLink, title, description, href } = data;
  console.log("onclick: ", onClick);
  return (
    <Link
      className="flex items-center border-2 border-input-border rounded-xl py-4 px-8 cursor-pointer "
      href={onClick ? "" : href}
      onClick={onClick}
    >
      <Image alt={title} src={`/${imageLink}`} width={62} height={48} />
      <div className="ml-8 flex-grow">
        <h1 className="text-black text-heading-4">{title}</h1>
        <p className="text-justify w-[60%]  mt-2 text-text-description">
          {description}
        </p>
      </div>
      <div className="flex justify-self-end items-center ">
        <RightOutlined />
      </div>
    </Link>
  );
}
