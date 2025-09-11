import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createOrder = async (data: {
  userId: string | undefined;
  instructorId: string | undefined;
  courseId: string | undefined;
  totalAmount: number | undefined;
}): Promise<{
  id: string;
  amount: number;
  currency: string;
  OrderId: string;
}> => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.order.createorder}`,
    data,
    { withCredentials: true }
  );
  return response.data.data.razorpayOrderDetails;
};

export default createOrder;
