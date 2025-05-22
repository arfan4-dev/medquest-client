import React from "react";
import { IoClose } from "react-icons/io5";
import useAutoRenew from "../../hooks/useAutoRenew";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserAutoRenew,
  setUserState,
} from "../../store/features/auth/auth.slice";

const AutoRenewModal = ({ onClose }) => {
  const { toggleAutoRenew, isLoading } = useAutoRenew();
  const dispatch = useDispatch();
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const userType = user?.userType.isCancelled;
  const handleToggleAutoRenew = async (data) => {
    const res = await toggleAutoRenew(data);

    if (res.status === 200) {
      if (data === "enabled") {
        await dispatch(setUserAutoRenew());
      } else {
        await dispatch(setUserState());
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen bg-black bg-opacity-50 shadow-md z-999999 mx">
      <div className="relative w-[494px] bg-white rounded-lg shadow-lg p-6 mx-3">
        <IoClose
          onClick={onClose}
          className="absolute text-2xl text-[#59677e] hover:text-[#111827] cursor-pointer top-3 right-3"
        />
        <h2 className="text-[14px] py-3  text-[#111827] font-semibold text-left mb-3">
          Are you want to enable/disable auto renew?
        </h2>

        <div className="flex items-end justify-end gap-3 mt-6">
          <button
            className="py-2 px-7 bg-white border border-[#E5E7EB] text-[#374151] rounded text-[14px] font-medium"
            onClick={() => handleToggleAutoRenew("disabled")}
            disabled={userType || isLoading}
          >
            Disabled
          </button>
          <button
            disabled={isLoading || !userType}
            className={`py-2 px-7 bg-[#DC3545] text-white rounded text-[14px] font-medium ${
              isLoading || !userType ? "cursor-not-allowed opacity-70" : ""
            }`}
            onClick={() => handleToggleAutoRenew("enabled")}
          >
            Enabled
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoRenewModal;
