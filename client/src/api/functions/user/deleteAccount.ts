import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const deleteAccount = async () => {
  const response = await axiosInstance.delete(endpoints.user.deleteAccount, {
    withCredentials: true,
  });
  return response.data;
};

export default deleteAccount;
