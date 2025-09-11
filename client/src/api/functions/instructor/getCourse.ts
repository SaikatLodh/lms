import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { LecturerCourse } from "@/types";

const getCourse = async (): Promise<LecturerCourse[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.instructor.getInstructorCourse}`,
    { withCredentials: true }
  );
  return response.data.data as LecturerCourse[];
};

export default getCourse;
