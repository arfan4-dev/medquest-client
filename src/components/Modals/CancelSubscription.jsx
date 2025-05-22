import React from "react";
import { IoIosWarning } from "react-icons/io";
import { useSelector } from "react-redux";

const CancelSubscription = ({ onClose, onConfirm, isLoading }) => {
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});
  const PLAN = user?.userType?.plan || "";
  const BILLING_CYCLE = user?.userType?.billingCycle || "";

  const TEXT =
    PLAN !== "FREE" && BILLING_CYCLE === "monthly"
      ? "This option will cancel your subscription"
      : "This option will not cancel immediately. You will need to complete your subscription period, and payments will be deducted at the start of the next billing cycle.";

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 shadow-md z-999999">
      <div className="relative w-[494px] bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-3">
          <IoIosWarning size={30} className="mr-3 text-yellow-500" />
          <h2 className="text-[14px] text-[#111827] font-semibold text-left ">
            Are you sure?
          </h2>
        </div>
        <p className="text-[#6B7280] text-[14px]">{TEXT || ""}</p>

        <div className="flex items-end justify-end gap-3 mt-6">
          <button
            className="py-2 px-7 bg-white border border-[#E5E7EB] text-[#374151] rounded text-[14px] font-medium"
            onClick={onClose}
          >
            No
          </button>
          <button
            disabled={isLoading}
            className="py-2 px-7 bg-[#DC3545] text-white rounded text-[14px] font-medium"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
