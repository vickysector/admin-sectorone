import clsx from "clsx";

export default function ChangeUrlButton({ children, disabled, onClick }) {
  return (
    <button
      className={clsx(
        "py-1 px-3 bg-primary-base  rounded-lg text-LG-normal text-white  ",
        !disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer opacity-100"
      )}
      disabled={!disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
