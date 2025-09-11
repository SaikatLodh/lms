"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useMyCourse } from "@/hooks/react-query/react-hooks/user/userHook";
import { SingleUserCourse } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CardSkeleton from "../CardSkeleton";
import { BookOpen } from "lucide-react";

const LetsLearning = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const { data, isLoading } = useMyCourse();
  const pathname = usePathname();

  if ((!isAuthenticated && !user) || !data) return null;

  const cards =
    data &&
    data.map((course: SingleUserCourse, index: number) => {
      const cardData = {
        src: course.image?.url || "https://via.placeholder.com/400x300",
        title: course.title,
        category: course.category,
        instructorName: course.instructorName,
        primaryLanguage: course.primaryLanguage,
        content: <CourseContent course={course} />,
      };

      return <Card key={course._id} card={cardData} index={index} />;
    });

  return (
    <>
      {pathname === "/user/profile" && data.length === 0 && (
        <div className="w-full h-[40vh] flex items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center">
            <BookOpen width={60} height={60} />{" "}
            <h5 className="text-2xl font-bold">No Courses Found</h5>
          </div>
        </div>
      )}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        data.length > 0 && (
          <div
            className={`${
              pathname === "/user/profile" ? "mt-5" : "md:mt-20 mt-10"
            } w-full h-full`}
          >
            <h2
              className={`text-xl ${
                pathname === "/user/profile" ? "md:text-3xl" : "md:text-5xl"
              } font-bold text-neutral-800 dark:text-neutral-200 font-sans md:text-left text-center`}
            >
              Let&apos;s start learning
            </h2>
            <Carousel items={cards} autoplay={false} />
          </div>
        )
      )}
    </>
  );
};

const CourseContent = ({ course }: { course: SingleUserCourse }) => {
  return (
    <>
      <Link href={`/user/progress/${course._id}/${course.lectures[0]}`}>
        <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700 dark:text-neutral-200">
              {course.title}
            </span>{" "}
            {course.description ||
              "Explore this amazing course and enhance your skills."}
          </p>
          <div className="mt-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="font-semibold">Instructor:</span>{" "}
              {course.instructorName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="font-semibold">Level:</span> {course.level}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="font-semibold">Language:</span>{" "}
              {course.primaryLanguage}
            </p>
          </div>
          <img
            src={course.image?.url || "https://via.placeholder.com/500x300"}
            alt={course.title}
            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4"
          />
        </div>
      </Link>
    </>
  );
};

export default LetsLearning;
