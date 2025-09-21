import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

 const getOrderKey = async (): Promise<string> => {
  const response = await axiosInstance.get(
    `${endpoints.order.getKeys}`,
    { withCredentials: true }
  );
  return response.data.data.key as string;
};

export default getOrderKey
