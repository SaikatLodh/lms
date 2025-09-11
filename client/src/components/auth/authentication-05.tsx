"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { resetLoading, verifyOtp } from "@/store/auth/authSlice";
import Resendtimer from "./Resendtimer";

interface OtpFormInputs {
  otp: number;
}

export default function OTPForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { email } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const onSubmit = (data: OtpFormInputs) => {
    dispatch(verifyOtp({ email: email as string, otp: Number(data) }))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/register");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  return (
    <>
      <Card className="w-full md:w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Enter Verification Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputOTP
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS}
            onComplete={onSubmit}
          >
            <InputOTPGroup className="flex justify-between w-[90%] m-auto *:rounded-lg! *:border!">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-muted-foreground text-sm text-center">
            You will be automatically redirected after the code is confirmed.
          </p>
        </CardContent>
        <Resendtimer />
      </Card>
    </>
  );
}
