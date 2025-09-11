import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createSchedule = async (data: {
  courseId: string;
  instuctorId: string;
  reason: string;
  date: Date;
  time: string;
}) => {
  const response = await axiosInstance.post(
    endpoints.schedule.createSchedule,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default createSchedule;
