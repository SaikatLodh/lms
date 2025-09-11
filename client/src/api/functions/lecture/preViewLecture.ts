import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const preViewLecture = async (lectureId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.lecture.toggleFreePreview}/${lectureId}`,
    { withCredentials: true }
  );
  return response.data;
};

export default preViewLecture;
