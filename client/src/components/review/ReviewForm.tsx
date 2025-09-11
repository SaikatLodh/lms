"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Ratings from "./Ratings";
import { useCreateReviews } from "@/hooks/react-query/react-hooks/review/reviewhook";
import { useState } from "react";

interface ReviewFormData {
  rating: number;
  comment: string;
}

const ReviewForm = ({ id }: { id: string | undefined }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReviewFormData>();
  const { mutate, isPending } = useCreateReviews();
  const [rating, setRating] = useState(0);

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  const currentRating = watch("rating");

  const onSubmit = (data: ReviewFormData) => {
    setRating(data.rating);
    if (data.rating <= 0 || data.rating === undefined) return;
    const freshData = { ...data, courseId: id as string };
    mutate(freshData, {
      onSuccess: () => {
        setRating(0);
        reset();
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{"Add Your Review"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating" className="mb-3">
              Rating
            </Label>
            <Ratings value={currentRating} onChange={handleRatingChange} />
            {rating <= 0 ||
              (rating === undefined && (
                <p className="text-sm text-red-500">Rating is required</p>
              ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="mb-3">
              Comment
            </Label>
            <Textarea
              id="comment"
              {...register("comment", {
                required: "Comment is required",
              })}
              rows={4}
              placeholder="Share your experience..."
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
