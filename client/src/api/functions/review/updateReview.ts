import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

export const createReview = async ({
  id,
  data,
}: {
  id: string;
  data: { rating: number; comment: string };
}) => {
  const response = await axiosInstance.patch(
    `${endpoints.review.updateReview}/${id}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export default createReview;
