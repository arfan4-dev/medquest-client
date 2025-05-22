import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-gray-900 bg-red-50 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 mx-auto text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-semibold text-red-600 sm:text-4xl">
          Payment Canceled
        </h1>
        <p className="mt-2 mb-4 text-lg text-gray-600 sm:text-xl">
          We're sorry, your payment was not completed. Please try again later.
        </p>
        <Link to="/" className="mt-6">
          <button className="px-6 py-2 text-white transition duration-300 bg-red-600 rounded-lg hover:bg-red-700">
            Go to home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
