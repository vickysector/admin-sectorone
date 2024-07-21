import Image from "next/image";

export default function OverviewCard({ image, total, descriptions }) {
  return (
    <>
      <div className="bg-white border-2 border-input-border rounded-lg py-4 px-8 flex items-center w-full [&:not(:last-child)]:mr-4 ">
        <Image alt="logo" src={image} width={36} height={36} />
        <div className="ml-6">
          <h1 className="text-black text-heading-3">{total}</h1>
          <p className="text-text-description text-LG-normal">{descriptions}</p>
        </div>
      </div>
    </>
  );
}
