"use client";
import { useSuggestedCourses } from "@/hooks/react-query/react-hooks/courses/coursesHook";
import React from "react";
import CardSkeleton from "../CardSkeleton";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel,
} from "../ui/carousel";
import CourseCard from "../home/CourseCard";

const SuggestedCourse = ({ courseId }: { courseId: string | undefined }) => {
  const { data, isLoading } = useSuggestedCourses(courseId);

  return (
    <>
      <div className="mb-10 md:px-0 px-4">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-10 md:text-start text-center">
          Suggested Courses
        </h2>
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            <CarouselContent>
              {data &&
                data.length > 0 &&
                data?.map((card) => (
                  <CarouselItem
                    key={card._id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <CourseCard card={card} />
                  </CarouselItem>
                ))}
            </CarouselContent>
            {data && data?.length > 3 && (
              <>
                <CarouselPrevious className="cursor-pointer md:block hidden" />
                <CarouselNext className="cursor-pointer md:block hidden" />
              </>
            )}
          </Carousel>
        )}
      </div>
    </>
  );
};

export default SuggestedCourse;
