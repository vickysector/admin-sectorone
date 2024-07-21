import { Spin, ConfigProvider } from "antd";

export function LoadingSpin() {
  return (
    <div className="z-10 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-full h-full flex items-center justify-center opacity-50 ">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#FF6F1E",
          },
        }}
      >
        <Spin size="large" />
      </ConfigProvider>
    </div>
  );
}
