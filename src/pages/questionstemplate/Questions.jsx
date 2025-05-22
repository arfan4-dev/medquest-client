import React, { useState } from "react";
import QuestionTemplate from "../../components/QuestionTemplate";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { TimerProvider } from "../../context/timer";

const Question = () => {
  return (
    <>
      {/* <Header /> */}
      <div>
        <TimerProvider>
          <QuestionTemplate />
        </TimerProvider>
      </div>
      <Footer />
    </>
  );
};

export default Question;
