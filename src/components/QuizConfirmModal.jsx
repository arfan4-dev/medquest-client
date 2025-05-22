import React from "react";

const QuizConfirmModal = ({ isOpen, onClose, onConfirm, resumeIndex }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  z-99999 w-screen h-screen flex items-center justify-center bg-black/65 px-4 m-0">
      <div className="max-w-lg p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-[14px] text-[#111827] font-semibold">
          Are you absolutely sure?
        </h2>
        <p className="mt-2 text-[14px] text-[#6B7280]">
          This action cannot be undone. This will send you directly into your
          quiz.
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded text-[#374151] text-[14px] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#007AFF] text-[14px] font-medium text-white rounded"
          >
            {resumeIndex === 0 ? "Start my quiz" : "Continue my quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizConfirmModal;
