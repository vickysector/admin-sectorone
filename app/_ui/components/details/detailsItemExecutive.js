import { useEffect, useState } from "react";

export function DetailItemsExecutive({ items }) {
  const allData = Object.keys(items);

  return (
    <>
      <div>
        {/* <h2 className="text-black text-heading-4">{items.title}</h2> */}

        <section className="grid grid-cols-3 mt-6">
          {allData.map((data) => (
            <div key={data}>
              <h3 className="text-LG-strong text-black">{data}</h3>
              <p className="text-LG-normal text-text-description mt-1 break-words pr-6">
                {items[data]}
              </p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
