"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUser, login, resetLoading } from "@/store/auth/authSlice";
import GoogleLoginWrapper from "@/googleauth/GoogleLoginWrapper";
import SignInWithFacebook from "@/facebookauh/SignInWithFacebook";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const savedEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("savedEmail") || ""
      : "";

  const savedPassword =
    typeof window !== "undefined"
      ? localStorage.getItem("savedPassword") || ""
      : "";

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: savedEmail,
      password: savedPassword,
    },
  });

  useEffect(() => {
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [savedEmail, savedPassword, setValue]);

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    dispatch(login(data))
      .then((res) => {
        if (res?.payload?.message) {
          localStorage.removeItem("accessToken");

          if (rememberMe) {
            localStorage.setItem("savedEmail", data.email);
            localStorage.setItem("savedPassword", data.password);
          } else {
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
          }

          window.location.href = "/user/home";
          dispatch(getUser());
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
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Password must be at most 30 characters",
                    },
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login with Email"}
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="remember-me">Remember me</Label>
              </div>
              <Link href="forgot-password-send-mail" className="text-sm">
                Forgot Password
              </Link>
            </div>
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
            <GoogleLoginWrapper />
            <SignInWithFacebook />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
