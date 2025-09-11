import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

export const deleteReview = async (id: string) => {
  const response = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.review.deleteReview}/${id}`,
    { withCredentials: true }
  );
  return response.data;
};

export default deleteReview;
