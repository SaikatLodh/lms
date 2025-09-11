import { useMutation, useQuery } from "@tanstack/react-query";
import { USER_MYCOURSES } from "../../react-keys/querykeys";
import { getMyCourse } from "@/api/functions/user/myCourse";
import updateUser from "@/api/functions/user/updateUser";
import toast from "react-hot-toast";
import { useGlobalHooks } from "@/hooks/globalHook";
import { deleteAccountFromState, getUser } from "@/store/auth/authSlice";
import axios from "axios";
import changePassword from "@/api/functions/user/changePassword";
import deleteAccount from "@/api/functions/user/deleteAccount";

const useMyCourse = () => {
  return useQuery({
    queryKey: [USER_MYCOURSES],
    queryFn: () => getMyCourse(),
  });
};

const useUpdateUser = () => {
  const { dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        dispatch(getUser());
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

const useChangePassword = () => {
  const { dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        dispatch(getUser());
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

const useDeleteAccount = () => {
  const { dispatch, router } = useGlobalHooks();
  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        dispatch(getUser());
        dispatch(deleteAccountFromState());
        router.push("/log-in");
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

export { useMyCourse, useUpdateUser, useChangePassword, useDeleteAccount };
