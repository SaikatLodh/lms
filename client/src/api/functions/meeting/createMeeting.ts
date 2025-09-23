import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createMeeting = async (data: {
  courseId: string | null;
  userId: string | null;
  scheduleId: string | null;
  meetingName: string | null;
  duration: number;
  date: Date | null;
  startTime: string | null;
}) => {
  const response = await axiosInstance.post(
    endpoints.meeting.createMeeting,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default createMeeting;
