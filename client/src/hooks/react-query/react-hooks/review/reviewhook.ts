import { useQuery, useMutation } from "@tanstack/react-query";
import { USER_COURSES, USER_REVIEWS } from "../../react-keys/querykeys";
import createReview from "@/api/functions/review/createreview";
import { useGlobalHooks } from "@/hooks/globalHook";
import toast from "react-hot-toast";
import getReview from "@/api/functions/review/getReview";
import getSingleReview from "@/api/functions/review/getSingleReview";
import deleteReview from "@/api/functions/review/deleteReview";
import updateReview from "@/api/functions/review/updateReview";
import axios from "axios";

const useCreateReviews = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [USER_REVIEWS] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
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

const useGetReviews = (id: string) => {
  return useQuery({
    queryKey: [USER_REVIEWS],
    queryFn: () => getReview(id),
    staleTime: 1000 * 60 * 15,
  });
};

const useGetSingleReview = (id: string) => {
  return useQuery({
    queryKey: [USER_REVIEWS, id],
    queryFn: () => getSingleReview(id),
    staleTime: 1000 * 60 * 15,
  });
};

const useUpdateReview = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: updateReview,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [USER_REVIEWS] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
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
const useDeleteReview = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [USER_REVIEWS] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
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

export {
  useCreateReviews,
  useGetReviews,
  useGetSingleReview,
  useUpdateReview,
  useDeleteReview,
};
