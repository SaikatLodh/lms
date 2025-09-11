import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { InstructorAnnouncement } from "@/types";

const getSingleAnnouncement = async (
  announcementId: string
): Promise<InstructorAnnouncement> => {
  const response = await axiosInstance.get(
    `${endpoints.announcement.getSingleAnnouncement}/${announcementId}`,
    { withCredentials: true }
  );

  return response.data.data as InstructorAnnouncement;
};

export default getSingleAnnouncement;
