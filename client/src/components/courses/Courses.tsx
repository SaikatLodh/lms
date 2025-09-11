"use client";
import React from "react";
import CourseCard from "../home/CourseCard";
import { UserCourse } from "@/types";
import { BookOpen } from "lucide-react";

const Courses = ({ data }: { data: UserCourse[] | undefined }) => {
  if (data && data.length === 0) {
    return (
      <div className="w-full h-[75vh] flex items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center">
          <BookOpen width={60} height={60} />{" "}
          <h5 className="text-2xl font-bold">No Courses Found</h5>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  w-full">
        {data && data.length > 0 ? (
          data.map((course) => <CourseCard key={course._id} card={course} />)
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Courses;
