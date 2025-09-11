import createSchedule from "@/api/functions/schedule/createSchedule";
import { useGlobalHooks } from "@/hooks/globalHook";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SCHEDULE } from "../../react-keys/querykeys";
import toast from "react-hot-toast";
import axios from "axios";
import getSchedule from "@/api/functions/schedule/getSchedule";
import getSingleSchedule from "@/api/functions/schedule/getSingleSchedule";
import updateSchedule from "@/api/functions/schedule/updateSchedule";
import liveSchedule from "@/api/functions/schedule/liveSchedule";

const useCreateSchedule = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [SCHEDULE] });
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

const useGetSchedule = () => {
  return useQuery({
    queryKey: [SCHEDULE],
    queryFn: getSchedule,
  });
};

const useSingleSchedule = (scheduleId: string) => {
  return useQuery({
    queryKey: [SCHEDULE, scheduleId],
    queryFn: () => getSingleSchedule(scheduleId),
  });
};

const useUpdateSchedule = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: updateSchedule,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [SCHEDULE] });
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

const useLiveSchedule = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: (scheduleId: string) => liveSchedule(scheduleId),
    onSuccess: (data) => {
      if (data?.message) {
        queryClient.invalidateQueries({ queryKey: [SCHEDULE] });
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
  useCreateSchedule,
  useGetSchedule,
  useSingleSchedule,
  useUpdateSchedule,
  useLiveSchedule,
};
