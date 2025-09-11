import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const resetCurrentCourseProgress = async (courseId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.progress.resetCurrentCourseProgress}/${courseId}`,
    { withCredentials: true }
  );
  return response.data;
};

export default resetCurrentCourseProgress;
