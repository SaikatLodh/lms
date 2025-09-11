import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosInstance.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.user.changePassword}`,
    data,
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return response.data;
};

export default changePassword;
