import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Suggestions from "./Suggestions";

import { SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosWithToken } from "../api";
import { useModal } from "../context/modal";
import decryptQuestionData from "../helpers/decrypt.helpers";
import { updatePerformance } from "../store/features/auth/auth.slice";
import { resetComments } from "../store/features/discussion/discussion.slice";
import { getRemainingTime } from "../store/features/quiz/quiz.service";
import {
  filterCompletedQuiz,
  incrementResumeIndex,
} from "../store/features/quiz/quiz.slice";
import calculatePageNumber from "../utils/calculatePage";
import Button from "./Button";
import Loader from "./Loader";
import Modal from "./modal";
import WarningModal from "./modal/WarningModal";
import Scoreboard from "./Scoreboard";
import Timer from "./Timer";
import { removeOptionPrefix } from "../utils/remove-prefix";

const QuestionTemplate = () => {
  const location = useLocation();
  const { id } = location.state;
  const [fetchedPages, setFetchedPages] = useState(new Set());
  const TOTAL_QUESTIONS = Number(Cookies.get("__ALL"));
  const [isAnswerSubmit, setAnswerSubmit] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const [showImproveSection, setShowImproveSection] = useState(false);

  const updateLocalStorage = (updatedScoreboard) => {
    localStorage.setItem(
      `quiz_${id}`,
      JSON.stringify({
        id,
        scoreboard: updatedScoreboard,
      })
    );
  };
  const [questions, setQuestions] = useState([]);
  const [quizDetail, setQuizDetail] = useState({
    totalQuestions: 0,
    score: 0,
    mode: "",
    isSubmit: false,
    currentQuestionIndex: Number(Cookies.get("__TO")),
    totalAnswers: 0,
  });

  const calculateScore = (quizDetail?.score / quizDetail?.totalQuestions) * 100;
  const [isLoading, setLoading] = useState(false);
  const {
    openModal,
    closeModal,
    setLoading: setQuizEndLoading,
    isLoading: isQuizEndLoading,
  } = useModal();

  const openConfirmationModal = () => {
    openModal(
      <WarningModal
        closeModal={closeModal}
        isLoading={isQuizEndLoading}
        onClick={handleEndQuiz}
      />
    );
  };
  const question = questions[quizDetail?.currentQuestionIndex];

  const [scoreboard, setScoreboard] = useState([]);

  const [isSubmitLoading, setSubmitLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [page, setPage] = useState(Number(Cookies.get("__START")));
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleNext = () => {
    dispatch(resetComments());
    setSelectedOptions([]);
    setError("");
    setShowImproveSection(false);
    setSuggestionText("");

    const nextIndex = quizDetail.currentQuestionIndex + 1;

    const isCloseToEnd = !questions[nextIndex + 3];

    if (nextIndex < quizDetail.totalQuestions) {
      setQuizDetail((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));

      if (isCloseToEnd && nextIndex + 3 < quizDetail.totalQuestions) {
        setPage((prev) => prev + 1);
      }
    }
    const updatedScoreboard = [...scoreboard];
    if (!updatedScoreboard.find((q) => q.questionIndex === nextIndex + 1)) {
      updatedScoreboard.push({
        questionId: questions[nextIndex].questionId,
        score: null,
        questionIndex: nextIndex + 1,
      });
      setScoreboard(updatedScoreboard);
      updateLocalStorage(updatedScoreboard);
    }
  };

  const handlePrev = () => {
    setSelectedOptions([]);
    setError("");
    setShowImproveSection(false);
    setSuggestionText("");
    dispatch(resetComments());

    const prevIndex = quizDetail.currentQuestionIndex - 1;

    const isCloseToEnd = !questions[prevIndex - 3];

    if (prevIndex < quizDetail.totalQuestions) {
      setQuizDetail((prev) => ({
        ...prev,
        currentQuestionIndex: prevIndex,
      }));

      if (isCloseToEnd && prevIndex - 3 > 0) {
        setPage((prev) => prev - 1);
      }
    }
  };

  const submitAnswer = async (e, questionId, selectedOptions) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      setError("Please select at least one option");
      return;
    }

    const currentQuestion = questions
      .filter((q) => q !== null)
      .find((q) => q.questionId === questionId);
    if (!currentQuestion) return;

    const isCorrect =
      selectedOptions.length === currentQuestion.correct_answer.length &&
      selectedOptions.every((option) =>
        currentQuestion.correct_answer.includes(option)
      );

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (!question) return question;

        if (question.questionId === questionId) {
          return {
            ...question,
            hasAnswered: false,
            userAttempt: selectedOptions,
            isCorrect,
          };
        }
        return question;
      })
    );
    const score = isCorrect ? 1 : 0;

    const updatedIndex =
      quizDetail.currentQuestionIndex < quizDetail.totalQuestions
        ? quizDetail.currentQuestionIndex + 1
        : quizDetail.currentQuestionIndex;

    const page = calculatePageNumber(
      updatedIndex,
      10,
      TOTAL_QUESTIONS === updatedIndex
    );
    Cookies.set("__TO", updatedIndex);
    Cookies.set("__START", page);

    try {
      setAnswerSubmit(true);
      const response = await axiosWithToken.post("/quiz/submit-answer", {
        quizId: id,
        questionId,
        selectedOptions,
        score,
        currentIndex: updatedIndex,
        page,
        isCorrect,
      });

      if (response.status === 200) {
        const updatedScoreboard = scoreboard.map((entry) =>
          entry.questionId === questionId ? { ...entry, score } : entry
        );

        setScoreboard(updatedScoreboard);
        updateLocalStorage(updatedScoreboard);

        const updatedScore = quizDetail.score + score;

        setQuizDetail((prev) => ({
          ...prev,
          score: updatedScore,
          totalAnswers: prev.totalAnswers + 1,
        }));

        dispatch(updatePerformance({ isCorrect }));
        dispatch(incrementResumeIndex({ id, resumeIndex: updatedIndex }));
      }

      setAnswerSubmit(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setAnswerSubmit(false);
    }
  };

  useEffect(() => {
    if (fetchedPages.has(page)) {
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      const res = await axiosWithToken.get(`/quiz/get-quiz-questions/${id}`, {
        params: {
          page,
        },
      });

      const {
        questions: quizQuestions,
        totalQuestions,
        score,
        mode,
        totalAnswers,
      } = res.data.data;

      const decryptedQuestions = quizQuestions.map((question) => {
        return decryptQuestionData(question, import.meta.env.VITE_SECRET_KEY);
      });

      const startIndex = (page - 1) * 10;
      let newQuestions = [...questions];

      if (newQuestions.length === 0 && page > 0) {
        newQuestions = Array(startIndex).fill(null);
      }

      decryptedQuestions.forEach((question, index) => {
        newQuestions[startIndex + index] = question;
      });

      setQuestions(newQuestions);
      setQuizDetail((prev) => ({
        ...prev,
        totalQuestions: totalQuestions,
        score: score,
        mode: mode,
        currentQuestionIndex: prev.currentQuestionIndex,
        totalAnswers: totalAnswers,
      }));
      setLoading(false);

      setFetchedPages((prev) => new Set([...prev, page]));

      const savedData = localStorage.getItem(`quiz_${id}`);
      let initialScoreboard = savedData ? JSON.parse(savedData).scoreboard : [];

      const currentQuestionIndex = quizDetail.currentQuestionIndex;
      const currentQuestionId = newQuestions[currentQuestionIndex]?.questionId;

      const isCurrentQuestionInScoreboard = initialScoreboard.some(
        (entry) => entry.questionId === currentQuestionId
      );

      if (!isCurrentQuestionInScoreboard) {
        const newEntry = {
          score: null,
          questionId: currentQuestionId,
          questionIndex: currentQuestionIndex + 1,
        };
        initialScoreboard.push(newEntry);
      }

      setScoreboard(initialScoreboard);
      updateLocalStorage(initialScoreboard);
    };
    fetchQuestions();
  }, [page, id]);

  const handleEndQuiz = async () => {
    try {
      setQuizEndLoading(true);
      await axiosWithToken.post("/quiz/end", {
        id,
        scoreboard,
      });

      closeModal();
      localStorage.removeItem(`quiz_${id}`);
      Cookies.remove("__START");
      Cookies.remove("__TO");
      Cookies.remove("__ALL");

      setQuizEndLoading(false);
      navigate("/home");
    } catch (error) {
      console.log("Error", error);
    } finally {
      setQuizEndLoading(false);
    }
  };

  const handleOptionChange = (index) => {
    const optionValue = String.fromCharCode(65 + index);
    if (selectedOptions.includes(optionValue)) {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== optionValue)
      );
    } else {
      setSelectedOptions([...selectedOptions, optionValue]);
    }
  };

  const handleQuizSubmit = async () => {
    setSubmitLoading(true);

    try {
      const res = await axiosWithToken.get(`/quiz/results/${id}`);

      const summaryData = {
        summary: res.data.data.summary,
        id,
        TOTAL_QUESTIONS,
        name: res.data.data.name,
        averageScore: res.data.data.averageScore,
        score: res.data.data.score,
      };
      // ✅ Google Analytics event for quiz completion

      window.gtag &&
        window.gtag("event", "quiz_completed", {
          user_id: user._id, // Make sure this exists, or use Redux/cookie
          quiz_id: id,
          total_questions: TOTAL_QUESTIONS,
          score: res.data.data.score,
          average_score: res.data.data.averageScore,
          mode: res.data.data.summary?.mode || "unknown",
        });

      dispatch(filterCompletedQuiz({ id }));
      Cookies.remove("__START");
      Cookies.remove("__TO");
      Cookies.remove("__ALL");
      setSubmitLoading(false);
      navigate("/summary", { state: summaryData });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const scoreboard = JSON.parse(localStorage.getItem(`quiz_${id}`));
      const scoreboardData = scoreboard.scoreboard;
      const data = JSON.stringify({ id, scoreboard: scoreboardData });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(`${import.meta.env.VITE_API_URL}/quiz/end`, blob);

      const isLoggingOut = localStorage.getItem("isLoggingOut");
      if (isLoggingOut) {
        localStorage.removeItem("isLoggingOut");
        return;
      }
      const message = "Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    const saveScoreboard = () => {
      const scoreboard = JSON.parse(localStorage.getItem(`quiz_${id}`));
      if (scoreboard) {
        const scoreboardData = scoreboard.scoreboard;
        const data = JSON.stringify({ id, scoreboard: scoreboardData });
        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon(`${import.meta.env.VITE_API_URL}/quiz/end`, blob);
      }
    };
    return () => {
      saveScoreboard();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNextButton = () => {
    setSelectedOptions([]);
    setError("");
    setSuggestionText("");
    setShowImproveSection(false);

    const updatedIndex =
      quizDetail.currentQuestionIndex < quizDetail.totalQuestions
        ? quizDetail.currentQuestionIndex + 1
        : quizDetail.currentQuestionIndex;

    const isCloseToEnd = !questions[updatedIndex + 3];

    if (updatedIndex < quizDetail.totalQuestions) {
      setQuizDetail((prev) => ({
        ...prev,
        currentQuestionIndex: updatedIndex,
      }));

      if (isCloseToEnd && updatedIndex + 3 < quizDetail.totalQuestions) {
        setPage((prev) => prev + 1);
      }
    }

    setQuizDetail((prev) => ({
      ...prev,
      currentQuestionIndex: updatedIndex,
    }));
    const nextQuestionIndex = updatedIndex;

    if (nextQuestionIndex < quizDetail.totalQuestions) {
      const nextQuestionId = questions[nextQuestionIndex]?.questionId || null;

      if (scoreboard.find((q) => q.questionId === nextQuestionId)) {
        return;
      }

      const updatedScoreboard = JSON.parse(localStorage.getItem(`quiz_${id}`));

      const appendedScoreboard = [
        ...updatedScoreboard.scoreboard,
        {
          score: null,
          questionId: nextQuestionId,
          questionIndex: nextQuestionIndex + 1,
        },
      ];
      dispatch(resetComments());

      setScoreboard(appendedScoreboard);
      updateLocalStorage(appendedScoreboard);
    }
  };

  useEffect(() => {
    const fetchRemainingTime = async () => {
      if (quizDetail?.mode === "Timed") {
        const res = await dispatch(getRemainingTime({ id }));
        if (res.type === "getRemainingTime/fulfilled") {
          setRemainingTime(res.payload.remainingTime);
        }
      }
    };

    fetchRemainingTime();
  }, [dispatch, id, quizDetail?.mode]);

  return (
    <>
      {questions && questions.length > 0 ? (
        <div className="bg-[#ECEFF7] min-h-screen select-none">
          <div className="flex justify-between items-center px-4 py-4 m-auto text-center bg-white shadow lg:px-7">
            <p className="text-title-sm font-semibold text-[#3A57E8]">
              MEDQUEST
            </p>
            <p
              onClick={openConfirmationModal}
              className="text-title-p cursor-pointer font-semibold text-[#FF3B30]"
            >
              End Quiz
            </p>
          </div>
          <div className="container px-4 py-8 pb-40 mx-auto max-w-screen-xl">
            <div className="flex flex-wrap gap-5 justify-between items-start lg:justify-center lg:gap-x-20 lg:flex-nowrap">
              <div className="lg:w-[12%] w-fit">
                <Scoreboard
                  averageScore={
                    !calculateScore ? 0 : calculateScore?.toFixed(2)
                  }
                  scoreboard={scoreboard}
                />
              </div>

              {quizDetail?.mode === "Timed" && (
                <div className="lg:w-[12%] lg:hidden block w-fit bg-white border border-[#7749F8] rounded-xl self-start">
                  <Timer id={id} remainingTime={remainingTime} />
                </div>
              )}

              {questions && questions.length > 0 && (
                <div className="lg:w-[70%] w-full max-w-3xl bg-white shadow-md md:p-8 px-4 py-8 rounded-md">
                  <div className="flex justify-between mb-10">
                    <Button
                      text="Prev"
                      type="button"
                      leftIcon={MdOutlineKeyboardArrowLeft}
                      leftIconStyle="text-[#ADB5BD] text-[25px]"
                      onClick={handlePrev}
                      disabled={
                        quizDetail.currentQuestionIndex === 0 || isLoading
                      }
                      className="bg-white border select-none border-[#E9ECEF] text-secondary rounded-[4px] flex items-center py-2 px-2 md:px-4 hover:bg-gray-100 focus:outline-none hover:shadow-md"
                    />

                    <span className="bg-[#3A57E8] lg:text-title-p text-nowrap text-[14px] rounded-[4px] text-white font-normal py-2 px-4 flex items-center justify-center">
                      {quizDetail.currentQuestionIndex + 1} of&nbsp;
                      {TOTAL_QUESTIONS}
                    </span>

                    <Button
                      text="Next"
                      type="button"
                      rightIcon={MdOutlineKeyboardArrowRight}
                      rightIconStyle="text-[#ADB5BD] text-[25px]"
                      onClick={handleNext}
                      disabled={
                        quizDetail.currentQuestionIndex + 1 ===
                          quizDetail.totalQuestions ||
                        isLoading ||
                        isAnswerSubmit
                      }
                      className="bg-white border select-none border-[#E9ECEF] text-secondary rounded-[4px] flex items-center py-2 px-2 md:px-4 hover:bg-gray-100 focus:outline-none hover:shadow-md"
                    />
                  </div>
                  <div>
                    <div className="my-6 mt-6">
                      <h2 className="font-semibold text-title-p">
                        {(() => {
                          const text = question?.question || "";
                          const trimmed = text.trim();
                          const hasQuestionMark = /[?؟]$/.test(trimmed);
                          const isInterrogative =
                            /^(what|why|when|where|how|is|are|can|does|do|did|who|will|should|could|would)/i.test(
                              trimmed
                            );

                          let ending = hasQuestionMark
                            ? ""
                            : isInterrogative
                            ? "?"
                            : ":";

                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: trimmed + ending,
                              }}
                            ></span>
                          );
                        })()}
                      </h2>
                    </div>
                    {question?.image_url && (
                      <div className="flex my-8">
                        <img
                          src={question?.image_url}
                          className="w-64 h-32"
                          alt="Question Image"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="mt-auto space-y-6 lg:col-span-2">
                      {question?.hasAnswered ? (
                        <div className="bg-white lg:mx-6 rounded-lg border border-[#E6E9EC]">
                          {question?.options?.map(
                            (category, index) =>
                              category && (
                                <div
                                  key={index}
                                  className="flex justify-between items-center border-b border-[#DEE2E6] py-2 px-4"
                                >
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="mr-3 min-w-[16px] min-h-[16px] text-[#838f9b] cursor-pointer"
                                      checked={
                                        question?.userAttempt?.includes(
                                          String.fromCharCode(65 + index)
                                        ) ||
                                        selectedOptions.includes(
                                          String.fromCharCode(65 + index)
                                        )
                                      }
                                      onChange={() => handleOptionChange(index)}
                                      disabled={
                                        !question?.hasAnswered
                                          ? !question?.hasAnswered
                                          : false
                                      }
                                    />

                                    <span className="text-[14px] text-primary">
                                      <span className="mr-1 font-bold">
                                        {String.fromCharCode(65 + index)}.
                                      </span>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: removeOptionPrefix(category),
                                        }}
                                      />
                                    </span>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      ) : (
                        <div className="bg-white mx-6 rounded-lg border select-none border-[#E6E9EC]">
                          {question?.options?.map((category, index) => {
                            const optionChar = String.fromCharCode(65 + index);
                            const isCorrect =
                              question?.correct_answer?.includes(optionChar);
                            const isUserAttempt =
                              question?.userAttempt?.includes(optionChar);
                            const isWrongAttempt = isUserAttempt && !isCorrect;

                            const backgroundColor = isCorrect
                              ? "bg-green-300"
                              : isWrongAttempt
                              ? "bg-red-200"
                              : "";
                            return (
                              category && (
                                <div
                                  key={index}
                                  className={`flex justify-between items-center border-b border-[#DEE2E6] py-2 px-4  ${backgroundColor}`}
                                >
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="mr-3 min-w-[16px] min-h-[16px] text-[#838f9b] cursor-pointer"
                                      checked={
                                        question?.userAttempt?.includes(
                                          String.fromCharCode(65 + index)
                                        ) ||
                                        selectedOptions.includes(
                                          String.fromCharCode(65 + index)
                                        )
                                      }
                                      onChange={() => handleOptionChange(index)}
                                      disabled={
                                        !question?.hasAnswered
                                          ? !question?.hasAnswered
                                          : false
                                      }
                                    />
                                     <span className="mr-1 text-sm font-bold">
                                        {String.fromCharCode(65 + index)}.
                                      </span>
                                    <span
                                      className="text-[14px] text-primary"
                                      dangerouslySetInnerHTML={{
                                        __html: removeOptionPrefix(category),
                                      }}
                                    />
                                  </div>
                                </div>
                              )
                            );
                          })}
                        </div>
                      )}
                      {error && <p className="text-red-500">{error}</p>}
                      <div className="flex justify-end mt-4">
                        {quizDetail?.totalAnswers === TOTAL_QUESTIONS && (
                          <Button
                            disabled={isSubmitLoading}
                            onClick={handleQuizSubmit}
                            text="Submit quiz"
                            type="submit"
                            rightIcon={SlArrowRight}
                            className="bg-[#3A57E8] text-title-p rounded-[4px] text-white font-normal py-3 px-4"
                          />
                        )}

                        {quizDetail?.totalAnswers !== TOTAL_QUESTIONS &&
                          (question?.hasAnswered === false &&
                          quizDetail?.totalAnswers !== TOTAL_QUESTIONS ? (
                            TOTAL_QUESTIONS !==
                              quizDetail.currentQuestionIndex + 1 && (
                              <Button
                                onClick={handleNextButton}
                                text="Next"
                                disabled={isLoading || isAnswerSubmit}
                                type="button"
                                rightIcon={SlArrowRight}
                                className={`flex justify-center items-center rounded-[4px] font-normal py-2 px-6 ${
                                  isAnswerSubmit || isLoading
                                    ? "bg-[#E9ECEF] text-[#ADB5BD] cursor-not-allowed"
                                    : "bg-[#3A57E8] text-white"
                                }`}
                              />
                            )
                          ) : (
                            <Button
                              onClick={(e) =>
                                submitAnswer(
                                  e,
                                  question.questionId,
                                  selectedOptions
                                )
                              }
                              text="Submit answer"
                              disabled={isAnswerSubmit}
                              type="submit"
                              rightIcon={SlArrowRight}
                              className="bg-[#3A57E8] flex justify-center items-center text-title-p rounded-[4px] text-white font-normal py-2 px-3"
                            ></Button>
                          ))}
                      </div>
                    </div>
                  </div>
                  <Suggestions
                    setSuggestionText={setSuggestionText}
                    suggestionText={suggestionText}
                    setShowImproveSection={setShowImproveSection}
                    showImproveSection={showImproveSection}
                    setQuestion={setQuestions}
                    question={question}
                    id={id}
                  />
                </div>
              )}

              {quizDetail?.mode === "Timed" && (
                <div className="bg-white border border-[#7749F8] lg:block hidden rounded-xl self-start">
                  <Timer id={id} remainingTime={remainingTime} />
                </div>
              )}
            </div>
          </div>
          <Modal />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  );
};

export default QuestionTemplate;
