import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Label,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const PerformanceDistributionChart = ({ performanceData = {} }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const {
    mean = 0,
    standardDeviation = 0,
    userSuccessRate: userScore = 0,
  } = performanceData || {};

  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const userStatus = user?.userType?.plan === "FREE";
  const isPaidUser = user?.userType?.plan && !userStatus;

  const graphColors = {
    stroke: isPaidUser ? "#8884d8" : "#5E686D",
    fill: isPaidUser ? "#8884d8" : "#747474",
  };

  const generateNormalDistributionData = () => {
    const data = [];
    for (let z = -3.9; z <= 3.9; z += 0.1) {
      const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
      data.push({
        z: Number(z.toFixed(1)),
        y: Number((y * 100).toFixed(3)),
      });
    }
    return data;
  };

  const calculateZScore = (score, mean, stdDev) => {
    if (stdDev === 0) return 0;
    const rawZScore = (score - mean) / stdDev;
    return Number(Math.max(-3.9, Math.min(3.9, rawZScore)).toFixed(2));
  };

  const normalcdf = (z) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const prob =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) return 1 - prob;
    return prob;
  };

  const calculatePercentile = (score, mean, stdDev) => {
    if (stdDev === 0) {
      if (score === mean) return 50;
      return score > mean ? 100 : 0;
    }
    const z = (score - mean) / stdDev;
    return Number((100 * normalcdf(z)).toFixed(1));
  };

  const data = generateNormalDistributionData();
  const zScore = calculateZScore(userScore, mean, standardDeviation);
  const percentile = calculatePercentile(userScore, mean, standardDeviation);

  const handleMouseMove = (event) => {
    if (userStatus) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showNoDataOnGraph = isPaidUser && userScore === 0;
  const noDataMessage = "You haven't attempted any quizzes in this time frame";

  const getOrdinalSuffix = (num) => {
    const j = num % 10,
      k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };
  return (
    <div className="">
      <div
        className={`relative ${userStatus ? "cursor-not-allowed" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {userStatus && showTooltip && (
          <div
            className="fixed z-50 px-4 py-2 text-sm text-white bg-[#5E686D] rounded-lg shadow-lg pointer-events-none max-w-[200px] whitespace-normal"
            style={{
              left: Math.min(
                Math.max(tooltipPosition.x, 200),
                window.innerWidth - 200
              ),
              top: tooltipPosition.y - 40,
              transform: `translate(${
                tooltipPosition.x > window.innerWidth - 200 ? "-100%" : "-50%"
              }, 0)`,
            }}
          >
            <div className="relative">
              Feature is not available in free plan
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="border-t-8 border-b-0 border-solid border-t-gray-900 border-x-transparent border-x-8" />
              </div>
            </div>
          </div>
        )}

        <ResponsiveContainer
          width="100%"
          className="flex justify-center items-center w-full"
          height={windowWidth < 640 ? 270 : 345}
        >
          <AreaChart
            data={data}
            className="mx-auto"
            margin={{ top: 50, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="z" type="number" domain={[-4, 4]} tickCount={9}>
              <Label position="bottom" offset={10} />
            </XAxis>
            <YAxis width={30}></YAxis>
            <ReferenceLine
              x={0}
              stroke="grey"
              strokeDasharray="2 2"
            ></ReferenceLine>

            {isPaidUser && userScore > 0 && (
              <ReferenceLine
                x={zScore}
                stroke="red"
                strokeDasharray="3 3"
                strokeWidth={2}
              ></ReferenceLine>
            )}

            <Area
              type="basis"
              dataKey="y"
              stroke={graphColors.stroke}
              fill={graphColors.fill}
              fillOpacity={0.4}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {showNoDataOnGraph && (
          <div className="flex absolute inset-0 justify-center items-center">
            <div className="px-6 py-4 text-center bg-white bg-opacity-80 rounded-lg shadow-sm">
              <p className="font-bold text-[#343A40] text-base">
                {noDataMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {isPaidUser && userScore > 0 && (
        <div className="mt-4 text-center">
          <p className="text-[#343A40] font-semibold">
            Your score of {userScore.toFixed(1)}% places you in the{" "}
            <span className="text-blue-600">
              {percentile}
              <sup>{getOrdinalSuffix(percentile)}</sup>
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceDistributionChart;
