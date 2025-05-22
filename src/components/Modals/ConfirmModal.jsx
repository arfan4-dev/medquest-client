import React from "react";

const ConfirmModal = ({ onClose, onConfirm, isLoading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen bg-black bg-opacity-50 shadow-md z-999999 mx">
      <div className="relative w-[494px] bg-white rounded-lg shadow-lg p-6 mx-3">
        <h2 className="text-[14px] text-[#111827] font-semibold text-left mb-3">
          Are you sure?
        </h2>
        <p className="text-[#6B7280] text-[14px]">
          This option permanently resets your question and answer history.
        </p>

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

export default ConfirmModal;
