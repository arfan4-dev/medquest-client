import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FreePlane = ({ onClose }) => {
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const PLAN = user?.userType?.plan || "";
  const BILLING_CYCLE = user?.userType?.billingCycle || "";

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 shadow-md z-999999">
      <div className="relative w-[494px] bg-white mx-1 rounded-lg shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[25px] text-[#6B7280] hover:text-gray-600"
        >
          &times;
        </button>

        <h2 className="text-title-p text-[#111827] font-semibold text-center mb-6">
          Upgrade Plan
        </h2>
        <div className="flex bg-[#F5F5F5] flex-col items-center justify-center  rounded py-12 mb-8">
          <p className="text-[#111827] text-title-p font-semibold">
            Your Current Plan
          </p>
          <p className="text-title-md text-[#6B7280] font-medium">{PLAN}</p>
          {PLAN !== "FREE" && (
            <p className="text-[12px] text-[#6B7280] font-medium">
              {BILLING_CYCLE === "monthly"
                ? PLAN === "BASIC"
                  ? "169 MAD/month"
                  : "319 MAD/month"
                : PLAN === "BASIC"
                ? "99 MAD/month"
                : "199 MAD/month"}
            </p>
          )}
        </div>

        <Link to="/subscription" className="flex items-end justify-end">
          <button className=" py-3 px-6 bg-[#007AFF] text-white rounded text-[14px] font-medium">
            Upgrade
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FreePlane;
