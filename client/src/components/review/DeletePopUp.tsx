import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import Ratings from "./Ratings";
import { useUpdateReview } from "@/hooks/react-query/react-hooks/review/reviewhook";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Review } from "@/types";

interface ReviewFormData {
  rating: number;
  comment: string;
}

const DeletePopUp = ({
  review,
  handleOpen,
  isOpen,
}: {
  review: Review;
  handleOpen: () => void;
  isOpen: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReviewFormData>();
  const { mutate, isPending } = useUpdateReview();
  const [rating, setRating] = useState(0);

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  const currentRating = watch("rating");

  const onSubmit = (data: ReviewFormData) => {
    if (data.rating <= 0 || data.rating === undefined) return;
    setRating(data.rating);
    mutate(
      { id: review._id, data },
      {
        onSuccess: () => {
          setRating(0);
          handleOpen();
          reset();
        },
      }
    );
  };

  useEffect(() => {
    setValue("rating", review.rating);
    setValue("comment", review.comment);
  }, [review.rating, review.comment, setValue]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                  <Ratings
                    value={currentRating || review.rating}
                    onChange={handleRatingChange}
                  />
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
                    <p className="text-sm text-red-500">
                      {errors.comment.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeletePopUp;
