/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        "auth-screen": "calc(100vh - 58px)",
      },
      colors: {
        "primary-200": "#FFF8F1",
        "primary-base": "#FF6F1E",
        "input-border": "#D5D5D5",
        "input-container": "#F7F7F7",
        "text-description": "#676767",
        "text-disabled": "#00000040",
        "text-color": "#000000E0",
        "orange-chart": "#FAAD14",
        "blue-chart": "#1677FF",
        "orange-3-chart": "#FFD591",
        "blue-4-chart": "#69B1FF",
        "green-4-chart": "#95DE64",
        "cyan-6-chart": "#13C2C2",
        "lime-6-chart": "#A0D911",
        "geekblue-5-chart": "#597EF7",
        "success-chart": "#52C41A",
        "gold-chart": "#FAAD14",
        "gold-2-chart": "#FADb14",
        "blue-export": "#2F54EB",
        pink: "#EB2F96",
        "text-orange": "#FA8C16",
        "text-green": "#52C41A",
        success: "#389E0D",
        error: "#CF1322",
      },
      fontSize: {
        "heading-1": [
          //styleName: Heading/Heading 1;

          "38px",
          {
            //styleName: Heading/Heading 1;
            lineHeight: "46px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "heading-2": [
          "30px",
          {
            lineHeight: "38px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "heading-3": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "heading-4": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "heading-5": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "LG-normal": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
            letterSpacing: "1px",
          },
        ],

        "LG-strong": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "SM-normal": [
          "12px",
          {
            lineHeight: "20px",
            fontWeight: "400",
            letterSpacing: "1px",
          },
        ],
        "SM-strong": [
          "12px",
          {
            lineHeight: "20px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
        "XL-strong": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],

        "Base-normal": [
          "14px",
          {
            lineHeight: "22px",
            fontWeight: "400",
            letterSpacing: "1px",
          },
        ],
        "Base-strong": [
          "14px",
          {
            lineHeight: "22px",
            fontWeight: "600",
            letterSpacing: "1px",
          },
        ],
      },
    },
  },
  plugins: [],
};
