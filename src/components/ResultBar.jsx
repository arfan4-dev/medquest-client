const ResultsBar = ({ score }) => {
  const greenWidth = score;
  const redWidth = 100 - score;

  return (
    <div className="p-6 mx-auto mt-8 mb-4 bg-white shadow-md rounded-xl">
      {/* Results Text */}
      <div className="text-[15px] font-medium mb-4">Results</div>
      <p className="text-center mx-auto text-[14px] mb-6 lg:max-w-lg">
        Your average score is<span className="font-bold"> {score}%</span>
      </p>

      <div className="flex w-full h-4 bg-gray-300 rounded-full">
        <div
          className={`h-4 bg-[#009D41] rounded-l-full ${
            score === "100" || (score === 100 && "border-r-full")
          }`}
          style={{ width: `${greenWidth}%` }}
        ></div>
        <div
          className={`h-4 bg-red-500 rounded-r-full ${
            score === 0 || (score === "0" && "border-l-full")
          }`}
          style={{ width: `${redWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ResultsBar;
