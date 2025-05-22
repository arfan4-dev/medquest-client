import React from "react";

const QuestionSummary = ({ questionSummary, totalScore, totalQuestions }) => {
  return (
    <div className="lg:col-span-2 mt-auto bg-white rounded-lg border border-[#E6E9EC] p-9">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-title-sm text-primary">Categories</h2>
        <h2 className="text-[13px] text-primary font-bold">
          Question Attempted
        </h2>
      </div>

      <div className="bg-white">
        <div className="grid">
          <div className="flex justify-between items-center border-b border-[#DEE2E6]">
            <div
              className="flex items-center justify-between w-full"
              style={{
                background: `linear-gradient(to right, #E1FFBA ${
                  (totalScore / totalQuestions) * 100
                }%, #FFE8E8 ${(totalScore / totalQuestions) * 100}%)`,
              }}
            >
              <div className="flex items-center w-1/2 px-4 py-3">
                <span className="text-[14px] text-primary">All</span>
              </div>

              <div className="flex justify-end w-1/2 px-4 py-3">
                <span className="text-white text-[10px] font-semibold bg-[#9C9C9C] px-2 py-1 rounded-md">
                  {`${totalScore || 0} / ${totalQuestions || 0}`}
                </span>
              </div>
            </div>
          </div>

          {/* Individual Category Rows */}
          {questionSummary &&
            Object.entries(questionSummary).map(
              ([subject, { total, correct }], index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-[#DEE2E6]"
                >
                  <div
                    className="flex items-center justify-between w-full"
                    style={{
                      background: `linear-gradient(to right, #E1FFBA ${
                        ((correct || 0) / (total || 1)) * 100
                      }%, #FFE8E8 ${((correct || 0) / (total || 1)) * 100}%)`,
                    }}
                  >
                    <div className="flex items-center w-1/2 px-4 py-3">
                      <span className="text-[14px] text-primary">
                        {subject}
                      </span>
                    </div>

                    <div className="flex justify-end w-1/2 px-4 py-3">
                      <span className="text-white text-[10px] font-semibold bg-[#9C9C9C] px-2 py-1 rounded-md">
                        {`${correct || 0} / ${total || 0}`}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSummary;
