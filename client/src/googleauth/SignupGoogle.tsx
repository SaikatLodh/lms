import { MailIcon } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { getUser, googlesignup, resetLoading } from "@/store/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SignupGoogle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const responseGoogle = async (authResult: {
    authuser?: string;
    code?: string;
    prompt?: string;
    scope?: string;
    error?: string;
  }) => {
    try {
      if (authResult["code"]) {
        dispatch(googlesignup(authResult.code))
          .then((res) => {
            if (res?.payload?.message) {
              router.push("/user/home");
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
  const googleSignup = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={googleSignup}
    >
      <MailIcon />
      Google
    </Button>
  );
};

export default SignupGoogle;
