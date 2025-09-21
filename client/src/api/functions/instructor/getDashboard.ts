import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { LecturerDashboard } from "@/types";

const getDashboard = async (): Promise<LecturerDashboard> => {
  const response = await axiosInstance.get(
    `${endpoints.instructor.getInstructorDashboard}`,
    { withCredentials: true }
  );
  return response.data.data as LecturerDashboard;
};

export default getDashboard;
