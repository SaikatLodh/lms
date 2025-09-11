"use client";
import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import RegisterForm from "./auth/Register";
import { usePathname } from "next/navigation";
import LoginForm from "./auth/authentication-02";
import Sendmail from "./auth/Sendmail";
import OTPForm from "./auth/authentication-05";
import ForgotPasswordMail from "./auth/ForgotPasswordMail";
import ForgotResetPassword from "./auth/ForgotResetPassword";

export function AuroraBackgroundDemo() {
  const location = usePathname();

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        {location === "/register" ? (
          <RegisterForm />
        ) : location === "/log-in" ? (
          <LoginForm />
        ) : location === "/send-mail" ? (
          <Sendmail />
        ) : location === "/otp" ? (
          <OTPForm />
        ) : location === "/forgot-password-send-mail" ? (
          <ForgotPasswordMail />
        ) : location.startsWith("/forgot-reset-password") ? (
          <ForgotResetPassword />
        ) : null}
      </motion.div>
    </AuroraBackground>
  );
}
