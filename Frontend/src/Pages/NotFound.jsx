import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        The page you're trying to access doesn't exist.
      </p>
      <Link
        to="/"
        className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default NotFound;
