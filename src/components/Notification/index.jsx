import React from "react";
import { IoFlowerOutline } from "react-icons/io5";

const Notification = ({
  title = "Email Sent! Check your inbox and spam!",
  onClick,
  color = "bg-[#CFF4FC] border-[#6EDFF6]",
}) => {
  return (
    <div
      className={`flex justify-between items-center p-4 mt-9 rounded-[6px] w-full max-w-lg ${color}`}
    >
      <div className="flex items-center gap-3">
        <IoFlowerOutline size={16} className="text-[#055160]" />

        <span className="text-[12px] text-[#055160]">{title}</span>
      </div>
      <button className="ml-4 focus:outline-none" onClick={onClick}>
        &times;
      </button>
    </div>
  );
};

export default Notification;
