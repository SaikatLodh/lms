import { SingleUserCourse } from "@/types";
import React from "react";
import StarRating from "../review/StarRating";
import ReviewForm from "../review/ReviewForm";
import ReviewsSection from "../review/ReviewsSection";

const Reviews = ({ getData }: { getData: SingleUserCourse | undefined }) => {
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
      <div className=" grid lg:grid-cols-2 gap-8">
        <StarRating
          rating={rating}
          totalReviews={totalReviews}
          distribution={distribution}
        />
        <ReviewForm id={getData?._id} />
      </div>
      <ReviewsSection reviews={getData?.reviews} />
    </>
  );
};

export default Reviews;
