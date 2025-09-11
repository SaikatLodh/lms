import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createCourse = async (data: FormData) => {
  const response = await axiosInstance.post(
    `${endpoints.course.createCourse}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export default createCourse;
