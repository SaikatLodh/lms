import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { InstructorAnnouncement } from "@/types";

const getAnnouncement = async (
  courseId: string
): Promise<InstructorAnnouncement[]> => {
  const response = await axiosInstance.get(
    `${endpoints.announcement.getAnnouncementByCourse}/${courseId}`,
    { withCredentials: true }
  );

  return response.data.data as InstructorAnnouncement[];
};

export default getAnnouncement;
