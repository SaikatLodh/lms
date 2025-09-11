import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const updateMeeting = async (scheduleId: string, meetingId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.meeting.updateMeeting}/${scheduleId}/${meetingId}`,
    { withCredentials: true }
  );
  return response.data;
};

export default updateMeeting;
