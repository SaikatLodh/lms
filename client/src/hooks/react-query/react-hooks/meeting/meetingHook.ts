import createMeeting from "@/api/functions/meeting/createMeeting";
import updateMeeting from "@/api/functions/meeting/updateMeeting";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { MEETING, SCHEDULE } from "../../react-keys/querykeys";
import getMeeting from "@/api/functions/meeting/getMeeting";
import { useGlobalHooks } from "@/hooks/globalHook";

const useCreateMeeting = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createMeeting,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [MEETING] });
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

const useGetMeeting = (meetingId: string) => {
  return useQuery({
    queryKey: [MEETING],
    queryFn: () => getMeeting(meetingId),
  });
};

const useUpdateMeeting = (scheduleId: string, meetingId: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: () => updateMeeting(scheduleId, meetingId),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: [MEETING] });
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

export { useCreateMeeting, useGetMeeting, useUpdateMeeting };
