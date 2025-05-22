import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosWithToken } from "../../api";
import { filterCompletedQuiz } from "../../store/features/quiz/quiz.slice";

let isApiCallExecuted = false;
const Timer = ({ id, remainingTime }) => {
  const scoreboard = JSON.parse(localStorage.getItem(`quiz_${id}`));
  const TOTAL_QUESTIONS = Cookies.get("__ALL");
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const remainingTimeRef = useRef(remainingTime);
  const navigate = useNavigate();
  const [timer, setTimer] = useState("00:00:00");

  const handleTimeUp = async () => {
    if (isApiCallExecuted) {
      return;
    }

    isApiCallExecuted = true;
    setTimer("00:00:00");

    try {
      dispatch(filterCompletedQuiz({ id }));
      const res = await axiosWithToken.get(`/quiz/results/${id}`);

      const summaryData = {
        summary: res?.data?.data?.summary,
        id,
        TOTAL_QUESTIONS,
        scoreboard: scoreboard?.scoreboard,
        name: res.data.data.name,
        averageScore: res?.data?.data?.averageScore,
        score: res?.data?.data?.score,
      };

      Cookies.remove("__START");
      Cookies.remove("__TO");
      Cookies.remove("__ALL");

      navigate(`/summary`, {
        state: summaryData,
      });
    } catch (error) {
      console.log("Error", error);

      isApiCallExecuted = false;
    }
  };

  const getTimeRemaining = (total) => {
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  const startTimer = (total) => {
    if (timerRef.current) clearInterval(timerRef.current);

    let remaining = total;

    const timerId = setInterval(() => {
      remaining -= 1000;
      remainingTimeRef.current = remaining;

      if (remaining <= 0) {
        clearInterval(timerId);
        handleTimeUp();
      } else {
        setTimer(getFormattedTime(remaining));
      }
    }, 1000);

    timerRef.current = timerId;
  };

  const getFormattedTime = (total) => {
    const { hours, minutes, seconds } = getTimeRemaining(total);
    return (
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds)
    );
  };

  useEffect(() => {
    remainingTimeRef.current = remainingTime;
    setTimer(getFormattedTime(remainingTime));
    startTimer(remainingTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [remainingTime]);

  useEffect(() => {
    return () => {
      isApiCallExecuted = false;
    };
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>{timer}</h2>
    </div>
  );
};

export default Timer;
