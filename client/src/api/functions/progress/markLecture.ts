import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endpoints/endPoints";

const markLectures = async (
  courseId: string,
  lectureId: string
): Promise<{ status: number; message: string }> => {
  const response = await axiosInstance.get(
    `${endpoints.progress.markCurrentLectureAsViewed}/${courseId}/${lectureId}`,
    { withCredentials: true }
  );
  return response.data as { status: number; message: string };
};

export default markLectures;
