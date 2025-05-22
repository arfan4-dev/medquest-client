import React, { useEffect } from "react";
import { SlArrowRight } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, QuestionSummary, ResultsBar, Scoreboard } from "../components";

const Summary = () => {
  const location = useLocation();

  const {
    TOTAL_QUESTIONS = 0,
    averageScore = 0,
    name = "",
    id = "",
    summary: questionSummary = {},
    score = 0,
  } = location.state || {};
  const scoreboard = JSON.parse(localStorage?.getItem(`quiz_${id}`));

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("popstate", () => {
      navigate("/", { replace: true });
    });

    return () => {
      window.removeEventListener("popstate", () => {
        navigate("/", { replace: true });
      });
    };
  }, [navigate]);

  return (
    <div className="bg-[#ECEFF7] min-h-screen">
      <div className="container max-w-screen-xl px-4 py-5 pb-40 mx-auto lg:py-8">
        <div className="flex flex-wrap justify-between lg:mt-14 lg:flex-nowrap">
          <div className="lg:w-[70%] w-full">
            <div className="text-[#3A57E8] text-title-md font-bold mb-5">
              {name || ""}
            </div>
            <div className="flex justify-end">
              <div className="lg:hidden lg:w-[12%] w-fit">
                <Scoreboard
                  averageScore={averageScore}
                  scoreboard={scoreboard?.scoreboard || []}
                />
              </div>
            </div>
            <ResultsBar score={averageScore} />

            <QuestionSummary
              questionSummary={questionSummary}
              totalScore={score}
              totalQuestions={TOTAL_QUESTIONS}
            />

            <div className="flex justify-end py-12 ">
              <Link to="/">
                <Button
                  text="Continue"
                  type="submit"
                  rightIcon={SlArrowRight}
                  rightIconStyle="text-white "
                  className="bg-[#3A57E8] text-title-p rounded-[4px] border text-white font-normal py-2 px-6 focus:outline-none"
                />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block lg:w-[12%] w-fit">
            <Scoreboard
              averageScore={averageScore}
              scoreboard={scoreboard?.scoreboard || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
