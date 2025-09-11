import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { InstructorCourse } from "@/types";

const getInstructorSingleCourse = async (
  id: string
): Promise<InstructorCourse> => {
  const response = await axiosInstance.get(
    `${endpoints.course.getSingleCourseByInstructor}/${id}`,
    { withCredentials: true }
  );
  return response.data.data as InstructorCourse;
};

export default getInstructorSingleCourse;
