import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { UserCourse } from "@/types";

const getSuggestedCourse = async (
  courseId: string | undefined
): Promise<UserCourse[]> => {
  const response = await axiosInstance.get(
    `${endpoints.course.suggestedCourses}/${courseId}`
  );
  return response.data.data as UserCourse[];
};

export default getSuggestedCourse;
