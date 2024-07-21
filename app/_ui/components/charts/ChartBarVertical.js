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
import {
  TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_EMPLOYEE,
  TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_USER,
} from "@/app/_lib/variables/Variables";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartBarVertical(props) {
  const { employeeData, usersData, minValue = 0, status } = props;

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
        label: "Employees",
        data: labels.map((month) => {
          return employeeData
            ? employeeData[month] === undefined
              ? 0
              : employeeData[month]
            : 0;
        }),
        backgroundColor: "#FAAD14",
        borderRadius: 5,
        hidden: status === TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_USER,
      },
      {
        label: "Users",
        data: labels.map((month) =>
          usersData
            ? usersData[month] !== undefined
              ? usersData[month]
              : 0
            : 0
        ),
        backgroundColor: "#1677FF",
        borderRadius: 5,
        hidden: status === TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_EMPLOYEE,
      },
    ],
  };

  return (
    <div className="w-full text-center">
      <div className="absolute top-[32px] left-[32px] flex items-center">
        {" "}
        <span className="w-[16px] h-[16px] bg-orange-chart block rounded-[50%]"></span>{" "}
        <p className="ml-3 text-LG-normal text-black">Employee</p>{" "}
      </div>
      <div className="absolute top-[32px] left-[150px] flex items-center">
        {" "}
        <span className="w-[16px] h-[16px] bg-blue-chart block rounded-[50%]"></span>{" "}
        <p className="ml-3 text-LG-normal text-black">Users</p>{" "}
      </div>
      <Bar
        options={{
          ...options,
          scales: { y: { min: minValue } },
          maintainAspectRatio: true,
        }}
        data={data}
        className="mt-12"
        width={"500px"}
        height={"200px"}
      />
    </div>
  );
}
