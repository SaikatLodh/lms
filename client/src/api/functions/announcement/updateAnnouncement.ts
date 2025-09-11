import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const updateAnnouncement = async ({
  announcementId,
  data,
}: {
  announcementId: string;
  data: { title: string; description: string };
}) => {
  const response = await axiosInstance.patch(
    `${endpoints.announcement.updateAnnouncement}/${announcementId}`,
    data,
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return response.data;
};

export default updateAnnouncement;
