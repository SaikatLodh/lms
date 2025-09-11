"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signUp, resetLoading, setEmail } from "@/store/auth/authSlice";

interface RegisterFormInputs {
  fullName: string;
  email: string;
  password: string;
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { email, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      fullName: "",
      email: email as string,
      password: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    const freshData = { ...data, email: email as string };
    dispatch(signUp(freshData))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/log-in");
          dispatch(setEmail(null));
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
          <CardTitle className="text-xl">Create a new account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">fullName</Label>
              <Input
                id="fullName"
                type="fullName"
                placeholder="Enter your fullName"
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "fullName is required",
                  },
                  minLength: {
                    value: 3,
                    message: "fullName must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "fullName must not exceed 50 characters",
                  },
                })}
                aria-invalid={errors.fullName ? "true" : "false"}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                disabled
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
                    required: {
                      value: true,
                      message: "password is required",
                    },
                    minLength: {
                      value: 6,
                      message: "password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "password must not exceed 30 characters",
                    },
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              {loading ? "Loading..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
