import { useMutation, useQuery } from "@tanstack/react-query";
import { USER_LECTURE } from "../../react-keys/querykeys";
import getLectures from "@/api/functions/progress/getLectures";
import getSingleLecture from "@/api/functions/progress/getSingleLecture";
import { useGlobalHooks } from "@/hooks/globalHook";
import resetCurrentCourseProgress from "@/api/functions/progress/resetCurrentCourseProgress";
import toast from "react-hot-toast";
import axios from "axios";

const useUserLecture = (id: string) => {
  return useQuery({
    queryKey: [USER_LECTURE, id],
    queryFn: () => getLectures(id),
    staleTime: 1000 * 60 * 15,
  });
};

const useSingleuserLecture = (id: string) => {
  return useQuery({
    queryKey: [USER_LECTURE, id],
    queryFn: () => getSingleLecture(id),
  });
};

const useResetCourse = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: resetCurrentCourseProgress,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [USER_LECTURE] });
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

export { useUserLecture, useSingleuserLecture, useResetCourse };
