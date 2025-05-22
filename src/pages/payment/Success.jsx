import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedUser } from "../../store/features/auth/auth.slice";

const Success = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedUser());
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-gray-900 bg-green-50 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 mx-auto text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-semibold text-green-600 sm:text-4xl">
          Payment Successful!
        </h1>
        <p className="mt-2 mb-4 text-lg text-gray-600 sm:text-xl">
          Thank you for your purchase. Your subscription is now active.
        </p>
        <Link to="/" className="mt-6">
          <button className="px-6 py-2 text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700">
            Go to home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
