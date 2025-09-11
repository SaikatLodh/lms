import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const deleteAnnouncement = async (announcementId: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.announcement.deleteAnnouncement}/${announcementId}`,
    { withCredentials: true }
  );
  return response.data;
};
export default deleteAnnouncement;
