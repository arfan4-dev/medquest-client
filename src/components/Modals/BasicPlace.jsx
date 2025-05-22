import React from "react";

const BasicPlane = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[494px] bg-white rounded-lg shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[25px] text-[#6B7280] hover:text-gray-600"
        >
          &times;
        </button>

        {/* Modal content */}
        <h2 className="text-title-p text-[#111827] font-semibold text-center mb-6">
          Upgrade Plan
        </h2>
        <div className="flex bg-[#F5F5F5] flex-col items-center justify-center  rounded py-12 mb-8">
          <p className="text-[#111827] text-title-p font-semibold">
            Your Current Plan
          </p>
          <p className="text-title-md text-[#6B7280] font-medium">Basic</p>
          <p className="text-[12px] text-[#6B7280] font-medium">
            90 MAD/Per Month
          </p>
        </div>

        {/* Upgrade button */}
        <div className="flex justify-end items-end">
          <button
            className=" py-3 px-6 bg-[#007AFF] text-white rounded text-[14px] font-medium"
            onClick={() => alert("Upgrading...")}
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicPlane;
