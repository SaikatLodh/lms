import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const updateCourse = async (data: FormData) => {
  const response = await axiosInstance.patch(
    `${endpoints.course.updateCourse}`,
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

export default updateCourse;
