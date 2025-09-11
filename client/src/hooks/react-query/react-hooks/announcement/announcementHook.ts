import createAnnouncement from "@/api/functions/announcement/createAnnouncement";
import { useGlobalHooks } from "@/hooks/globalHook";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  INSTRUCTOR_ANNOUNCEMENTS,
  USER_COURSES,
} from "../../react-keys/querykeys";
import getAnnouncement from "@/api/functions/announcement/getAnnouncement";
import getSingleAnnouncement from "@/api/functions/announcement/getSingleAnnouncement";
import deleteAnnouncement from "@/api/functions/announcement/deleteAnnouncement";
import updateAnnouncement from "@/api/functions/announcement/updateAnnouncement";

const useCreateAnnouncement = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_ANNOUNCEMENTS] });
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

const useGetAnnouncement = (courseId: string) => {
  return useQuery({
    queryKey: [INSTRUCTOR_ANNOUNCEMENTS, courseId],
    queryFn: () => getAnnouncement(courseId),
  });
};

const useGetSingleAnnouncement = (announcementId: string) => {
  return useQuery({
    queryKey: [INSTRUCTOR_ANNOUNCEMENTS, announcementId],
    queryFn: () => getSingleAnnouncement(announcementId),
  });
};

const useUpdateAnnouncement = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: updateAnnouncement,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_ANNOUNCEMENTS] });
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

const useDeleteAnnouncement = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_ANNOUNCEMENTS] });
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
  useCreateAnnouncement,
  useGetAnnouncement,
  useGetSingleAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
};
