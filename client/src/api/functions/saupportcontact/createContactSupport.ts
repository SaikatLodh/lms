import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const createContactSupport = async (data: {
  fullName: string;
  email: string;
  number: number;
  subject: string;
  message: string;
}) => {
  const response = await axiosInstance.post(
    endpoints.contact.createContact,
    data,
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return response.data;
};

export default createContactSupport;
