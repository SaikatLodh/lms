import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Cart } from "@/types";

export const getWishlist = async (): Promise<Cart[]> => {
  const response = await axiosInstance.get(
    `${endpoints.wishlist.getWishlist}`,
    { withCredentials: true }
  );
  return response.data.data.wishList as Cart[];
};

export default getWishlist;
