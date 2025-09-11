import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Schedule } from "@/types";

const getSingleSchedule = async (scheduleId: string): Promise<Schedule> => {
  const response = await axiosInstance.get(
    `${endpoints.schedule.getSingleSchedule}/${scheduleId}`,
    {
      withCredentials: true,
    }
  );
  return response.data.data as Schedule;
};

export default getSingleSchedule;
