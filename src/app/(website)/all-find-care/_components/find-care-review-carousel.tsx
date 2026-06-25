"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string | string[];
  location?: string;
}

interface ReviewItem {
  _id: string;
  userId?: ReviewUser;
  jobUserId?: ReviewUser;
  ratting?: number;
  reviewText?: string;
  createdAt?: string;
}

interface ReviewResponse {
  success: boolean;
  data: ReviewItem[];
}

const getAvatarUrl = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] || "/placeholder.png" : value || "/placeholder.png";

const getFullName = (user?: ReviewUser) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Reviewer";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function FindCareReviewCarousel({
  categoryId,
  categoryName,
}: {
  categoryId?: string | null;
  categoryName?: string;
}) {
  const { data, isLoading } = useQuery<ReviewResponse>({
    queryKey: ["category-reviews", categoryId],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "12",
        page: "1",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review/category/${categoryId}?${params.toString()}`,
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch reviews");
      }
      return json;
    },
    enabled: !!categoryId,
  });

  const reviews = data?.data || [];

  if (!categoryId || (!isLoading && reviews.length === 0)) {
    return null;
  }

  return (
    <section className="bg-[#BDE3F9] py-16 overflow-hidden ">
      <div className="container">
        <Carousel
          opts={{ align: "start", loop: reviews.length > 3 }}
          className="w-full relative"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              Recent {categoryName?.toLowerCase() || "care"} reviews
            </h2>
            <div className="flex gap-2 relative">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 border-slate-400 bg-transparent text-slate-700 hover:bg-white/20" />
              <CarouselNext className="static translate-y-0 h-10 w-10 border-slate-400 bg-transparent text-slate-700 hover:bg-white/20" />
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {isLoading
              ? [1, 2, 3].map((item) => (
                  <CarouselItem
                    key={item}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="border-none shadow-lg rounded-xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-4 animate-pulse">
                          <div className="h-20 w-20 rounded-full bg-white/70" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-24 rounded bg-white/70" />
                            <div className="h-3 w-32 rounded bg-white/70" />
                            <div className="h-16 rounded bg-white/70" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              : reviews.map((review) => {
                  const reviewerName = getFullName(review.userId);
                  const rating = Math.max(0, Math.min(5, review.ratting || 0));
                  const date = review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <CarouselItem
                      key={review._id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="border-none shadow-lg rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              <Avatar className="h-20 w-20 border-2 border-white">
                                <AvatarImage
                                  src={getAvatarUrl(review.userId?.profileImage)}
                                  alt={reviewerName}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {getInitials(reviewerName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-slate-900 text-sm text-center">
                                {reviewerName}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs font-semibold text-slate-600 ml-1">
                                  ({rating})
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                {date}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                &quot;{review.reviewText || "No review text provided."}&quot;
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
