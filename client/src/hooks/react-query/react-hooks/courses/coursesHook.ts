import { useMutation, useQuery } from "@tanstack/react-query";
import {
  USER_COURSES,
  INSTRUCTOR_COURSES,
  INSTRUCTOR_DASHBOARD,
  INSTROCTOR_COURSES,
  USER_LECTURE,
  USER_MYCOURSES,
  USER_CART,
  USER_WISHLIST,
  USER_REVIEWS,
  USER_SUGGESTIONS,
} from "../../react-keys/querykeys";
import getUserCourses from "@/api/functions/courses/getUserCourses";
import getUserSingleCourse from "@/api/functions/courses/getUserSingleCourse";
import getInstructorCourses from "@/api/functions/courses/getInstructorCourses";
import getInstructorSingleCourse from "@/api/functions/courses/getInstructorSingleCourse";
import createCourse from "@/api/functions/courses/createCourse";
import { useGlobalHooks } from "@/hooks/globalHook";
import toast from "react-hot-toast";
import axios from "axios";
import updateCourse from "@/api/functions/courses/updateCourse";
import deleteCourse from "@/api/functions/courses/deleteCourse";
import publishCourse from "@/api/functions/courses/publishCourse";
import getSuggestedCourse from "@/api/functions/courses/suggestedCourse";

const useCreateCourse = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_DASHBOARD] });
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_SUGGESTIONS] });
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

const useUserCourses = () => {
  return useQuery({
    queryKey: [USER_COURSES],
    queryFn: getUserCourses,
    staleTime: 1000 * 60 * 15,
  });
};

const useSingleuserCourse = (id: string) => {
  return useQuery({
    queryKey: [USER_COURSES, id],
    queryFn: () => getUserSingleCourse(id),
    staleTime: 1000 * 60 * 15,
  });
};

const useInstructorCourses = () => {
  return useQuery({
    queryKey: [INSTRUCTOR_COURSES],
    queryFn: getInstructorCourses,
    staleTime: 1000 * 60 * 15,
  });
};

const useSingleInstructorCourse = (id: string) => {
  return useQuery({
    queryKey: [INSTRUCTOR_COURSES, id],
    queryFn: () => getInstructorSingleCourse(id),
    staleTime: 1000 * 60 * 15,
  });
};

const useUpdateCourse = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_CART] });
        queryClient.invalidateQueries({ queryKey: [USER_WISHLIST] });
        queryClient.invalidateQueries({ queryKey: [USER_SUGGESTIONS] });
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

const useDeleteCourse = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_CART] });
        queryClient.invalidateQueries({ queryKey: [USER_WISHLIST] });
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_DASHBOARD] });
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_REVIEWS] });
        queryClient.invalidateQueries({ queryKey: [USER_SUGGESTIONS] });
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

const usePublishCourse = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: publishCourse,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_LECTURE] });
        queryClient.invalidateQueries({ queryKey: [USER_MYCOURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_CART] });
        queryClient.invalidateQueries({ queryKey: [USER_WISHLIST] });
        queryClient.invalidateQueries({ queryKey: [INSTRUCTOR_DASHBOARD] });
        queryClient.invalidateQueries({ queryKey: [INSTROCTOR_COURSES] });
        queryClient.invalidateQueries({ queryKey: [USER_REVIEWS] });
        queryClient.invalidateQueries({ queryKey: [USER_SUGGESTIONS] });
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

const useSuggestedCourses = (courseId: string | undefined) => {
  return useQuery({
    queryKey: [USER_SUGGESTIONS, courseId],
    queryFn: () => getSuggestedCourse(courseId),
    staleTime: 1000 * 60 * 15,
  });
};

export {
  useCreateCourse,
  useUserCourses,
  useSingleuserCourse,
  useInstructorCourses,
  useSingleInstructorCourse,
  useUpdateCourse,
  useDeleteCourse,
  usePublishCourse,
  useSuggestedCourses,
};
