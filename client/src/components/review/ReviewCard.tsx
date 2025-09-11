"use client";
import { Review } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useDeleteReview } from "@/hooks/react-query/react-hooks/review/reviewhook";
import DeletePopUp from "./DeletePopUp";
import { useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const ReviewCard = ({ review }: { review: Review }) => {
  const { rating, comment, user } = review;
  const { mutate, isPending } = useDeleteReview();
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={index < rating ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Card className="w-full mb-6 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-start ">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.fullName}
              </h3>
            </div>
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(rating)}</div>
              <span className="text-sm text-gray-500">{rating}/5</span>
            </div>
          </div>
          <p className="text-gray-700">{comment}</p>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
        {user && isAuthenticated ? (
          <>
            {user._id === currentUser?._id && (
              <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={handleOpen}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => mutate(review._id)}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </CardFooter>
            )}
          </>
        ) : (
          <></>
        )}
      </Card>
      <DeletePopUp review={review} handleOpen={handleOpen} isOpen={isOpen} />
    </>
  );
};

export default ReviewCard;
