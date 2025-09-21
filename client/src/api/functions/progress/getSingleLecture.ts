import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Lecture } from "@/types";

const getSingleLecture = async (id: string): Promise<Lecture> => {
  const response = await axiosInstance.get(
    `${endpoints.progress.getSingleLectureProgress}/${id}`,
    { withCredentials: true }
  );
  return response.data.data.lecture as Lecture;
};

export default getSingleLecture;
