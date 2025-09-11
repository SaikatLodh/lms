"use client";
import { usePathname } from "next/navigation";
import ReviewCard from "./ReviewCard";
import { Review } from "@/types";

const ReviewsSection = ({ reviews }: { reviews: Review[] | undefined }) => {
  const location = usePathname();
  return (
    <>
      {reviews && reviews.length > 0 && (
        <section
          className={`${
            reviews && reviews?.length > 3
              ? "h-[600px]"
              : reviews && reviews.length < 3
              ? ""
              : "hidden"
          } overflow-y-scroll md:w-[50%] course-reviews`}
        >
          <h2
            className={`${
              location.startsWith("/user/progress") ? "mt-8" : "mt-0"
            } text-3xl font-bold  mb-8`}
          >
            Course Reviews
          </h2>

          <div className="w-full">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No reviews yet. Be the first to share your experience!
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default ReviewsSection;
