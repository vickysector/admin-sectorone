import clsx from "clsx";

export default function CompromiseButton({
  value,
  total,
  isActive,
  onClick,
  nameData,
}) {
  return (
    <button
      className={clsx(
        " rounded-lg py-2 px-4 [&:not(:first-child)]:ml-4",
        isActive
          ? "bg-primary-base text-LG-strong text-white"
          : "bg-white border-2 border-input-borde text-text-description text-LG-normal"
      )}
      onClick={onClick}
      name={nameData}
    >
      {value}
    </button>
  );
}
