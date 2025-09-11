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

const AllCourses = () => {
  const { data, isLoading } = useUserCourses();

  return (
    <>
      <div className="md:pt-20 pt-10">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-10 md:text-start text-center">
          What to learn next
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

export default AllCourses;
