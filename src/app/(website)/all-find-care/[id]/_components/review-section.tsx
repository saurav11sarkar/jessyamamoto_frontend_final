// components/ReviewSection.tsx
import React, { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import ReviewPopup from "./review-pop-up";

interface ReviewRating {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  jobUserId: string;
  ratting: number;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReviewSectionProps {
  reviews: ReviewRating[];
  averageRating: number;
  totalReviews: number;
  mostRecentReview: ReviewRating | null;
  jobUserId: string; // Add this prop
}

const ReviewSection = ({ 
  averageRating, 
  totalReviews,
  mostRecentReview,
  jobUserId // Get the user ID being reviewed
}: ReviewSectionProps) => {
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  // Helper to render stars
  const StarRating = ({
    rating,
    size = 20,
  }: {
    rating: number;
    size?: number;
  }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.floor(rating) ? "#FFC107" : "none"}
          className={i < Math.floor(rating) ? "text-[#FFC107]" : "text-gray-300"}
        />
      ))}
    </div>
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
  };

  // Get reviewer name
  const getReviewerName = (review: ReviewRating) => {
    const { firstName, lastName } = review.userId;
    return `${firstName} ${lastName}`;
  };

  // Get satisfaction text based on rating
  const getSatisfactionText = (rating: number) => {
    if (rating >= 4) return 'Extremely satisfied';
    if (rating >= 3) return 'Satisfied';
    if (rating >= 2) return 'Average experience';
    return 'Poor experience';
  };

  const handleWriteReview = () => {
    // Check if user is logged in (you can implement this based on your auth system)
    const isLoggedIn = true; // Replace with actual auth check
    
    if (!isLoggedIn) {
      toast.error("Please log in to write a review");
      return;
    }
    
    setIsReviewPopupOpen(true);
  };

  if (totalReviews === 0) {
    return (
      <div className="container text-[#1a2b3b]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-semibold">0.0</span>
              <StarRating rating={0} size={28} />
            </div>
            <p className="text-gray-500 mt-2 text-sm">No reviews yet</p>
          </div>

          <button
            onClick={handleWriteReview}
            className="bg-primary text-white px-8 py-3 rounded-full font-medium transition-all shadow-sm"
          >
            Write a Review
          </button>
        </div>

        <ReviewPopup
          isOpen={isReviewPopupOpen}
          onClose={() => setIsReviewPopupOpen(false)}
          jobUserId={jobUserId}
        />
      </div>
    );
  }

  return (
    <div className="container text-[#1a2b3b]">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Most recent review</h2>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-semibold">{averageRating.toFixed(1)}</span>
            <StarRating rating={averageRating} size={28} />
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            Based on {totalReviews.toLocaleString()} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <button
          onClick={handleWriteReview}
          className="bg-primary hover:bg-primary text-white px-8 py-3 rounded-full font-medium transition-all shadow-sm"
        >
          Write a Review
        </button>
      </div>

      {/* Most Recent Review Card */}
      {mostRecentReview && (
        <div className="border border-gray-200 rounded-[2rem] p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-full border border-gray-100 overflow-hidden">
              <Image
                src={mostRecentReview.userId.profileImage || "/default-avatar.jpg"}
                alt={`${getReviewerName(mostRecentReview)}'s avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-[#005599] font-medium hover:underline cursor-pointer">
                {getReviewerName(mostRecentReview)}
              </h4>
              <p className="text-gray-400 text-xs mt-1">
                {formatDate(mostRecentReview.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={mostRecentReview.ratting} size={22} />
            <span className="font-semibold text-lg text-[#1a2b3b]">
              {getSatisfactionText(mostRecentReview.ratting)}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed text-[1.05rem] max-w-5xl">
            {mostRecentReview.reviewText}
          </p>
        </div>
      )}

      {/* Footer Link */}
      {totalReviews > 1 && (
        <a
          href="#"
          className="text-[#00AAFF] font-medium hover:underline flex items-center gap-1"
        >
          See All {totalReviews} Reviews
        </a>
      )}

      {/* Review Popup */}
      <ReviewPopup
        isOpen={isReviewPopupOpen}
        onClose={() => setIsReviewPopupOpen(false)}
        jobUserId={jobUserId}
      />
    </div>
  );
};

export default ReviewSection;