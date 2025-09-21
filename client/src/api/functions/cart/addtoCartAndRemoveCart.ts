import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const addtoCartAndRemoveCart = async (id: string): Promise<void> => {
  const response = await axiosInstance.get(
    `${endpoints.cart.addtoCartAndRemoveCart}/${id}`,
    { withCredentials: true }
  );
  return response.data.data;
};

export default addtoCartAndRemoveCart;