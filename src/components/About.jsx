import React from "react";
import { EfficientLearning, TailoredQuizzes, TrackPerformance } from "../assets";

const About = () => {
  const features = [
    {
      title: "Tailored Quizzes",
      description:
        "Design your own quizzes tailored to your year and courses, with the option to focus on questions from past exams specific to your university or explore a broader range of questions from across Morroco. Choose what works best for you and practice effectively to master your subjects.",
      image: TailoredQuizzes,
    },
    {
      title: "Track Performance",
      description:
        "Monitor your progress with detailed analytics, gain insights into strengths and weaknesses, and measure your growth over time.",
      image: TrackPerformance,
    },
    {
      title: "Efficient Learning",
      description:
        "Save time with intuitive tools that help you practice smarter, improve faster, and build confidence for exam day.",
      image: EfficientLearning,
    },
  ];

  return (
    <div className="max-w-screen-xl px-6 mx-auto mt-10 lg:mt-56 lg:px-8">
      <div className="flex flex-col items-center justify-center lg:mb-25">
        <button
          className="bg-[#F5F5F5] border-[0.5px] lg:mb-12 border-[#DFDFDF80] text-nowrap text-[#3A57E8] font-semibold text-title-p py-[10px] px-8 rounded-3xl shadow-lg"
          style={{ boxShadow: "0px 7px 38.7px 0px #0000001A" }}
        >
          About us
        </button>
        <h1 className="lg:text-[48px] text-3xl text-black font-semibold leading-[52px]">
          Empowering
        </h1>
        <h1 className="lg:text-[48px] text-3xl text-[#3A57E8] text-center font-semibold mb-3 lg:max-w-xl leading-[52px] ">
          Moroccan medical students
        </h1>
        <h1 className="lg:text-[24px] text-xl text-[#666666] text-center font-semibold mb-10 lg:max-w-xl">
          with intuitive tools to practice quizzes, track performance, and
          achieve success.
        </h1>
      </div>
      {/* First Row */}
      <div className="bg-white rounded-3xl border-[2px] border-[#EFEFF0] p-5 lg:py-10 lg:px-15 flex flex-col md:grid md:grid-cols-2 gap-6 items-center mb-6">
        <div className="flex-1 lg:pr-15">
          <h3 className="mb-4 font-semibold text-black lg:text-title-xl2 lg:mt-7 ">
            {features[0].title}
          </h3>
          <p className="text-[#666666] lg:text-title-p lg:font-semibold">
            {features[0].description}
          </p>
        </div>
        <div className="">
          <img src={features[0].image} alt={features[0].title} className="" />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {features.slice(1).map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl  border-[2px] border-[#EFEFF0] lg:p-10 p-5 flex flex-col items-center lg:gap-24 gap-4"
          >
            <div className="lg:pl-7 lg:pr-15">
              <h3 className="mb-2 font-semibold text-black lg:text-title-xl2 ">
                {feature.title}
              </h3>
              <p className="text-[#666666] lg:text-title-p lg:font-semibold">
                {feature.description}
              </p>
            </div>
            <div className="">
              <img
                src={feature.image}
                alt={feature.title}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
