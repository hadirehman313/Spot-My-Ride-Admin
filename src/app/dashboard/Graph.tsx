"use client";

import React from "react";
import { Chart } from "react-google-charts";

const Graph = () => {
  const data = [
    ["Day", "Users", { role: "style" }],
    ["Monday", 8, "#00A085"],
    ["Tuesday", 6, "#00A085"],
    ["Wednesday", 4, "#00A085"],
    ["Thursday", 5, "#00A085"],
    ["Friday", 6, "#00A085"],
    ["Saturday", 4, "#00A085"],
    ["Sunday", 8, "#00A085"],
  ];

  const vehiclesData = [
    ["Day", "Vehicles", { role: "style" }],
    ["Monday", 7, "#00A085"],
    ["Tuesday", 5, "#00A085"],
    ["Wednesday", 3, "#00A085"],
    ["Thursday", 4, "#00A085"],
    ["Friday", 5, "#00A085"],
    ["Saturday", 3, "#00A085"],
    ["Sunday", 8, "#00A085"],
  ];

  const options = {
    legend: "none",
    vAxis: {
      gridlines: { color: "#f1f1f1" },
      minValue: 0,
    },
    hAxis: {
      textStyle: { fontSize: 12 },
    },
    chartArea: { width: "80%", height: "70%" },
  };

  return (
    <div className="px-4 py-6 bg-[#F8F9FA] min-h-screen">
      <h1 className="font-semibold text-xl mb-6">See your Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <div className="bg-white shadow rounded-md p-6 border-t-4 border-[#00A085]">
          <h2 className="text-lg font-semibold mb-1">Daily Active Users</h2>
          <p className="text-sm text-gray-500 mb-4">
            Tracks daily app usage over the past 7 days.
          </p>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="300px"
            data={data}
            options={options}
          />
        </div>

        {/* Vehicles Saved */}
        <div className="bg-white shadow rounded-md p-6 border-t-4 border-[#00A085]">
          <h2 className="text-lg font-semibold mb-1">Vehicles Saved</h2>
          <p className="text-sm text-gray-500 mb-4">
            Shows the number of vehicle locations saved per day.
          </p>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="300px"
            data={vehiclesData}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default Graph;
