// components/ReviewPopup.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  jobUserId: string; // The user being reviewed
}

interface ReviewFormData {
  jobUserId: string;
  ratting: number;
  reviewText: string;
  safetyConcern: boolean;
  hiredThroughPlatform: boolean;
}

const ReviewPopup = ({ isOpen, onClose, jobUserId }: ReviewPopupProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [safetyConcern, setSafetyConcern] = useState<boolean>(false);
  const [hiredThroughPlatform, setHiredThroughPlatform] =
    useState<boolean>(true);

  // Reset form
  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setSafetyConcern(false);
    setHiredThroughPlatform(true);
  };

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit review");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to submit review. Please try again.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    submitReview.mutate({
      jobUserId,
      ratting: rating,
      reviewText,
      safetyConcern,
      hiredThroughPlatform,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a2b3b]">
            Write a Review
          </DialogTitle>
          <DialogDescription>
            Share your experience working with this professional
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Overall Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    fill={(hoverRating || rating) >= star ? "#FFC107" : "none"}
                    className={
                      (hoverRating || rating) >= star
                        ? "text-[#FFC107] transition-all"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating >= 4
                  ? "🌟 Excellent"
                  : rating >= 3
                    ? "👍 Good"
                    : rating >= 2
                      ? "😐 Average"
                      : "👎 Poor"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label
              htmlFor="review"
              className="text-sm font-medium text-gray-700"
            >
              Your Review
            </Label>
            <Textarea
              id="review"
              placeholder="Share details of your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Hired Through Platform */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Did you hire this person through the platform?
            </Label>
            <RadioGroup
              value={hiredThroughPlatform ? "yes" : "no"}
              onValueChange={(value) =>
                setHiredThroughPlatform(value === "yes")
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hired-yes" />
                <Label htmlFor="hired-yes" className="cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hired-no" />
                <Label htmlFor="hired-no" className="cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Safety Concern */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Safety Concern?
            </Label>
            <RadioGroup
              value={safetyConcern ? "yes" : "no"}
              onValueChange={(value) => setSafetyConcern(value === "yes")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="safety-yes" />
                <Label
                  htmlFor="safety-yes"
                  className="cursor-pointer text-red-600"
                >
                  Yes, I have safety concerns
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="safety-no" />
                <Label htmlFor="safety-no" className="cursor-pointer">
                  No safety concerns
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitReview.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary text-white font-bold"
              disabled={submitReview.isPending}
            >
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewPopup;
