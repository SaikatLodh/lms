import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const deleteLecture = async (courseId: string, lectureId: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.lecture.deleteLecture}/${courseId}/${lectureId}`
  );
  return response.data;
};

export default deleteLecture;
