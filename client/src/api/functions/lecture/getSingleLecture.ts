import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { InstructorLecture } from "@/types";

const getSingleLecture = async (id: string): Promise<InstructorLecture> => {
  const response = await axiosInstance.get(
    `${endpoints.lecture.getSingleLecture}/${id}`,
    { withCredentials: true }
  );
  return response.data.data as InstructorLecture;
};

export default getSingleLecture;
