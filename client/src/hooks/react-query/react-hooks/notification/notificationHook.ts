import getNotification from "@/api/functions/notification/getNotification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NOTIFICATION } from "../../react-keys/querykeys";
import { useGlobalHooks } from "@/hooks/globalHook";
import seenNotification from "@/api/functions/notification/seenNotification";

const useGetNotification = () => {
  return useQuery({
    queryKey: [NOTIFICATION],
    queryFn: getNotification,
  });
};

const useSeenNotification = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: seenNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION] });
    },
  });
};

export { useGetNotification, useSeenNotification };
