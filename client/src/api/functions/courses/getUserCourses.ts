import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { UserCourse } from "@/types";

const getUserCourses = async (): Promise<UserCourse[]> => {
  const response = await axiosInstance.get(
    `${endpoints.course.getcoursebyuser}`,
    { withCredentials: true }
  );
  return response.data.data as UserCourse[];
};

export default getUserCourses;
