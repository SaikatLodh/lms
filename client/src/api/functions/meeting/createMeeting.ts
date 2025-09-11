import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createMeeting = async (data: {
  courseId: string;
  userId: string;
  scheduleId: string;
  meetingName: string;
  duration: number;
  date: Date;
  startTime: string;
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
