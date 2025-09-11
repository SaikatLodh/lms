import { formatDuration } from "@/feature/feature";
import { useResetCourse } from "@/hooks/react-query/react-hooks/progress/progressHook";
import { Lecture } from "@/types";
import { MonitorPlay } from "lucide-react";
import Link from "next/link";
import React from "react";

const Right = ({
  Lectures,
  currentLectureId,
  slug,
  completed,
  setCompleted,
}: {
  Lectures: Lecture[] | undefined;
  currentLectureId: string;
  slug: string[];
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutate, isPending } = useResetCourse();
  return (
    <>
      <div className="mb-4">
        {" "}
        <h4 className="text-black font-bold text-[25px]">Course Content</h4>
        {completed === true && (
          <button
            className="text-[#A435F0] text-[14px] font-bold cursor-pointer border-1 border-[#A435F0] px-3 py-1 my-2"
            onClick={() =>
              mutate(slug[0] as string, {
                onSuccess: () => setCompleted(false),
              })
            }
            disabled={isPending}
          >
            {" "}
            {isPending ? "Resetting..." : "Reset Your Course"}
          </button>
        )}
      </div>

      {Lectures?.map((lecture, index) => {
        return (
          <div
            key={lecture._id}
            className={`w-full p-5 ${
              lecture._id === currentLectureId ? "bg-[#F2F2F2]" : ""
            }`}
          >
            <Link href={`/user/progress/${lecture.courseId}/${lecture._id}`}>
              <div className="flex items-center gap-2">
                <h4>{index + 1}.</h4> <h4>{lecture.title}</h4>
              </div>
              <div className="flex items-center gap-2  mt-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
                  <MonitorPlay className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-500">
                  {formatDuration(lecture.videos.duration)}
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default Right;
