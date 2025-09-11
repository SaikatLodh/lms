import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Meeting } from "@/types";

export const getMeeting = async (meetingId: string): Promise<Meeting> => {
  const response = await axiosInstance.get(
    `${endpoints.meeting.getMeeting}/${meetingId}`,
    { withCredentials: true }
  );
  return response.data.data as Meeting;
};

export default getMeeting;
