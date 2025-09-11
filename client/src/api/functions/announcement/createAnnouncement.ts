import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createAnnouncement = async (data: {
  courseId: string;
  title: string;
  description: string;
}) => {
  const response = await axiosInstance.post(
    endpoints.announcement.createAnnouncement,
    data,
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return response.data;
};

export default createAnnouncement;
