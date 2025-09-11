import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Notification } from "@/types";

const getNotification = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get(
    `${endpoints.notification.getNotifications}`,
    { withCredentials: true }
  );
  return response.data.data as Notification[];
};

export default getNotification;
