import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">404</h1>
        <p className="mt-4 text-xl text-blue-500">
          Oops! This page doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-500"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
