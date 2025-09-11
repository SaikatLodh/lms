import Link from "next/link";
import React from "react";

const PaymentFaliure = () => {
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            Oops! Something went wrong while processing your payment at
            <span className="font-semibold">LMS ACADEMY</span>. Please try again
            or use another payment method.
          </p>

          <div className="space-y-3">
            <Link
              href="/user/home"
              className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Go Back To Home
            </Link>
            <Link
              href="/user/contact"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFaliure;
