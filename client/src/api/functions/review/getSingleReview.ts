import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Review } from "@/types";

export const getSingleReview = async (id: string): Promise<Review> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.review.getSingleReview}/${id}`,
    { withCredentials: true }
  );
  return response.data.data.reviews as Review;
};

export default getSingleReview;
