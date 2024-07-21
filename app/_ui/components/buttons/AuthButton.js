import clsx from "clsx";

export function AuthButton({ agreements, value, onClick }) {
  return (
    <button
      type="submit"
      className={clsx(
        " w-full  py-1.5 px-3  rounded-lg text-Base-normal ",
        !agreements
          ? "cursor-not-allowed bg-input-container border-input-border border-2 text-text-disabled"
          : "cursor-pointer bg-primary-base border-2 border-primary-base text-white"
      )}
      disabled={!agreements}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
