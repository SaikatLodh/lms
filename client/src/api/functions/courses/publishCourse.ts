import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const publishCourse = async (data: {
  isPublised: boolean;
  courseId: string;
}) => {
  const response = await axiosInstance.post(
    `${endpoints.course.publishCourse}`,
    data,
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return response.data;
};

export default publishCourse;
