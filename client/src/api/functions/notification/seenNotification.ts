import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const seenNotification = async (id: string) => {
  const response = await axiosInstance.get(
    `${endpoints.notification.seenNotification}/${id}`,
    { withCredentials: true }
  );
  return response.data;
};

export default seenNotification;
