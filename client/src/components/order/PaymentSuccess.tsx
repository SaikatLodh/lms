import Link from "next/link";
import React from "react";

const PaymentSuccess = () => {
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase at{" "}
            <span className="font-semibold">LMS ACADEMY</span>. Your payment has
            been processed successfully.
          </p>

          <div className="space-y-3">
            <Link
              href="/user/profile"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/user/courses"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
