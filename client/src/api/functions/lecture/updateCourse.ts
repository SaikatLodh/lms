import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const updateLecture = async (data: FormData) => {
  const response = await axiosInstance.patch(
    `${endpoints.lecture.updateLecture}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default updateLecture;
