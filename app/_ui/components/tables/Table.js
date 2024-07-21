import { Pagination, ConfigProvider } from "antd";
import clsx from "clsx";

export function Table({ dataSource, columnSource }) {
  const dataColumn = columnSource.map((data) => {
    let keys = Object.keys(data);

    return (
      <td
        className="py-[19px] px-[16px] [&:not(:last-child)]:border-r-[1px] border-input-border border-dashed"
        key={data.id}
      >
        {data[keys[1]]}
      </td>
    );
  });

  return (
    <>
      <table className="bg-white  w-full rounded-xl">
        <thead className="text-black text-Base-strong bg-[#00000005]">
          <tr className="border-b-[1px] border-[#D5D5D5]">
            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed ">
              No
            </td>

            {/* dataColumn is here */}
            {dataColumn}
          </tr>
        </thead>
        <tbody className="text-Base-normal text-text-description">
          {/* TODO */}
          {dataSource.map((data, index) => (
            <tr className="border-b-[2px] border-[#D5D5D5]" key={data.id}>
              <td className="py-[19px] px-[16px]"> {index + 1} </td>
              <td className="py-[19px] px-[16px]"> {data.date} </td>
              <td className="py-[19px] px-[16px]"> {data.url} </td>
              <td className="py-[19px] px-[16px]"> {data.login} </td>
              <td className="py-[19px] px-[16px]"> {data.pass} </td>
              <td className="py-[19px] px-[16px]">
                {" "}
                <p
                  className={clsx(
                    data.strength.toLowerCase() === "weak" && "text-pink",
                    data.strength.toLowerCase() === "medium" &&
                      "text-text-orange",
                    data.strength.toLowerCase() === "strong" &&
                      "text-text-green"
                  )}
                >
                  {data.strength}
                </p>{" "}
              </td>
              <td className="py-[19px] px-[16px]"> {data.action} </td>
            </tr>
          ))}
          {/* Make above data is dynamic so achieve reusable components */}
        </tbody>
      </table>
      <div className="flex items-center justify-between my-[19px] mx-[16px]">
        <p className="text-Base-normal text-[#676767] ">
          Showing 10 to 100 entries
        </p>
        <div>
          <ConfigProvider
            theme={{
              components: {
                Pagination: {
                  itemActiveBg: "#FF6F1E",
                  itemLinkBg: "#fff",
                  itemInputBg: "#fff",
                },
              },
              token: {
                colorPrimary: "white",
              },
            }}
          >
            <Pagination
              type="primary"
              defaultCurrent={1}
              total={50}
              showSizeChanger={false}
              style={{ color: "#FF6F1E" }}
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}
