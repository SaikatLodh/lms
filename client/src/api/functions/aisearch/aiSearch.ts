import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";
import { Aiearch } from "@/types";

const aiSearch = async (query: string): Promise<Aiearch[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.aisearch.search}?query=${query}`,
    { withCredentials: true }
  );
  return response.data.data as Aiearch[];
};

export default aiSearch;
