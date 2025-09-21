import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { LecturerOrder } from "@/types";

const getOrders = async (): Promise<LecturerOrder[]> => {
  const response = await axiosInstance.get(
    `${endpoints.instructor.getInstructororderOrders}`,
    { withCredentials: true }
  );
  return response.data.data as LecturerOrder[];
};

export default getOrders;
