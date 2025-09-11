import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Cart } from "@/types";

const getCart = async (): Promise<Cart[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.cart.getCart}`,
    { withCredentials: true }
  );
  return response.data.data.cart as Cart[];
};

export default getCart;
