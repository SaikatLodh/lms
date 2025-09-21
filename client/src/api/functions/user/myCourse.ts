import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { SingleUserCourse } from "@/types";

const getMyCourse = async (): Promise<SingleUserCourse[]> => {
  const response = await axiosInstance.get(
    `${endpoints.user.myCourses}`,
    { withCredentials: true }
  );

  return response.data.data as SingleUserCourse[];
};

export { getMyCourse };
