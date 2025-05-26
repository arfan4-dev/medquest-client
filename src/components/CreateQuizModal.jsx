import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../store/features/quiz/quiz.service";
import distributeQuestions from "../utils/distribution";
import Loader from "./Loader";
import Cookies from "js-cookie";
import { addQuiz } from "../store/features/quiz/quiz.slice";
import { FaChevronDown } from "react-icons/fa";

const CreateQuizModal = ({
  isOpen,
  closeModal,
  values,
  formdata,
  setFormData,
}) => {
  const dispatch = useDispatch();
  const { subjectQuestions: questions = [] } = useSelector(
    (state) => state?.quiz
  );
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});
  const { subjectQuestions = [] } = questions;
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    addLoading: false,
    startLoading: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const {
    name = "",
    mode = "",
    questionCount = 0,
    university = "",
  } = values || {};

  const validateName = (name) => {
    if (name.length < 3) return "Name must be at least 3 characters long.";
    if (/^\d/.test(name)) return "Name cannot start with a number.";
    return null;
  };

  const validateTimer = (time) => {
    if (!time || time < 1 || time > 90)
      return "Time must be between 1 and 90 minutes.";
    return null;
  };

  const handleCreateQuiz = async (type) => {
    const nameError = validateName(formdata.name);
    const timerError =
      mode === "Timed" ? validateTimer(formdata.timerDuration) : null;

    setValidationErrors({
      name: nameError,
      timerDuration: timerError,
    });

    if (nameError || timerError) return;

    try {
      let res;
      let quizId;

      let topics = [];
      if (type === "add") {
        setLoading({ ...loading, addLoading: true });
        const subject = distributeQuestions(
          values.subject,
          subjectQuestions,
          values.questionCount
        );

        if (subject.length === 0) {
          setLoading(false);
          return closeModal();
        }

        topics = subject.map((s) => s?.name);

        res = await dispatch(
          createQuiz({
            subject,
            name,
            mode,
            questionCount,
            university,
            test: true,
            timerDuration: formdata.timerDuration,
          })
        );

        if (res.type === "createQuiz/fulfilled") {
          quizId = res.payload?.data?.quiz?._id;

          // Google Analytics Event
          window.gtag &&
            window.gtag("event", "quiz_created", {
              user_id: user._id, // get it from useSelector
              mode,
              topic_count: values?.subject?.length,
              total_questions: questionCount,
              university: Array.isArray(university)
                ? university.join(", ")
                : university,
            });
        }

        await dispatch(
          addQuiz({
            name,
            mode,
            topics,
            questionCount,
            id: quizId,
            isNew: true,
          })
        );

        setLoading({ ...loading, addLoading: false });
        navigate("/home");

        closeModal();
      } else {
        setLoading({ ...loading, startLoading: true });
        const subject = distributeQuestions(
          values.subject,
          subjectQuestions,
          values.questionCount
        );

        if (subject.length === 0) {
          setLoading(false);
          return closeModal();
        }

        topics = subject.map((s) => s.name);

        res = await dispatch(
          createQuiz({
            subject,
            name,
            mode,
            questionCount,
            university,
            timerDuration: formdata.timerDuration,
          })
        );

        quizId = res.payload?.data?.quiz?._id;

        dispatch(
          addQuiz({
            name,
            mode,
            topics,
            questionCount,
            id: quizId,
            isNew: false,
          })
        );
        setLoading({ ...loading, startLoading: false });
      }

      if (type === "start") {
        Cookies.set("__START", 1);
        Cookies.set("__TO", 0);
        const total = res.payload.data.questionsCount;
        Cookies.set("__ALL", total);
        navigate(`/question`, { state: { id: res.payload.data.quiz._id } });
        closeModal();
        return;
      }
    } catch (error) {}
  };

  if (!isOpen) return <></>;

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E6E6E6CC]">
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 shadow-md z-999999">
      <div className="w-full max-w-lg p-5 m-6 bg-white rounded-md">
        <div className="flex items-center justify-between">
          <h2 className="text-base text-[#111827] font-semibold mb-2">
            Create Quiz
          </h2>
          <button
            type="button"
            className="text-[#6B7280] hover:text-gray-600"
            onClick={closeModal}>
            <RxCross2 />
          </button>
        </div>
        <p className="text-[#6B7280] text-subtitle-xsm mb-4">
          Please confirm your quiz settings.
        </p>
        <div className="mb-6 ">
          <label className="block text-sm text-[#111827] font-semibold">
            Exam Name
          </label>
          <input
            type="text"
            placeholder="Exam Name here"
            value={formdata.name}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ ...formdata, name: value });
              setValidationErrors({
                ...validationErrors,
                name: validateName(value),
              });
            }}
            className="mt-3 h-[42px] px-4 py-2 text-[#ADB5BD] text-title-p focus:outline-none rounded-[4px]  border border-[#CED4DA] placeholder-secondary"
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>
        <div className="flex flex-wrap justify-start lg:flex-nowrap gap-x-15">
          <div className="relative mb-6">
            <label className="block text-sm text-[#111827] font-semibold">
              No. of Questions
            </label>
            <div className="relative">
              <select
                value={formdata.questionCount}
                onChange={(e) =>
                  setFormData({ ...formdata, questionCount: e.target.value })
                }
                className="mt-2 px-4 py-2 w-full h-[42px] text-[#838f9b] text-title-p focus:outline-none rounded-[4px] border border-[#CED4DA] bg-white appearance-none pr-8">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
              <span className="absolute top-[20px] right-3 text-[#9CA3AF] pointer-events-none">
                <FaChevronDown />
              </span>
            </div>
          </div>

          {values?.mode === "Timed" && (
            <div className="mb-6 ">
              <label className="block text-sm text-[#111827] font-semibold">
                Time (in minutes)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                placeholder="Enter time"
                value={formdata.timerDuration}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setFormData({ ...formdata, timerDuration: value });
                  setValidationErrors({
                    ...validationErrors,
                    timerDuration: validateTimer(value),
                  });
                }}
                className="mt-3 h-[42px] px-4 py-2 text-[#ADB5BD] text-title-p focus:outline-none rounded-[4px] w-30  border border-[#CED4DA] placeholder-secondary"
              />
              {validationErrors.timerDuration && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.timerDuration}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#111827] font-semibold">
            Test Mode
          </label>
          <p className="text-[#6B7280] text-[13px] font-medium capitalize">
            {values?.mode}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#111827] font-semibold">
            University
          </label>
          <p className="text-[#6B7280] text-[13px] font-medium">
            {values?.university?.join(", ")}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#111827] font-semibold">
            Topics
          </label>
          <p className="text-[#6B7280] text-[13px] font-medium">
            {values?.subject?.map((s, index) => (
              <span key={index}>
                {s.name}
                {index < values.subject.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>

        <div className="flex justify-between mt-7">
          <button
            disabled={loading.addLoading}
            type="button"
            onClick={() => handleCreateQuiz("add")}
            className="text-[#6B7280] flex border hover:border-[#007AFF] border-[#ADB5BD] items-center justify-center hover:text-white hover:bg-[#007AFF] shadow-md p-2  rounded-md text-[13px] font-bold">
            {loading.addLoading ? (
              <>
                <span className="">Loading...</span>
                <Loader className="w-4 h-4 border-blue-400 border-solid rounded-full animate-spin-1.5 border-t-transparent border-2" />
              </>
            ) : (
              "Add to my Tests"
            )}
          </button>

          <button
            type="button"
            className="bg-[#007AFF] text-white font-semibold px-4 py-2 rounded-md flex items-center justify-center"
            disabled={loading.startLoading}
            onClick={() => handleCreateQuiz("start")}>
            {loading.startLoading ? (
              <>
                <span className="">Loading...</span>
                <Loader className="w-4 h-4 border-white border-solid rounded-full animate-spin-1.5 border-t-transparent border-2" />
              </>
            ) : (
              "Start Quiz"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizModal;
