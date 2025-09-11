"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { forgotSendEmail, resetLoading } from "@/store/auth/authSlice";

interface ForgotEmailFormInputs {
  email: string;
}

const ForgotPasswordMail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotEmailFormInputs>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotEmailFormInputs> = (data) => {
    dispatch(forgotSendEmail(data.email)).finally(() => {
      dispatch(resetLoading());
    });
  };
  return (
    <>
      <Card className="w-full md:w-[350px]">
        <CardHeader>
          <CardTitle className="text-xl">Forgot Password</CardTitle>
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
        </CardContent>
      </Card>
    </>
  );
};

export default ForgotPasswordMail;
