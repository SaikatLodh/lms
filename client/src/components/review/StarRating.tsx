"use client";

import { Card, CardContent } from "../ui/card";
import { Progress } from "@/components/ui/progress";

const StarRating = ({
  rating,
  totalReviews,
  distribution,
}: {
  rating: number | undefined;
  totalReviews: number | undefined;
  distribution: number[] | undefined;
}) => {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-yellow-500 text-xl">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-500 text-xl">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-xl">
            ★
          </span>
        );
      }
    }

    return stars;
  };
  const ratingCount = rating && totalReviews && rating / totalReviews;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {ratingCount && ratingCount.toFixed(1)}
          </h2>
          <div className="flex mb-2">{renderStars(5)}</div>
          <p className="text-sm text-gray-600">{totalReviews} reviews</p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((starCount, index) => (
            <div key={starCount} className="flex items-center">
              <div className="w-16 text-sm text-gray-600">
                {starCount} stars
              </div>
              <div className="flex-1 mx-2">
                <Progress
                  value={distribution && distribution[index]}
                  className="h-2"
                />
              </div>
              <div className="w-12 text-sm text-gray-600 text-right">
                {distribution && distribution[index]}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StarRating;
