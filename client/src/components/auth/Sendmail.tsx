"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { resetLoading, sendOtp, setEmail } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import GoogleSignupWrapper from "@/googleauth/GoogleSignupWrapper";
import SignUpWithFacebook from "@/facebookauh/SignUpWithFacebook";
interface SendEmailFormInputs {
  email: string;
}

const Sendmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SendEmailFormInputs>();
  const router = useRouter();
  const onSubmit: SubmitHandler<SendEmailFormInputs> = (data) => {
    dispatch(sendOtp(data.email))
      .then((res) => {
        if (res?.payload?.message) {
          dispatch(setEmail(data.email));
          router.push("/otp");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  return (
    <>
      <Card className="w-full md:w-[350px]">
        <CardHeader>
          <CardTitle>Send Mail</CardTitle>
          <CardDescription>Enter your mail and get otp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading..." : "Send Mail"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <GoogleSignupWrapper />
            <SignUpWithFacebook />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Sendmail;
