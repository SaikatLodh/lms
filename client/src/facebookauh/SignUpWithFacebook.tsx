import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { facebooksignup, getUser, resetLoading } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
const SignUpWithFacebook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleResponse = (response: {
    name: string;
    email: string;
    id: string;
    picture: { data: { url: string } };
  }) => {
    const userData = {
      name: response.name,
      email: response.email,
      id: response.id,
      avatar: response.picture.data.url,
    };

    dispatch(facebooksignup(userData))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/user/home");
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
        onSuccess={(response) => {
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

export default SignUpWithFacebook;
