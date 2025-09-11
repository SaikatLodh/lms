import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const updateSchedule = async ({
  data,
  scheduleId,
}: {
  data: { reason?: string; date?: Date; time?: string; status?: string };
  scheduleId: string;
}) => {
  const response = await axiosInstance.patch(
    `${endpoints.schedule.updateSchedule}/${scheduleId}`,
    data,
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return response.data;
};

export default updateSchedule;
