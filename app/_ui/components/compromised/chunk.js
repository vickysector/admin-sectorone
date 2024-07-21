"use client";

import clsx from "clsx";
import copy from "copy-to-clipboard";
import { useState } from "react";
import "./chunk.css";
import { CloseCircleOutlined, CopyOutlined } from "@ant-design/icons";

export default function Chunk({ children, level }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  // console.log("level", level);

  const copyToClipboard = (text) => {
    copy(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleOpenShow = () => {
    setShow(true);
  };

  const handleCloseShow = () => {
    setShow(false);
  };

  return (
    <main className="relative">
      <div
        className={clsx(
          "absolute right-[50%] translate-x-[50%] top-[-100px] bg-white p-2 border-2 border-input-border rounded-lg ",
          copied ? "visible" : "hidden"
        )}
      >
        <p className="text-Base-normal text-text-description">Copied!</p>
      </div>
      <div
        className={clsx(
          "bg-white shadow-md p-2 rounded-lg flex items-center absolute top-[-50px] left-[-50px] text-left ",
          !show ? "hidden" : "show"
        )}
      >
        <p className="">{children}</p>
        <CopyOutlined
          style={{ fontSize: "21px", color: "#FF6F1E" }}
          className="mr-2 ml-3 cursor-pointer"
          onClick={() => copyToClipboard(children)}
        />
        <CloseCircleOutlined
          onClick={handleCloseShow}
          style={{ fontSize: "21px", color: "#CF1322" }}
          className="cursor-pointer"
        />
      </div>

      <div
        className=" flex items-center mb-2.5 cursor-pointer"
        // onClick={handleOpenShow}
      >
        {" "}
        <span
          className={clsx(
            "w-[16px] h-[16px]  block rounded-[50%]",
            `bg-[${level}]`
          )}
          style={{ backgroundColor: `${level}` }}
        ></span>{" "}
        <p className="ml-3 text-LG-normal text-black w-[470px] text-left more underline">
          <a href={`${children}`} target="_blank">
            {children}
          </a>
        </p>{" "}
      </div>
    </main>
  );
}
