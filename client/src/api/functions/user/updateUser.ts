import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const updateUser = async (data: FormData) => {
  const response = await axiosInstance.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.user.updateUser}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default updateUser;
