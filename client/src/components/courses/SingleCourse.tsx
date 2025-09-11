"use client";
import { useSingleuserCourse } from "@/hooks/react-query/react-hooks/courses/coursesHook";
import { useParams } from "next/navigation";
import React from "react";
import AccordionDemo from "./AccordionDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, IndianRupee, Star } from "lucide-react";
import { formatDuration, handelPayment } from "@/feature/feature";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import ReviewsSection from "@/components/review/ReviewsSection";
import ReviewForm from "../review/ReviewForm";
import StarRating from "../review/StarRating";
import SuggestedCourse from "./SuggestedCourse";

const SingleCourse = () => {
  const { id } = useParams();
  const { data } = useSingleuserCourse(id as string);
  const getData = data && data[0];
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const rating = getData?.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const totalReviews = getData?.reviews?.length || 0;

  const distribution =
    getData?.reviews && totalReviews > 0
      ? [
          (getData.reviews.filter((r) => r.rating === 5).length /
            totalReviews) *
            100,
          (getData.reviews.filter((r) => r.rating === 4).length /
            totalReviews) *
            100,
          (getData.reviews.filter((r) => r.rating === 3).length /
            totalReviews) *
            100,
          (getData.reviews.filter((r) => r.rating === 2).length /
            totalReviews) *
            100,
          (getData.reviews.filter((r) => r.rating === 1).length /
            totalReviews) *
            100,
        ]
      : [0, 0, 0, 0, 0];

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Left Column: Course Details */}
        <div className="grid lg:grid-cols-3 gap-8 md:my-[100px] my-[50px] md:px-0 px-4">
          <div className="lg:col-span-2 space-y-8 md:order-fast order-last">
            {/* Header */}
            <div>
              <h1 className="md:text-4xl text-2xl font-bold mb-2">
                {getData?.title}
              </h1>
              <p className="text-gray-600">{getData?.subtitle}</p>
              <div className="my-4">
                <h3 className="font-bold">
                  Instructor: {getData?.instructorName}
                </h3>
                <h5>Language: {getData?.primaryLanguage}</h5>
                <h5>Level: {getData?.level}</h5>
                <h4>Welcome Message: {getData?.welcomeMessage}</h4>
              </div>

              <div className="flex gap-1 items-center mt-2 text-sm text-gray-500">
                <span> {rating && rating / totalReviews}</span>
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      className={`w-4 h-4 fill-current ${
                        rating && index < rating / totalReviews
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      key={index}
                    />
                  ))}
                </span>
                <span>
                  {" "}
                  {getData?.reviews && getData?.reviews.length > 0 ? (
                    <>
                      {" "}
                      <h6 className="text-[#0260ff]">
                        ({getData?.reviews.length} Reviews)
                      </h6>
                    </>
                  ) : null}
                </span>
                <span>
                  {getData?.students && getData?.students.length > 0 ? (
                    <>{getData?.students.length} Students</>
                  ) : null}
                </span>
              </div>
            </div>

            {/* Course Structure Section */}
            {getData?.lectures && getData?.lectures.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Course Structure</h2>
                <div className="flex items-center gap-3">
                  <h6>{getData?.lectures.length} Lectures</h6>
                  <h6>
                    {" "}
                    Duration:{" "}
                    {formatDuration(
                      getData?.lectures.reduce(
                        (total, lecture) => total + lecture.videos.duration,
                        0
                      )
                    )}{" "}
                  </h6>
                </div>
                <AccordionDemo lectures={getData?.lectures} />{" "}
                {/* This will be a separate component */}
              </div>
            )}

            {/* Course Description Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Course Description</h2>
              <p>{getData?.description}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <StarRating
                rating={rating}
                totalReviews={totalReviews}
                distribution={distribution}
              />
              {isAuthenticated &&
              getData?.students.includes(user?._id as string) &&
              getData?.instructorId !== user?._id ? (
                <ReviewForm id={getData?._id} />
              ) : null}
            </div>
            <ReviewsSection reviews={getData?.reviews} />
          </div>

          {/* Right Column: Call to Action */}
          <div className="lg:col-span-1 md:order-last order-first">
            <Card className="shadow-lg">
              <CardContent className="p-4 space-y-4">
                <img
                  src={getData?.image.url}
                  alt="Course Thumbnail"
                  className="rounded-md w-full object-cover"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <span className="text-3xl font-bold text-green-500 flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />{" "}
                      {getData?.pricing}
                    </span>
                  </div>
                </div>
                {user && isAuthenticated ? (
                  <>
                    {getData?.instructorId === user._id ? (
                      <> </>
                    ) : getData?.students.includes(user?._id as string) ? (
                      <Link
                        href={`/user/progress/${getData?._id}/${getData?.lectures[0]?._id}`}
                      >
                        <Button
                          className="w-full text-lg py-6 cursor-pointer border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2]"
                          size="lg"
                        >
                          Go to Course
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full text-lg py-6 cursor-pointer border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2]"
                        size="lg"
                        onClick={() =>
                          handelPayment(getData, setIsLoading, user)
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Enroll Now"}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Link href={`/log-in`}>
                      <Button
                        className="w-full text-lg py-6 cursor-pointer border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2]"
                        size="lg"
                      >
                        Log in to Enroll
                      </Button>
                    </Link>
                  </>
                )}

                <div className="space-y-2 text-sm text-gray-600 mt-3">
                  <h3 className="font-bold">What&apos;s in the course?</h3>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>Lifetime access with free updates.</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>Step-by-step, hands-on project guidance.</span>
                    </li>
                    {/* Add more list items here */}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {getData?._id && <SuggestedCourse courseId={getData?._id} />}
      </div>
    </>
  );
};

export default SingleCourse;
