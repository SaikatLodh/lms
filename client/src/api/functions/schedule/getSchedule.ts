import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Schedule } from "@/types";

const getSchedule = async (): Promise<Schedule[]> => {
  const response = await axiosInstance.get(endpoints.schedule.getSchedule, {
    withCredentials: true,
  });

  return response.data.data as Schedule[];
};

export default getSchedule;
