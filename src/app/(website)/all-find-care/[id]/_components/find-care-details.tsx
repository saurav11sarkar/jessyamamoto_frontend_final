/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import About from "@/app/(website)/all-find-care/[id]/_components/about";
import { ProfileHero } from "@/app/(website)/all-find-care/[id]/_components/profile-hero";
import ReviewSection from "@/app/(website)/all-find-care/[id]/_components/review-section";
import { ServiceDetails } from "@/app/(website)/all-find-care/[id]/_components/service-details";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

// Review rating interface
interface ReviewRating {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  } | null;
  jobUserId: string;
  ratting: number;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// User data interface
interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  verified: boolean;
  isSubscription: boolean;
  category: string[];
  service: string[];
  status: string;
  totalBooking: any[];
  completeBooking: any[];
  cencleBooking: any[];
  reviewRatting: ReviewRating[];
  givenReviewRatting: any[];
  language: string[];
  agegroup: string[];
  education: string[];
  canHelpWith: string[];
  professionalSkill: string[];
  perferences: string[];
  experiences?: string[];
  certifications?: string[];
  galary?: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lat?: number;
  lng?: number;
  location?: string;
  zip?: string;
  subscription?: string;
  subscriptionExpiry?: string;
  profileImage?: string;
  bio?: string;
  exprience?: number;
  phone?: string;
}

// Category data interface
interface CategoryData {
  _id: string;
  image: string;
  name: string;
  findCareUser: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  findJobUser: string[];
  banner: string[];
  description: string;
}

// Service day interface
interface ServiceDay {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

// Main service data interface
interface ServiceData {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: UserData;
    categoryId: CategoryData;
    zip: string;
    location: string;
    lat: number;
    lng: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    hourRate: number;
    days: ServiceDay[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const FindCareDetails = () => {
  const { id } = useParams();
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const { data: serviceData, isLoading, isError } = useQuery<ServiceData>({
    queryKey: ["find-care-details", id],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/${id}`,
        { headers },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch service details");
      }
      const data = await res.json();
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mt-20 flex justify-center items-center min-h-[calc(100vh-300px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !serviceData?.data) {
    return (
      <div className="mt-20 text-center text-red-500">
        Failed to load service details
      </div>
    );
  }

  const userInfo = serviceData.data.userId;
  const reviews = userInfo?.reviewRatting || [];
  const categoryInfo = serviceData.data.categoryId;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc: number, curr: ReviewRating) => acc + curr.ratting,
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const mostRecentReview =
    reviews.length > 0 ? reviews[reviews.length - 1] : null;

  return (
    <div className="mt-20 space-y-16">
      <ProfileHero
        userId={userInfo?._id}
        name={`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
        location={
          serviceData.data.location ||
          userInfo?.location ||
          "Location not specified"
        }
        hourlyRate={0}
        hideRate={true}
        rating={parseFloat(averageRating)}
        reviewCount={reviews.length}
        profileImage={userInfo?.profileImage}
        isVerified={userInfo?.verified}
      />
      <About experience={userInfo?.exprience || 0} bio={userInfo?.bio || ""} />
      <ReviewSection
        reviews={reviews}
        averageRating={parseFloat(averageRating)}
        totalReviews={reviews.length}
        mostRecentReview={mostRecentReview}
        jobUserId={userInfo?._id}
      />
      <ServiceDetails
        ageGroups={userInfo?.agegroup || []}
        canHelpWith={userInfo?.canHelpWith || []}
        education={userInfo?.education || []}
        professionalSkills={userInfo?.professionalSkill || []}
        experiences={userInfo?.experiences || []}
        certifications={userInfo?.certifications || userInfo?.galary || []}
        languages={userInfo?.language || []}
        hourlyRate={0}
        hideRate={true}
        days={serviceData.data.days || []}
        categoryName={categoryInfo?.name}
        categoryDescription={categoryInfo?.description}
      />
    </div>
  );
};

export default FindCareDetails;
