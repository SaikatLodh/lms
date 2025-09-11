import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { facebooksignin, getUser, resetLoading } from "@/store/auth/authSlice";

const SignInWithFacebook = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleResponse = (response: { id: string }) => {
    dispatch(facebooksignin(response.id))
      .then((res) => {
        if (res?.payload?.message) {
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
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_ID!}
        onSuccess={() => {
          console.log("Login Success!");
        }}
        onFail={(error) => {
          console.log("Login Failed!", error);
        }}
        onProfileSuccess={handleResponse}
        render={(renderProps) => (
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={renderProps.onClick}
          >
            <Facebook />
            Facebook
          </Button>
        )}
      />
    </>
  );
};

export default SignInWithFacebook;
