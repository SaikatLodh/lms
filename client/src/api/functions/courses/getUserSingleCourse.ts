import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { SingleUserCourse } from "@/types";

const getUserSingleCourse = async (id: string): Promise<SingleUserCourse[]> => {
  const response = await axiosInstance.get(
    `${endpoints.course.getsinglecoursebyuser}/${id}`,
    { withCredentials: true }
  );
  return response.data.data as SingleUserCourse[];
};

export default getUserSingleCourse;
