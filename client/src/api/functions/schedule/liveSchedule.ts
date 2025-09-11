import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const liveSchedule = async (scheduleId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.schedule.liveStatus}/${scheduleId}`,
    { withCredentials: true }
  );
  return response.data;
};

export default liveSchedule;
