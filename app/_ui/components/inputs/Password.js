import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import clsx from "clsx";

export default function Password({
  showPassword,
  value,
  toggleShowIcon,
  isPasswordFocused,
  passwordRequirement,
  onBlur,
  onFocus,
  onChange,
  hasTooltip,
  passwordMatchError,
  placeholder,
  max,
  errorState,
}) {
  return (
    <>
      <input
        type={showPassword ? "text" : "password"}
        className={clsx(
          " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal",

          !passwordMatchError && "border-input-border",
          passwordMatchError && value.length !== 0
            ? "border-error outline-error"
            : "border-input-border",
          errorState ? "border-error outline-error" : "border-input-border"
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={max}
        required
      />
      {hasTooltip && (
        <span
          className={clsx(
            " z-10  bg-white absolute top-[100%] left-0 shadow-lg w-[60%] p-3 rounded-md",
            isPasswordFocused ? "block" : "hidden",
            !passwordRequirement ? "block" : "hidden"
          )}
        >
          <h1 className="text-Base-strong text-black mb-2.5">
            Password requirements
          </h1>
          <p className="text-Base-normal text-black">
            Password must have 8 character or longer, At least one number, one
            symbol (like !@#$%^) and one Capital Letter
          </p>
        </span>
      )}
      <EyeOutlined
        className={clsx(
          "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
          !showPassword ? "hidden" : "block"
        )}
        style={{ color: "#00000040" }}
        onClick={toggleShowIcon}
      />
      <EyeInvisibleOutlined
        className={clsx(
          "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
          showPassword ? "hidden" : "block"
        )}
        style={{ color: "#00000040" }}
        onClick={toggleShowIcon}
      />
    </>
  );
}
