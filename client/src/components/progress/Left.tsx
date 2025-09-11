import { Lecture } from "@/types";
import React from "react";
import ReactPlayer from "react-player";
import CourseDetails from "./CourseDetails";
const Left = ({
  Lectures,
  isLoading,
}: {
  Lectures: Lecture | undefined;
  isLoading: boolean;
}) => {
  return (
    <>
      <div className="w-full h-[600px] flex items-center justify-center">
        {isLoading ? (
          <div className="w-30 h-30 border-[3px] border-secondary border-t-primary rounded-full animate-spin" />
        ) : (
          <ReactPlayer
            src={Lectures?.videos.url}
            controls={true}
            width="100%"
            height="100%"
            className="object-cover"
          />
        )}
      </div>

      <CourseDetails />
    </>
  );
};

export default Left;
