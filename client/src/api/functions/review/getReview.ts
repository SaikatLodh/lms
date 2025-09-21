import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Review } from "@/types";

export const getReview = async (id: string): Promise<Review[]> => {
  const response = await axiosInstance.get(
    `${endpoints.review.getReviewByCourse}/${id}`,
    { withCredentials: true }
  );
  return response.data.data.reviews as Review[];
};

export default getReview;
