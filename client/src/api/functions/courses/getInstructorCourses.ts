import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { InstructorCourse } from "@/types";

const getInstructorCourses = async (): Promise<InstructorCourse[]> => {
  const response = await axiosInstance.get(
    `${endpoints.course.getCourseByInstructor}`,
    { withCredentials: true }
  );
  return response.data.data as InstructorCourse[];
};

export default getInstructorCourses;
