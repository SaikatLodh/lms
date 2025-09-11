import { MailIcon } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUser, googlesignin, resetLoading } from "@/store/auth/authSlice";
import { Button } from "@/components/ui/button";
const SigninGoogle = () => {
  const dispatch = useDispatch<AppDispatch>();

  const responseGoogle = async (authResult: {
    authuser?: string;
    code?: string;
    prompt?: string;
    scope?: string;
    error?: string;
  }) => {
    try {
      if (authResult["code"]) {
        dispatch(googlesignin(authResult.code))
          .then((res) => {
            if (res?.payload?.message) {
              window.location.href = "/user/home";
              dispatch(getUser());
            }
          })
          .finally(() => {
            dispatch(resetLoading());
          });
      }
    } catch (error) {
      console.log("Error while Google Login...", error);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={googleLogin}
    >
      <MailIcon />
      Google
    </Button>
  );
};

export default SigninGoogle;
