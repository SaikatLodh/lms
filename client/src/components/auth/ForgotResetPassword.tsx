"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { forgotResetPassword, resetLoading } from "@/store/auth/authSlice";

interface ForgotPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

const ForgotResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormInputs>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = (data) => {
    dispatch(forgotResetPassword({ token, data }))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/log-in");
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
          <CardTitle className="text-xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      message: "Password is required",
                    },
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    maxLength: {
                      value: 30,
                      message: "Password must be at most 30 characters long",
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
            <div className="space-y-2">
              <Label htmlFor="password">confirmPassword</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter your confirmPassword"
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "confirmPassword is required",
                    },
                    minLength: {
                      value: 6,
                      message:
                        "confirmPassword must be at least 6 characters long",
                    },
                    maxLength: {
                      value: 30,
                      message:
                        "confirmPassword must be at most 30 characters long",
                    },
                    validate: (value) => {
                      return value !== getValues().password
                        ? "Passwords do not match"
                        : true;
                    },
                  })}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ForgotResetPassword;
