import createContactSupport from "@/api/functions/saupportcontact/createContactSupport";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useCreateContact = () => {
  return useMutation({
    mutationFn: createContactSupport,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
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

export { useCreateContact };
