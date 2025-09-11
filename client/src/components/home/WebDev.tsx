"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import CourseCard from "./CourseCard";
import { useUserCourses } from "@/hooks/react-query/react-hooks/courses/coursesHook";
import CardSkeleton from "../CardSkeleton";
const WebDev = () => {
  const { data, isLoading } = useUserCourses();
  const webDev = data?.filter(
    (course) => course.category === "Web Development"
  );
  return (
    <>
      <div className="md:mt-20 mt-10">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-10 md:text-start text-center">
          Web Development
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
              {webDev &&
                webDev.length > 0 &&
                webDev?.map((card) => (
                  <CarouselItem
                    key={card._id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <CourseCard card={card} />
                  </CarouselItem>
                ))}
            </CarouselContent>
            {webDev && webDev?.length > 3 && (
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

export default WebDev;
