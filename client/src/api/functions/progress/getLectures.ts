import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Lecture } from "@/types";

const getLectures = async (id: string): Promise<Lecture[]> => {
  const response = await axiosInstance.get(
    `${endpoints.progress.getLectureProgress}/${id}`,
    { withCredentials: true }
  );
  return response.data.data.lectures as Lecture[];
};

export default getLectures;
