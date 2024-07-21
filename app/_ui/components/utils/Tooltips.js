import clsx from "clsx";
import { getCookie } from "cookies-next";

export function Tooltip({ isActive, top, left, right, bottom }) {
  return (
    <div
      className={clsx(
        isActive && getCookie("user_status") === "true" ? "visible" : "hidden",
        "relative"
      )}
    >
      <div
        className="absolute  py-1.5 px-2.5 rounded-[6px] bg-[#000000E0] w-[304px] "
        style={{
          top: `${top}`,
          left: `${left}`,
          right: `${right}`,
          bottom: `${bottom}`,
        }}
      >
        <p className="text-[#FFFFFF] text-Base-normal">
          You are in free access mode, Some features are not available for this
          mode. Upgrade to use all features.
        </p>
      </div>
    </div>
  );
}
