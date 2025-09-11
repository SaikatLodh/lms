import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const bulkUpload = async (data: FormData) => {
  const response = await axiosInstance.post(
    endpoints.lecture.createLectureWithBulk,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default bulkUpload;
