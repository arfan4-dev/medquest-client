import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CancellationPolicy = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
      "Even if you stop using the service, you are still required to complete your payments for the full year. The yearly plan is a commitment, and early cancellation is not allowed. Please make sure to assess your usage before subscribing to a yearly plan."    },
    {
      question: "7. Is there a trial period for the plans?",
      answer:
      "We currently do not offer a trial period. However, you can choose the Free plan to explore some features before deciding to upgrade to a paid plan."    },
    {
      question: "8. What forms of payment do you accept?",
      answer:
      "We accept most major credit and debit cards. The payment will be charged automatically each month for the yearly plan and once a month for the monthly plans"    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-3 pt-8 pb-40 text-justify">
      {/* Cancellation Policy Section */}
      <h2 className="lg:text-title-xl2  text-[#3A57E8] font-bold text-center mb-8">
        Cancellation Policy
      </h2>
      <p className="text-title-p text-black font-semibold mb-10 text-justify ">
        By subscribing to our yearly plan, you agree to pay the subscription fee
        on a monthly basis for the entire year. Once you commit to the yearly
        plan, cancellation is not permitted until the full 12-month period is
        completed. You are legally bound to complete all payments, and failure
        to do so may result in legal action.
      </p>

      {/* Key Points Section */}
      <h3 className="text-title-md text-[#3A57E8] font-bold mb-3">
        Key Points:
      </h3>
      <ul className="list-disc text-title-p font-medium ml-6 mb-8 text-[#374151] gap-6">
        <li className="mb-5">
          Yearly Subscription: You are committing to a 12-month period, and
          payments will be charged monthly.
        </li>
        <li className="mb-5">
          No Early Cancellation: You cannot cancel the yearly plan mid-term. The
          full subscription amount is due, even if you decide not to use the
          service.
        </li>
        <li>
          Legally Binding: By agreeing to this plan, you are bound by law to
          fulfill your payment obligations for the entire year.
        </li>
      </ul>

      {/* FAQ Section */}
      <h2 className="lg:text-title-xl2  text-[#3A57E8] font-bold text-center mb-8">
        FAQ on Payments and Upgrading/Downgrading Plans
      </h2>

      {faqData.map((faq, index) => (
        <div key={index} className="bg-white shadow-sm mb-2">
          {/* Accordion Header */}
          <div
            className="flex justify-between items-center cursor-pointer p-5 hover:bg-gray-100"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-[14px]  text-[#374151] font-medium">
              {faq.question}
            </span>
            <span className="text-gray-600 ml-10">
              {openIndex === index ? (
                <FaChevronUp size={10} className="text-[#9CA3AF]0" />
              ) : (
                <FaChevronDown size={10} className="text-[#9CA3AF]0" />
              )}
            </span>
          </div>

          {/* Accordion Content */}
          {openIndex === index && (
            <div className="px-5 pb-5 text-[#374151] text-[14px]">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CancellationPolicy;
