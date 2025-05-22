import React, { useState } from "react";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { DNA, Medical } from "../../assets";
import About from "../../components/About";
import Logo from "../../assets/svg/logo";
import { FaFacebookF, FaPlus, FaTwitter, FaUser } from "react-icons/fa";
import GetEarlyModal from "../../components/GetEarlyModal";

const pricing = {
  tiers: [
    {
      name: "Compare plans",
      Description: "Choose your plan according to your needs",
      id: "tier-comparison",
      features: [
        { name: "Number of Questions" },
        { name: "Monthly Test Creation" },
        { name: "Performance Analytics" },
        { name: "Timed Test Mode" },
        { name: "University-Specific Questions" },
        { name: "24/7 customer support" },
      ],
      isComparison: true,
    },
    {
      name: "Free",
      id: "tier-free",
      price: { yearly: "0" },
      yearlyPriceSuffix: "MAD",
      features: [
        { name: "4000+ Questions" },
        { name: "Up to 10 (100 Qs max per test)" },
        { name: "—" },
        { name: "—" },
        { name: "—" },
        { name: "—" },
      ],
    },
    {
      name: "Basic",
      id: "tier-basic",
      price: { yearly: "99" },
      yearlyPriceSuffix: "MAD",
      features: [
        {
          name: (
            <>
              <div>40,000+ Questions</div>
              <div style={{ color: "#858BA0" }}>Pages Add-ons on Demand</div>
            </>
          ),
        },
        { name: "Unlimited" },
        {
          name: (
            <>
              <div>General rankings</div>
              <div>Weekly, Monthly, Semester</div>
            </>
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
        { name: "—" },
        { name: "—" },
      ],
    },
    {
      name: "Pro",
      id: "tier-pro",
      price: { yearly: "199" },
      yearlyPriceSuffix: "MAD",
      features: [
        {
          name: (
            <>
              <div>80,000+ Questions</div>
              <div style={{ color: "#858BA0" }}>Pages Add-ons on Demand</div>
            </>
          ),
        },
        { name: "Unlimited" },
        {
          name: (
            <>
              <div>Rankings by school and topic</div>
              <div>Weekly, Monthly, Semester</div>
            </>
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
      ],
    },
  ],
};

const faqData = [
  {
    question: "1. Can I upgrade my plan during the subscription period?",
    answer:
      "Yes, you can upgrade your plan at any time during your subscription period. If you choose to upgrade, the change will take effect immediately, and you will be charged the difference in price for the remaining months. Your new plan features will be available right away.",
  },

  {
    question: "2. Can I downgrade my plan?",
    answer:
      "Downgrading your plan is not allowed during the current subscription period. You must complete your existing plan’s term before switching to a lower-tier plan. For example, if you are on the yearly Pro plan, you must complete the full 12 months before switching to a Basic or Free plan.",
  },
  {
    question: "3. What happens if I subscribe to a yearly plan?",
    answer:
      "When you choose a yearly plan, you are committing to paying the subscription on a monthly basis for the entire year. Early cancellation is not allowed, and you must fulfill all payment obligations as per the agreement. The yearly subscription is legally binding, and failure to comply may result in legal action.",
  },
  {
    question: "4. How will I be billed for the yearly plan?",
    answer:
      "For the yearly plan, you will be billed every month. Although you are committed to the full 12-month term, payments are spread out monthly for convenience. Your subscription will automatically renew at the end of the year unless canceled before the renewal date.",
  },
  {
    question: "5. Can I switch from a monthly to a yearly plan?",
    answer:
      "Yes, you can switch from a monthly to a yearly plan at any time. The change will take effect immediately, and you will begin following the terms of the yearly plan, including the no-cancellation policy for the duration of the year.",
  },
  {
    question: "6. What if I stop using the service but I’m on a yearly plan?",
    answer:
      "Even if you stop using the service, you are still required to complete your payments for the full year. The yearly plan is a commitment, and early cancellation is not allowed. Please make sure to assess your usage before subscribing to a yearly plan.",
  },
  {
    question: "7. Is there a trial period for the plans?",
    answer:
      "We currently do not offer a trial period. However, you can choose the Free plan to explore some features before deciding to upgrade to a paid plan.",
  },
  {
    question: "8. What forms of payment do you accept?",
    answer:
      "We accept most major credit and debit cards. The payment will be charged automatically each month for the yearly plan and once a month for the monthly plans",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* <Header />

      <div className="flex justify-end gap-5 pr-3 mt-12 mb-8 md:px-18">
        <Link to="/log-in">
          <button className="bg-[#3A57E8] font-semibold text-nowrap text-title-p text-white py-[10px] px-8 rounded-[6px]">
            Log in
          </button>
        </Link>
        <Link to="/sign-up">
          <button className="bg-[#3A57E8] text-nowrap font-semibold text-title-p text-white py-[10px] px-8 rounded-[6px]">
            Sign up
          </button>
        </Link>
      </div> */}

      <header className="fixed top-0 left-0 flex items-center justify-between w-full px-4 bg-white md:px-8 py-7">
        {/* Logo */}
        <div className="flex justify-center w-full md:justify-start md:w-auto">
          <Logo />
        </div>

        <nav className="hidden mr-29 md:flex items-center cursor-pointer space-x-10  text-title-p text-[#424242] font-medium">
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            className="hover:text-[#3A57E8] "
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="plans"
            smooth={true}
            duration={500}
            className="hover:text-[#3A57E8]"
          >
            Plans
          </ScrollLink>
          <ScrollLink
            to="faq"
            smooth={true}
            duration={500}
            className="hover:text-[#3A57E8]"
          >
            FAQ
          </ScrollLink>
        </nav>

        <div></div>

        {/* <div className="items-center hidden space-x-8 md:flex">
          <Link
            to="/log-in"
            className="flex  items-center text-title-p text-[#424242] font-medium hover:text-[#3A57E8]"
          >
            <FaUser className="mr-1" /> Login
          </Link>
          <Link
            to="/sign-up"
            className="bg-[#3A57E8] text-nowrap font-semibold text-title-p text-white py-[10px] px-8 rounded-[6px]"
          >
            Registration
          </Link>
        </div>

        <div className="flex items-center gap-x-1 md:hidden">
          <Link
            to="/log-in"
            className="text-nowrap flex items-center font-medium text-[12px] leading-[18px] text-[#424242]  "
          >
            <FaUser className="mr-1" /> Login
          </Link>
          <span className="text-nowrap font-medium text-[12px] leading-[18px] text-[#424242]  ">
            /
          </span>
          <Link
            to="/sign-up"
            className="text-nowrap font-medium text-[12px] leading-[18px] text-[#424242]  "
          >
            Sign Up
          </Link>
        </div> */}
      </header>

      <div className="mx-auto mt-10 md:mt-44 max-w-screen-2xl ">
        <div className="mx-auto text-center md:mb-8">
          <h1 className="lg:text-[64px] text-2xl md:leading-5 md:mt-0 mt-32  font-semibold text-[#242424]">
            Prepare, Practice, Perform.
          </h1>
        </div>

        {/* Grid Section */}
        <div className="grid items-start grid-cols-1 gap-6 mt-5 md:grid-cols-3 lg:grid-cols-3 lg:mt-19">
          {/* First Image */}
          <div className="hidden md:block">
            <img
              src={Medical} // Replace with your actual image path
              alt="First Image"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Text */}
          <div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="lg:text-[64px] lg:leading-[58px] text-center text-2xl font-medium text-[#424242] md:mb-12 mb-3">
                All in one place
              </h1>
              <h3 className="mb-8 font-medium text-center text-black text-title-p">
                Enabling Moroccan medical students to master exams and track
                performance effortlessly
              </h3>
              <button
                className="bg-[#3A57E8] text-nowrap font-semibold text-title-p text-white py-[10px] px-8 rounded-[6px]"
                onClick={openModal}
              >
                Get Early Access
              </button>
            </div>

            {/* Modal Component */}
            <GetEarlyModal isOpen={isModalOpen} closeModal={closeModal} />
          </div>

          {/* Second Image */}
          <div className="">
            <img
              src={DNA} // Replace with your actual image path
              alt="Second Image"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
      <section id="about">
        <About />
      </section>
      <section id="plans">
        <div className="bg-gray-900">
          <main>
            {/* Pricing section */}
            <div className="max-w-screen-xl px-6 mx-auto mt-10 lg:mt-50 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="font-semibold text-black lg:text-title-xl">
                  Everything You Need to Learn
                </h1>
                <h1 className="lg:text-title-xl2 mt-2 font-semibold text-[#667085]">
                  at an accessible price
                </h1>
              </div>

              <div className="max-w-screen-xl py-6 mx-auto lg:my-15">
                <div className="hidden overflow-x-auto lg:block">
                  {/* Desktop Table */}
                  <table className="min-w-full border-collapse border border-[#E6E9F5]">
                    <thead>
                      <tr>
                        {pricing?.tiers?.map((tier) => (
                          <th
                            key={tier.id}
                            className="bg-gray-200 border border-[#E6E9F5]"
                            style={{
                              width: `calc(100% / ${pricing.tiers.length})`,
                            }}
                          >
                            <div className="p-7">
                              <div
                                className={classNames(
                                  tier.name === "Compare plans"
                                    ? "font-bold text-[#3A57E8] lg:text-title-md text-left"
                                    : "text-[#3A57E8] font-bold lg:text-[40px] text-center"
                                )}
                              >
                                {tier.name}
                              </div>
                              <div className="text-[#858BA0] text-[14px] font-medium text-left">
                                {tier.Description}
                              </div>
                              {!tier.isComparison && (
                                <div>
                                  <p className="flex justify-center text-[#858BA0] font-medium items-center gap-2">
                                    <span className="text-[14px]">
                                      {tier.yearlyPriceSuffix}
                                    </span>
                                    <span className="flex items-start justify-start lg:text-[32px]">
                                      {tier.price.yearly}
                                    </span>
                                    <span>/month</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.tiers[0].features.map((feature, index) => (
                        <tr key={index} className="border border-[#E6E9F5]">
                          {pricing.tiers.map((tier) => (
                            <td
                              key={tier.id}
                              className={classNames(
                                "border font-medium text-[#3A57E8] border-[#E6E9F5] p-7",
                                tier.name === "Compare plans"
                                  ? "text-title-xsm text-left"
                                  : "text-[#3A57E8] font-medium text-[14px] text-center"
                              )}
                              style={{
                                width: `calc(100% / ${pricing.tiers.length})`,
                              }}
                            >
                              {tier.isComparison
                                ? feature.name
                                : tier.features[index].name}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  {/* Pricing Tiers Section */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    {pricing?.tiers?.map((tier) => (
                      <div
                        key={tier.id}
                        className="border border-[#E6E9F5] p-6 rounded-lg bg-white text-center"
                      >
                        <h3 className="text-[#3A57E8] font-bold text-xl">
                          {tier.name}
                        </h3>
                        <p className="text-[#858BA0] text-sm mb-2">
                          {tier.Description}
                        </p>
                        {!tier.isComparison && (
                          <div className="mb-4">
                            <p className="flex justify-center items-baseline gap-1 text-[#858BA0]">
                              <span className="text-[14px]">
                                {tier.yearlyPriceSuffix}
                              </span>
                              <span className="text-[28px] font-bold">
                                {tier.price.yearly}
                              </span>
                              <span className="text-[14px]">/year</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div> */}

                  {/* Features Accordion Section */}
                  <div className="mt-6">
                    {pricing.tiers[0]?.features.map((feature, index) => (
                      <div key={index} className="border-b border-[#E6E9F5]">
                        {/* Accordion Header */}
                        <button
                          className="w-full flex justify-between items-center p-4 bg-[#F8F9FC] text-[#3A57E8] font-bold text-sm"
                          onClick={() =>
                            setActiveAccordion(
                              activeAccordion === index ? null : index
                            )
                          }
                        >
                          <span>{feature.name}</span>
                          <span>{activeAccordion === index ? "−" : "+"}</span>
                        </button>

                        {/* Accordion Content */}
                        {activeAccordion === index && (
                          <div className="p-4 bg-white">
                            {/* Show each tier's name and isComparison value first */}
                            {pricing.tiers.map((tier) => (
                              <div
                                key={tier.id}
                                className="mb-4 flex justify-between border-b border-[#E6E9F5] mt-2 pt-2"
                              >
                                <div className="flex flex-col items-start">
                                  <h4 className="text-[#3A57E8] font-bold text-lg">
                                    {tier.name}
                                  </h4>
                                  {!tier.isComparison && (
                                    <div className="mb-4">
                                      <p className="flex justify-center items-baseline gap-1 text-[#858BA0]">
                                        <span className="text-[12px]">
                                          {tier.yearlyPriceSuffix}
                                        </span>
                                        <span className="text-[20px] font-bold">
                                          {tier.price.yearly}
                                        </span>
                                        <span className="text-[12px]">
                                          /month
                                        </span>
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Show the corresponding feature for each tier */}
                                <div className="flex justify-between py-2 text-[#858BA0] text-sm ">
                                  <span className="text-right">
                                    {tier.features[index].name}
                                  </span>
                                  {/* {!tier.isComparison && <span>✔</span>} */}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[#858BA0] text-right mt-3 text-sm font-medium">
                    *These prices are according to the yearly plan.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <div className="bg-white rounded-3xl lg:mx-auto lg:my-50 my-20 max-w-screen-xl border-[2px] border-[#EFEFF0] p-5 lg:py-10 lg:px-15 flex flex-col md:grid md:grid-cols-2 gap-6 mb-6 mx-3">
          <div className="flex-1 lg:px-15">
            <h3 className="lg:text-title-p font-semibold text-[#3A57E8] mb-4 lg:mt-7">
              FAQ
            </h3>
            <p className="text-black lg:text-title-xl lg:font-semibold">
              Frequently asked questions
            </p>
          </div>
          <div className="flex flex-col">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white border-b border-[#E6E9F5] mb-4 last:mb-0"
              >
                {/* Accordion Header */}
                <div
                  className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="lg:text-[24px]  text-[#374151] font-semibold">
                    {faq.question}
                  </span>
                  <span className="ml-6">{/* Space added here */}</span>
                  {openIndex === index ? (
                    <RxCross2 className="text-[#9CA3AF] text-base min-h-3 min-w-3 max-w-3 max-h-3" />
                  ) : (
                    <FaPlus className="text-[#9CA3AF]  min-h-3 min-w-3 max-w-3 max-h-3" />
                  )}
                </div>

                {/* Accordion Content */}
                {openIndex === index && (
                  <div className="py-4 px-4 text-[#374151] text-[16px]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#3A57E8] text-white lg:py-25 py-15 ">
        <div className="container max-w-screen-xl px-6 mx-auto text-center lg:px-8">
          {/* Main Text */}
          <h2 className="lg:text-[40px]  font-bold mb-5">
            Prepare, Practice, Perform.
          </h2>
          <p className="text-[14px] font-regular mb-11">
            Enabling Moroccan medical students to master exams and track
            performance effortlessly
          </p>
          {/* Contact Button */}
          <div className="flex items-center justify-center">
            <button className="bg-[#F7F9FB] text-[#0A142F] px-5 py-2 rounded-full flex items-center justify-center space-x-2">
              {/* <PiHandWaving color="#ffcf4b" className="w-5 h-5" />{" "} */}
              {/* Hi Icon */}
              <span className=""> 👋</span>
              <span className="text-[14px] text-[#0A142F]"> Contact</span>
            </button>
          </div>
          {/* Divider */}
          <hr className="my-6 border-t border-white opacity-25 lg:mb-10 lg:mt-24" />
          {/* Footer Bottom */}
          <div className="flex flex-col items-center justify-between space-y-4 text-sm md:flex-row md:space-y-0">
            {/* Left Side */}
            <div className="font-semibold lg:text-title-md">MEDQUEST</div>
            {/* Copyright */}
            <div className="text-[14px]">
              © 2025 MedQuest. All Rights Reserved.
            </div>
            {/* Social Icons */}
            <div className="flex space-x-2">
              <Link
                to="https://www.instagram.com/medquestmaroc/"
                className="flex items-center justify-center w-8 h-8 text-white border border-white rounded-full lg:w-11 lg:h-11 "
              >
                <FaFacebookF className="w-3 h-3 text-white lg:w-4 lg:h-4" />
              </Link>
              <Link
                to="https://www.instagram.com/medquestmaroc/"
                className="flex items-center justify-center w-8 h-8 text-white border border-white rounded-full lg:w-11 lg:h-11 "
              >
                <FaTwitter className="w-3 h-3 text-white lg:w-4 lg:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
