import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRecentQuiz, resumeQuiz } from "../store/features/quiz/quiz.service";
import Skeleton from "./Skeleton";
import { changeNewStatus } from "../store/features/quiz/quiz.slice";
import QuizConfirmModal from "./QuizConfirmModal";

const RecentTests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isQuizResumed, setQuizResumed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const {
    recentQuiz: quiz = [],
    isApiCalled = false,
    isLoading = false,
  } = useSelector((state) => state.quiz || {});

  useEffect(() => {
    const fetchRecentQuizes = async () => {
      await dispatch(getRecentQuiz());
    };
    if (quiz.length === 0 && !isApiCalled) {
      fetchRecentQuizes();
    }
  }, [dispatch]);

  const handleButtonClick = (test) => {
    setSelectedQuiz(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleResumeQuiz = async (id, currentIndex, totalQuestions) => {
    setQuizResumed(true);
    const res = await dispatch(resumeQuiz({ id }));
    if (res.type === "resumeQuiz/fulfilled") {
      localStorage.setItem(
        `quiz_${id}`,
        JSON.stringify({
          id,
          scoreboard: res.payload.scoreboard,
        })
      );

      const isEnd =
        totalQuestions === currentIndex ? currentIndex - 1 : currentIndex;
      Cookies.set("__START", res.payload.page);
      Cookies.set("__TO", isEnd);
      Cookies.set("__ALL", totalQuestions);

      await dispatch(changeNewStatus({ id }));

      navigate(`/question`, { state: { id } });
    }

    setQuizResumed(false);
  };
  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-primary">Recent Tests</h2>
      {isLoading ? (
        <Skeleton variant="light" />
      ) : quiz && quiz.length > 0 ? (
        <div className={`bg-white rounded-lg border border-[#CED4DA]`}>
          {quiz.slice(0, 5).map((test, index) => (
            <div key={index} className="border-b border-[#CED4DA]">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-sm font-semibold text-primary">
                  {test?.quizId?.name}
                </span>
                <div className="flex items-center gap-x-3">
                  {test?.quizId?.isNew && (
                    <span className="bg-green-500 me-2 text-white text-[12px] py-[6px] px-2 rounded-md font-semibold">
                      NEW
                    </span>
                  )}
                  <span className="bg-[#007AFF] text-white text-[12px] min-w-[45px] py-[6px] text-center rounded-md font-semibold">
                    {`${Number(test?.quizId?.resumeIndex)}/${
                      test?.quizId?.questionsCount
                    }`}
                  </span>
                  <span
                    className={`transform transition-transform ${
                      openIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <FaChevronUp size={16} className="text-black" />
                  </span>
                </div>
              </div>

              {openIndex === index && (
                <div className="mt- p-5 border-t border-[#CED4DA]">
                  {test?.quizId?.topics && (
                    <div className="flex justify-between">
                      <div className="flex flex-col justify-center gap-x-5">
                        {test?.quiz?.topics?.map((item) => (
                          <div className="text-[13px] text-secondary">
                            {item}
                          </div>
                        ))}
                        <div className="text-[12px] md:text-base font-bold text-secondary">
                          Created:
                          {test?.quizId?.createdAt?.slice(0, 10) || ""}
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => handleButtonClick(test)}
                          className="bg-white text-[#007AFF] text-sm md:text-base md:px-4 px-1 py-2 md:py-2 border border-[#007AFF] rounded-md flex items-center justify-center gap-3"
                        >
                          {test?.quizId?.resumeIndex !== 0
                            ? "Continue Quiz"
                            : "Start Quiz"}
                          <SlArrowRight className="text-[#007AFF]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-center bg-transparent text-[#6C6C6C]">
          Create quiz to get started
        </div>
      )}

      <QuizConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={() =>
          handleResumeQuiz(
            selectedQuiz?.quizId?._id || "",
            selectedQuiz?.quizId?.resumeIndex || 0,
            selectedQuiz?.quizId?.questionsCount
          )
        }
        resumeIndex={selectedQuiz?.quizId?.resumeIndex || 0}
      />
    </div>
  );
};

export default RecentTests;
