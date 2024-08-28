import clsx from "clsx";

export function DomainBreaches({ dataBreaches, text }) {
  return (
    <>
      <div
        className={clsx(
          "p-4 rounded-[16px] border-[1px] border-[#D5D5D5] bg-white w-auto"
        )}
      >
        <h1 className={clsx("text-black text-heading-1")}> {dataBreaches} </h1>
        <p className={clsx("text-[#676767] text-LG-normal")}>{text}</p>
      </div>
    </>
  );
}
