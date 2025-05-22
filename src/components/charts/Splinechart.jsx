import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
const SplineChart = ({ heading, series, colors, categories }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "area",
      height: 350,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: {
        formatter: (val) => val,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
  });
  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      colors: colors,
      xaxis: {
        ...prevOptions.xaxis,
        categories: categories,
      },
    }));
  }, [colors, categories]);
  return (
    <div className="">
      <h2 className="px-5 py-4 text-xs font-bold text-black md:text-base bg-whitest">
        {heading}
      </h2>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="area"
        height={350}
        className="p-4"
      />
    </div>
  );
};

export default SplineChart;
