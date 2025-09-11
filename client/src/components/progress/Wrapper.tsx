"use client";
import React, { useEffect } from "react";
import Left from "./Left";
import Right from "./Right";
import { useParams, useRouter } from "next/navigation";
import {
  useSingleuserLecture,
  useUserLecture,
} from "@/hooks/react-query/react-hooks/progress/progressHook";
import getCurrentPregress from "@/api/functions/progress/getCurrentPregress";
import markLectures from "@/api/functions/progress/markLecture";
import ConfettiAnimationn from "./ConfettiAnimation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Wrapper = () => {
  const { slug } = useParams<{ slug: string[] }>();
  const [currentLectureId, setCurrentLectureId] = React.useState<string>("");
  const [completed, setCompleted] = React.useState<boolean>(false);

  useEffect(() => {
    if (slug[0] && slug[1]) {
      const completedFnc = async () => {
        const completed = await markLectures(
          slug[0] as string,
          slug[1] as string
        );

        if (completed.status === 200) {
          setCompleted(true);
        }
      };
      completedFnc();
    }

    setTimeout(() => {
      const currentFnc = async () => {
        const currentId = await getCurrentPregress(slug[0] as string);
        setCurrentLectureId(currentId as string);
      };
      currentFnc();
    }, 100);
  }, [slug]);

  const { data } = useUserLecture(slug[0] as string);
  const { data: singleData, isLoading } = useSingleuserLecture(
    (slug[1] as string) || currentLectureId
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = singleData?.courseId.students.includes(
    user?._id as string
  );
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false || singleData?.lecturerId === user?._id) {
      router.push("/user/home");
    }
  }, [isAuthenticated, router, user, singleData]);

  return (
    <>
      <div className="flex md:flex-nowrap flex-wrap-reverse my-[100px] gap-5">
        <div className="md:w-[80%] w-full">
          <Left Lectures={singleData} isLoading={isLoading} />
        </div>

        <div className="md:w-[20%] w-full md:min-h-[90vh] h-[35vh] overflow-y-scroll lecture-scroll">
          <Right
            Lectures={data}
            currentLectureId={currentLectureId}
            slug={slug}
            completed={completed}
            setCompleted={setCompleted}
          />
        </div>
      </div>

      {completed === true && <ConfettiAnimationn />}
    </>
  );
};

export default Wrapper;
