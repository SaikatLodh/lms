import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

export const addtoWishlistAndRemoveWishlist = async (id: string): Promise<void> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.wishlist.addtoWishlistAndRemoveWishlist}/${id}`,
    { withCredentials: true }
  );
  return response.data.data;
};

export default addtoWishlistAndRemoveWishlist;
