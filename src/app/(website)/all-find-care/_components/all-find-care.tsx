/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Banner from "@/components/shared/find-job-care/banner";
import ProfileCard from "@/components/shared/find-job-care/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  ListFilter,
  MapPin,
  Search,
  Smile,
  Star,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FindCareReviewCarousel from "../../all-find-care/_components/find-care-review-carousel";
import { useSearchParams } from "next/navigation";
import { ProfileCardSkeleton } from "@/components/shared/find-job-care/profile-card-skeleton";
import { BannerSkeleton } from "@/components/shared/find-job-care/banner-skeleton";
import { useSession } from "next-auth/react";

// Types for the API response
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  language: string[];
  agegroup: string[];
  education: string[];
  canHelpWith: string[];
  professionalSkill: string[];
  perferences: string[];
  location: string;
  profileImage: string;
  bio: string;
  phone: string;
}

interface Day {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  banner: string[];
  logo: string;
}

interface ServiceBaseUser {
  _id: string;
  zip: string;
  location: string;
  gender: string;
  hourRate: number;
  days: Day[];
  status: string;
  createdAt: string;
  user: User;
  category?: Category;
  totalRatings?: number;
  averageRating?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ServiceBaseUser[];
}

const AllFindCare = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [availableFilter, setAvailableFilter] = useState("all");
  const [minHourRate, setMinHourRate] = useState("");
  const [maxHourRate, setMaxHourRate] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data, isLoading, refetch } = useQuery<ApiResponse>({
    queryKey: [
      "all-find-care",
      id,
      searchTerm,
      locationFilter,
      availableFilter,
      minHourRate,
      maxHourRate,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        role: "find job",
        limit: "100",
        sortBy: "createdAt",
        sortOrder,
      });
      if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
      if (locationFilter !== "all") params.set("location", locationFilter);
      if (availableFilter !== "all") params.set("available", availableFilter);
      if (minHourRate.trim()) params.set("minHourRate", minHourRate.trim());
      if (maxHourRate.trim()) params.set("maxHourRate", maxHourRate.trim());

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/service-base-user/${id}?${params.toString()}`,
        { headers },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch caregivers");
      }
      return data;
    },
    enabled: !!id,
  });

  const caregivers = data?.data || [];
  const locationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          caregivers
            .map((caregiver) => caregiver.location || caregiver.user?.location)
            .filter(Boolean),
        ),
      ),
    [caregivers],
  );
  const getProfileImage = (value?: string | string[]) =>
    Array.isArray(value)
      ? value[0] || "/placeholder.png"
      : value || "/placeholder.png";

  // Calculate dynamic stats
  const dynamicStats = useMemo(() => {
    const totalCaregivers = caregivers.length;

    // Calculate average hourly rate
    const totalHourRate = caregivers.reduce(
      (sum, caregiver) => sum + (caregiver.hourRate || 0),
      0,
    );
    const averageHourRate =
      totalCaregivers > 0
        ? (totalHourRate / totalCaregivers).toFixed(2)
        : "0.00";

    // Calculate average rating
    const caregiversWithRatings = caregivers.filter(
      (c) => c.averageRating && c.averageRating > 0,
    );
    const totalRating = caregiversWithRatings.reduce(
      (sum, caregiver) => sum + (caregiver.averageRating || 0),
      0,
    );
    const averageRating =
      caregiversWithRatings.length > 0
        ? (totalRating / caregiversWithRatings.length).toFixed(1)
        : "0.0";

    return [
      {
        icon: <Smile className="w-6 h-6 text-slate-900" />,
        text: (
          <span>
            <span className="font-semibold">
              {totalCaregivers.toLocaleString()}
            </span>{" "}
            {data?.data[0]?.category?.name?.toLowerCase() || "caregivers"} are
            listed on This platform
          </span>
        ),
      },
      {
        icon: <DollarSign className="w-6 h-6 text-slate-900" />,
        text: (
          <span>
            The average post rate is{" "}
            <span className="font-semibold">${averageHourRate}/hr</span> as of{" "}
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        icon: <Star className="w-6 h-6 text-slate-900 fill-slate-900" />,
        text: (
          <span>
            The average star rating for rated{" "}
            {data?.data[0]?.category?.name?.toLowerCase() || "caregivers"} is{" "}
            <span className="font-semibold">{averageRating}</span>
            {caregiversWithRatings.length > 0 &&
              caregivers.length > caregiversWithRatings.length && (
                <span className="text-sm text-gray-500 block">
                  (based on {caregiversWithRatings.length}{" "}
                  {caregiversWithRatings.length === 1 ? "rating" : "ratings"})
                </span>
              )}
          </span>
        ),
      },
    ];
  }, [caregivers, data]);

  const categoryData = caregivers[0]?.category;

  const generateTags = (caregiver: ServiceBaseUser) => {
    const tags = [];

    if (caregiver.days && caregiver.days.length > 0) {
      tags.push(`${caregiver.days.length} days availability`);
    }

    if (caregiver.user?.perferences && caregiver.user.perferences.length > 0) {
      tags.push(...caregiver.user.perferences.slice(0, 2));
    }

    if (
      caregiver.user?.professionalSkill &&
      caregiver.user.professionalSkill.length > 0
    ) {
      tags.push(...caregiver.user.professionalSkill.slice(0, 1));
    }

    return tags.slice(0, 3);
  };

  return (
    <div className="space-y-16 mb-20">
      {/* Show Banner Skeleton while loading, otherwise show dynamic Banner */}
      {isLoading ? (
        <BannerSkeleton />
      ) : (
        <Banner
          title={categoryData?.name}
          description={categoryData?.description}
          banner={categoryData?.banner}
        />
      )}

      <div className="container flex lg:flex-row flex-col-reverse gap-10">
        {/* all card here */}
        <div className="space-y-8 flex-1">
          <div>
            <h1 className="text-3xl font-semibold">
              {categoryData?.name} available in your area:
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="relative w-full max-w-[260px]">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, email, location"
                  className="h-11 rounded-full border-blue-500 bg-blue-50/50 pl-9"
                />
              </div>
              {/* City Select Component */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px] rounded-full border-blue-500 bg-blue-50/50 h-11 px-4 hover:bg-blue-100/50 transition-colors focus:ring-1 focus:ring-blue-400">
                  <div className="flex items-center gap-2 w-full">
                    <MapPin className="w-4 h-4 text-red-500 fill-red-500/10 shrink-0" />
                    <div className="flex-1 text-left">
                      <SelectValue placeholder="Location" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All locations</SelectItem>
                  {locationOptions.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={availableFilter}
                onValueChange={setAvailableFilter}
              >
                <SelectTrigger className="w-[150px] rounded-full border-blue-500 bg-blue-50/50 h-11 px-4 hover:bg-blue-100/50 transition-colors focus:ring-1 focus:ring-blue-400">
                  <SelectValue placeholder="Available" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Any day</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={minHourRate}
                onChange={(event) => setMinHourRate(event.target.value)}
                type="number"
                min="0"
                placeholder="Min $"
                className="h-11 w-[100px] rounded-full border-blue-500 bg-blue-50/50"
              />
              <Input
                value={maxHourRate}
                onChange={(event) => setMaxHourRate(event.target.value)}
                type="number"
                min="0"
                placeholder="Max $"
                className="h-11 w-[100px] rounded-full border-blue-500 bg-blue-50/50"
              />

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px] rounded-full border-blue-500 bg-blue-50/50 h-11 px-4 hover:bg-blue-100/50 transition-colors focus:ring-1 focus:ring-blue-400">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter All Button */}
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="rounded-full border-blue-500 bg-blue-50/50 h-11 px-6 hover:bg-blue-100/50 transition-colors flex items-center gap-2 border"
              >
                <ListFilter className="w-4 h-4 text-slate-700" />
                <span className="text-slate-900 font-medium">Filter All</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <>
              <ProfileCardSkeleton />
              <ProfileCardSkeleton />
              <ProfileCardSkeleton />
              <ProfileCardSkeleton />
            </>
          ) : (
            <div className="space-y-8">
              {caregivers.length > 0 ? (
                caregivers.map((caregiver) => (
                  <ProfileCard
                    key={caregiver._id}
                    image={getProfileImage(caregiver.user?.profileImage)}
                    title={
                      `${caregiver.user?.firstName || ""} ${caregiver.user?.lastName || ""}`.trim() ||
                      "Parent"
                    }
                    tags={generateTags(caregiver)}
                    bio={caregiver.user?.bio || "No bio available"}
                    location={caregiver.location}
                    id={caregiver?._id}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No caregivers found in your area
                </div>
              )}
            </div>
          )}
        </div>

        {/* all states here */}
        <div className="lg:w-[25%]">
          <div className="flex flex-col gap-6 sticky top-24 z-30">
            {isLoading ? (
              // Show skeleton for stats while loading
              <>
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 animate-pulse"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              dynamicStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 text-slate-700 leading-tight"
                >
                  {/* Circular Icon Container */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 shrink-0">
                    {stat.icon}
                  </div>

                  {/* Text Content */}
                  <p>{stat.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <FindCareReviewCarousel
        categoryId={id}
        categoryName={categoryData?.name}
      />
    </div>
  );
};

export default AllFindCare;
