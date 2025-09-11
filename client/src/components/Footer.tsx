"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const location = usePathname();
  console.log(location);
  return (
    <>
      {!location.startsWith("/instructor") &&
      !location.startsWith("/meeting") &&
      location !== "/log-in" &&
      location !== "/register" &&
      location !== "/send-mail" &&
      location !== "/otp" &&
      location !== "/forgot-password-send-mail" &&
      !location.startsWith("/forgot-reset-password") ? (
        <div className="flex md:flex-nowrap flex-wrap items-center md:justify-between justify-center px-4 py-4 border-t-1 border-[black] md:mt-20 mt-10 md:gap-0 gap-4">
          <div className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
            <img
              src="https://assets.aceternity.com/logo-dark.png"
              alt="logo"
              width={30}
              height={30}
            />
            <span className="font-medium text-black dark:text-white">
              LMS Academy
            </span>
          </div>
          <div className="flex gap-3">
            <div>
              <Link href="/user/home">
                <p className="text-sm text-black dark:text-white">Home</p>
              </Link>
            </div>
            <div>
              <Link href="/user/courses">
                <p className="text-sm text-black dark:text-white">Courses</p>
              </Link>
            </div>
            <div>
              <Link href="/user/ai-search">
                <p className="text-sm text-black dark:text-white">AI Search</p>
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm text-black dark:text-white">
              © 2025 LMS Academy. All rights reserved.
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Footer;
