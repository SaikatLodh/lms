import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

export const createReview = async (data: {
  courseId: string;
  rating: number;
  comment: string;
}) => {
  const response = await axiosInstance.post(
    `${endpoints.review.createReview}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export default createReview;
