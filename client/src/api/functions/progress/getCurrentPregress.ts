import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";


const getCurrentPregress = async (id: string): Promise<string> => {
  const response = await axiosInstance.get(
    `${endpoints.progress.getCurrentCourseProgress}/${id}`,
    { withCredentials: true }
  );
  return response.data.data.id as string;
};

export default getCurrentPregress;
