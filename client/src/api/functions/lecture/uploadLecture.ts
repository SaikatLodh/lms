import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const uploadLecture = async (data: FormData) => {
  const response = await axiosInstance.post(
    endpoints.lecture.createLecture,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default uploadLecture;
