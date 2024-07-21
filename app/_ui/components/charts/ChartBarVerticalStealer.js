import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    legend: {
      display: false,

      position: "top",
      align: "start",
      labels: {
        usePointStyle: true,
        boxHeight: 11,
        boxWidth: 25,
        font: {
          color: "#000000",
          size: "16px",
          lineHeight: "24px",
          weight: "500",
        },
      },
    },
    layout: {
      padding: {
        top: 20, // Adjust the top padding as needed
        bottom: 10, // Adjust the bottom padding as needed
      },
    },
    afterFit: function (chart, opt) {
      chart.plugins.register({
        afterFit: function () {
          this.height = this.height + 150;
        },
      });
    },
  },
};

export default function ChartBarVerticalStealer(props) {
  const { stealerData } = props;

  // console.log("stealer data: ", stealerData);

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Stealer",
        data: labels.map((month) => {
          return stealerData
            ? stealerData[month] === null
              ? 0
              : stealerData[month]["-"]
            : 0;
        }),
        backgroundColor: "#FAAD14",
        borderRadius: 5,
        barPercentage: 0.6,
      },
    ],
  };

  return (
    <>
      <Bar
        options={{ ...options, scales: { y: { min: 0 } } }}
        data={data}
        className="mt-12"
        width={"500px"}
        height={"200px"}
      />
    </>
  );
}
