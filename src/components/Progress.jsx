import React, { useEffect, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import GaugeChart from "../components/charts/GaugeChart";
import { userPerformance } from "../store/features/quiz/quiz.service";
import BellCurveGraph from "./charts/BellCurveGraph";
import { formatYear } from "../utils/formatYear";
const Progress = () => {
  const dispatch = useDispatch();
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const quizSuccessRate =
    (
      (user?.performance?.correctAnswers / user?.performance?.totalQuestions ||
        0) * 100
    ).toFixed(1) || "0.0";

  const userType = user?.userType?.plan === "FREE";

  const { performance = {} } = useSelector((state) => state?.quiz || {});
  const options = [
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "thisYear", label: "This Year" },
    ...(user?.userType?.plan === "PRO"
      ? [{ value: "school", label: "School" }]
      : []),
  ];

  const getPerformanceByKey = (key) => {
    return performance[key] || null;
  };
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getPerformance = async () => {
      if (
        user?.year &&
        Object.keys(performance).length === 0 &&
        user?.userType?.plan !== "FREE"
      ) {
        await dispatch(
          userPerformance({
            year: user?.year || "",
          })
        );
      }
    };

    if (!userType) {
      getPerformance();
    }
  }, [user?.year]);

  const handleOptionClick = (option) => {
    if (option.value !== selectedOption.value) {
      setSelectedOption(option);
    }
    setIsOpen(false);
  };

  const performanceData = getPerformanceByKey(selectedOption.value);
  return (
    <>
      <h2 className="mt-10 mb-6 text-2xl font-semibold text-primary">
        Progress
      </h2>

      <div className="p-5 bg-white rounded-xl mb-30">
        <div
          className="relative flex justify-end lg:pr-3"
          title={
            user?.userType?.plan !== "FREE"
              ? "Performance based on the quiz results over the selected time frame."
              : undefined
          }
        >
          <button
            onClick={() => {
              if (userType) return;
              setIsOpen(!isOpen);
            }}
            className={`bg-white border flex  font-semibold text-[12px] px-4 items-center gap-2 py-2 rounded-md ${
              userType
                ? "border-[#747474] text-[#5D5D5D]"
                : "border-[#007AFF] text-[#007AFF]"
            }`}
          >
            {selectedOption.label}
            <GoChevronDown
              size={20}
              className={`${userType ? "text-[#5D5D5D]" : "text-[#007AFF]"}`}
            />
          </button>

          {isOpen && (
            <div className="absolute mt-11   bg-white border border-[#E4E6EF] rounded-md shadow-lg lg:w-[10%] z-40">
              {options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-2 text-[12px] font-medium ${
                    option.disabled
                      ? "text-[#007AFF] bg-[#5E686D]  cursor-not-allowed"
                      : "text-[#007AFF] hover:bg-[#F3F6F9] cursor-pointer"
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid justify-center grid-cols-1 gap-6 mt-10 xl:grid-cols-2">
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-1">
            <div className="text-center">
              <h3 className="text-[#343A40] text-title-sm font-semibold">
                Performance
              </h3>
              {quizSuccessRate !== null && (
                <GaugeChart series={[quizSuccessRate?.toString() || ""]} />
              )}
            </div>
          </div>

          <div className="lg:w-full">
            <h3 className="font-semibold text-center  text-[#343A40] text-title-sm">
              Performance compared to {formatYear(user?.year || "") || ""}{" "}
              students
            </h3>

            <>
              <BellCurveGraph performanceData={performanceData} />
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Progress;
