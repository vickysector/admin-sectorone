import clsx from "clsx";

export function ProgressBar({ data }) {
  const {
    strength_1,
    strength_2,
    strength_3,
    strength_4,
    strength_5,
    passwordRequirement,
  } = data;

  return (
    <>
      <div
        className={clsx(
          "w-full flex items-center justify-between mt-3",
          passwordRequirement ? "block" : "hidden"
        )}
      >
        <div className="w-[85%] h-3 bg-[#0000000F] rounded-lg">
          <div
            className={clsx(
              " h-3 rounded-lg ",
              strength_1 && "w-[20%] bg-red-500",
              strength_2 && "w-[40%] bg-red-300",
              strength_3 && "w-[60%] bg-orange-400",
              strength_4 && "w-[80%] bg-blue-600",
              strength_5 && "w-[100%] bg-success"
            )}
          ></div>
        </div>
        <p
          className={clsx(
            strength_1 && " text-red-500",
            strength_2 && " text-red-300",
            strength_3 && " text-orange-400",
            strength_4 && " text-blue-600",
            strength_5 && " text-success"
          )}
        >
          {strength_1 && "Bad"}
          {strength_2 && "Weak"}
          {strength_3 && "Medium"}
          {strength_4 && "Good"}
          {strength_5 && "Strong"}
        </p>
      </div>
    </>
  );
}
