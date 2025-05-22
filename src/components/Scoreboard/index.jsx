const Scoreboard = ({ averageScore, scoreboard }) => {
  return (
    <div className="bg-white border border-[#7749F8] rounded-xl">
      <div className="text-[#575757] bg-[#F8F9FA] border-b border-[#DEE2E6] rounded-xl text-center py-4 text-title-p px-4 font-semibold">
        Score: {averageScore}﹪
      </div>
      <div className="overflow-y-auto max-h-[70vh]">
        <ul className="px-6 mx-auto mt-4 space-y-2 pb-7">
          {scoreboard && scoreboard.length > 0 ? (
            scoreboard.map((score) => (
              <li
                key={score?.questionId}
                className="flex items-center justify-center"
              >
                <span className="min-w-12">{score?.questionIndex}</span>
                <span>
                  {score?.score !== null ? (
                    score?.score === 1 ? (
                      <span>{"✔️"}</span>
                    ) : (
                      <span>{"❌"}</span>
                    )
                  ) : (
                    <span className="px-2">{"-"}</span>
                  )}
                </span>
              </li>
            ))
          ) : (
            <span className="py-4">Start the quiz</span>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Scoreboard;
