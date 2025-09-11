import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const deleteCourse = async (id: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.course.deleteCourse}/${id}`
  );
  return response.data;
};

export default deleteCourse;
