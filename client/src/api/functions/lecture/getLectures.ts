import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { InstructorLecture } from "@/types";

const getLectures = async (courseId: string): Promise<InstructorLecture[]> => {
  const response = await axiosInstance.get(
    `${endpoints.lecture.getLectureByLecturer}/${courseId}`,
    { withCredentials: true }
  );
  return response.data.data as InstructorLecture[];
};

export default getLectures;
