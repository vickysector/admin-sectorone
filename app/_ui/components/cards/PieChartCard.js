import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import ChartBarVertical from "@/app/_ui/components/charts/ChartBarVertical";
import Chunk from "@/app/_ui/components/compromised/chunk";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartCard({ compromisedData, datasets }) {
  const counts = datasets && datasets.map((data) => data.count);
  const labels = datasets && datasets.map((data) => data);

  let backgrounds = [
    "#1677FF",
    "#FFD591",
    "#69B1FF",
    "#95DE64",
    "#13C2C2",
    "#A0D911",
    "#597EF7",
    "#52C41A",
    "#FAAD14",
    "#FADb14",
  ];

  const data = {
    datasets: [
      {
        label: "",
        data: counts,
        backgroundColor: [
          "#1677FF",
          "#FFD591",
          "#69B1FF",
          "#95DE64",
          "#13C2C2",
          "#A0D911",
          "#597EF7",
          "#52C41A",
          "#FAAD14",
          "#FADb14",
        ],
        borderColor: [
          "white",
          "white",
          "white",
          "white",
          "white",
          "white",
          "white",
          "white",
          "white",
          "white",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="bg-white rounded-lg p-8 items-center flex flex-col text-center">
        <div className=" h-[300px]">
          {datasets ? <Doughnut data={data} /> : <p>Diagram Not Available</p>}
        </div>
        <div className="mt-8 self-start ">
          {labels ? (
            labels.map((data, index) => (
              <Chunk
                key={data.email_username ? data.email_username : data.url}
                level={backgrounds[index]}
              >
                {data.email_username ? data.email_username : data.url}
              </Chunk>
            ))
          ) : (
            <p className="text-center">No Data Available</p>
          )}
        </div>
      </div>
    </>
  );
}
