"use client";
import bulkUpload from "@/api/functions/lecture/bulkUpload";
import { useGlobalHooks } from "@/hooks/globalHook";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  INSTROCTOR_LECTURE,
  USER_COURSES,
  USER_LECTURE,
  USER_MYCOURSES,
  USER_SUGGESTIONS,
} from "../../react-keys/querykeys";
import toast from "react-hot-toast";
import axios from "axios";
import uploadLecture from "@/api/functions/lecture/uploadLecture";
import getLectures from "@/api/functions/lecture/getLectures";
import getSingleLecture from "@/api/functions/lecture/getSingleLecture";
import deleteLecture from "@/api/functions/lecture/deleteLecture";
import updateLecture from "@/api/functions/lecture/updateCourse";
import preViewLecture from "@/api/functions/lecture/preViewLecture";

const useBulkUpload = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: bulkUpload,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
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

const useUploadLecture = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: uploadLecture,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
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

const useGetLecture = (courseId: string) => {
  return useQuery({
    queryKey: [USER_LECTURE, courseId],
    queryFn: () => getLectures(courseId),
    staleTime: 1000 * 60 * 15,
  });
};

const useSingelLecture = (id: string) => {
  return useQuery({
    queryKey: [USER_LECTURE, id],
    queryFn: () => getSingleLecture(id),
  });
};

const useUpdateLecture = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: updateLecture,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
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

const useDeleteLecture = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: ({
      courseId,
      lectureId,
    }: {
      courseId: string;
      lectureId: string;
    }) => deleteLecture(courseId, lectureId),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
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

const usePreViewLecture = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: preViewLecture,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
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

export {
  useBulkUpload,
  useUploadLecture,
  useGetLecture,
  useSingelLecture,
  useUpdateLecture,
  useDeleteLecture,
  usePreViewLecture,
};
