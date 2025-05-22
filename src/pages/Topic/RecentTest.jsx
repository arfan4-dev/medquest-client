import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRecentQuiz,
  resumeQuiz,
} from "../../store/features/quiz/quiz.service";
import Skeleton from "../../components/Skeleton";
import { changeNewStatus } from "../../store/features/quiz/quiz.slice";
import QuizConfirmModal from "../../components/QuizConfirmModal";

const RecentTest = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);
  const dispatch = useDispatch();
  const {
    recentQuiz: quiz = [],
    isApiCalled = false,
    isLoading = false,
  } = useSelector((state) => state.quiz || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };



  useEffect(() => {
    const fetchRecentQuizes = async () => {
      await dispatch(getRecentQuiz());
    };

    if (quiz.length === 0 && !isApiCalled) {
      fetchRecentQuizes();
    }
  }, [dispatch]);

  const handleResumeQuiz = async (id, currentIndex, totalQuestions) => {
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
  };

  const handleButtonClick = (test) => {
    setSelectedQuiz(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <>
      {isLoading ? (
        <Skeleton variant="light" />
      ) : (
        <div
          className={`${
            quiz.length > 0 && "bg-white rounded-lg border border-[#CED4DA]"
          }`}
        >
          {quiz && quiz.length > 0 ? (
            quiz.slice(0, 5).map((test, index) => (
              <div key={index} className="border-b  border-[#CED4DA]">
                <div
                  className="text-[14px] text-primary font-semibold cursor-pointer p-4 flex justify-between"
                  onClick={() => toggleAccordion(index)}
                >
                  {test.quizId?.name}
                  {test.quizId?.isNew && (
                    <span className="bg-green-500 text-white text-[12px] py-[6px] px-2 rounded-md font-semibold">
                      NEW
                    </span>
                  )}
                </div>

                {openIndex === index && (
                  <div className="mt-2 p-4 border-t border-[#CED4DA]">
                    {test?.quizId?.topics.map((item, topicIndex) => (
                      <div
                        key={topicIndex}
                        className="text-[13px] text-secondary"
                      >
                        {item}
                      </div>
                    ))}
                    <div className="flex justify-between mt-2">
                      <div className="text-[12px] font-bold text-secondary ">
                        Created: {test?.quizId?.createdAt?.slice(0, 10) || ""}
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => handleButtonClick(test)}
                          className="bg-white text-[#007AFF] flex gap-2 items-center px-4 py-2 border border-[#007AFF] rounded-md"
                        >
                          <SlArrowRight className="text-[#007AFF]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm bg-transparent border-none text-[#6C6C6C]">
              Create quiz to get started
            </div>
          )}
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
    </>
  );
};

export default RecentTest;
