import React from "react";
import { IoIosWarning } from "react-icons/io";

const Logout = ({ onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 shadow-md z-999999">
      <div className="relative w-[494px] bg-white rounded-lg shadow-lg p-6 mx-4">
        <div className="flex items-center mb-3">
          <IoIosWarning size={30} className="mr-3 text-yellow-500" />
          <h2 className="text-[14px] text-[#111827] font-semibold text-left ">
            Are you sure?
          </h2>
        </div>

        <p className="text-[#6B7280] text-[14px]">
          Click the logout button if you would like to logout. See you soon!
        </p>

        <div className="flex items-end justify-end gap-3 mt-6">
          <button
            className="py-2 px-3 bg-white border border-[#E5E7EB] text-[#374151] rounded text-[14px] font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-2 px-3 bg-[#DC3545] text-white rounded text-[14px] font-medium"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
