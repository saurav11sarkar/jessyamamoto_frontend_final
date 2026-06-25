"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  category: string[];
}

interface BookingProgress {
  step: number;
  totalSteps: number;
  label: string;
  status: string;
  isTerminal: boolean;
}

interface Booking {
  _id: string;
  userId: string;
  serviceId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    hourRate: number;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage: string;
      role: string;
    };
  };
  categoryId: {
    _id: string;
    name: string;
  };
  day: string;
  date: string;
  time: string;
  status: string;
  bookingProgress: BookingProgress;
  createdAt: string;
}

interface BookingMeta {
  total: number;
  page: number;
  limit: number;
}

interface BookingResponse {
  success: boolean;
  data: {
    data: Booking[];
    meta: BookingMeta;
  };
}

type FilterTab = "all" | "upcoming" | "completed" | "cancelled";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const BookingsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: userProfile,
    isLoading: profileLoading,
  } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const json = await response.json();
      return json.data;
    },
    enabled: !!token,
  });

  const bookingEndpoint =
    userProfile?.role === "find job"
      ? "/booking/my-service-bookings"
      : "/booking/my-bookings";

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
  } = useQuery<BookingResponse>({
    queryKey: ["myBookings", bookingEndpoint, currentPage],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${bookingEndpoint}?page=${currentPage}&limit=${limit}&sortBy=createdAt&sortOrder=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
    enabled: !!token && !!userProfile,
  });

  const allBookings = bookingsData?.data?.data || [];
  const meta = bookingsData?.data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  const filteredBookings = allBookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming")
      return booking.status === "pending" || booking.status === "accepted";
    if (activeTab === "completed") return booking.status === "completed";
    if (activeTab === "cancelled") return booking.status === "cancelled";
    return true;
  });

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProviderName = (booking: Booking) => {
    if (booking.serviceId?.userId?.firstName) {
      return `${booking.serviceId.userId.firstName} ${booking.serviceId.userId.lastName}`;
    }
    return `${booking.serviceId?.firstName || ""} ${booking.serviceId?.lastName || ""}`.trim();
  };

  const getProviderImage = (booking: Booking) => {
    return booking.serviceId?.userId?.profileImage || "";
  };

  if (profileLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div>
          <div className="mb-8">
            <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Not Authenticated
            </h2>
            <p className="text-gray-500 mb-6">
              Please login to view your bookings
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Bookings
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            View and manage all your bookings
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <CalendarDays className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500 mb-6">
              Browse care providers to make your first booking.
            </p>
            <Link
              href="/#categories"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Browse Providers
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => {
                const providerImage = getProviderImage(booking);
                const providerName = getProviderName(booking);
                const progressPercent =
                  booking.bookingProgress?.totalSteps > 0
                    ? (booking.bookingProgress.step /
                        booking.bookingProgress.totalSteps) *
                      100
                    : 0;

                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {providerImage ? (
                          <Image
                            src={providerImage}
                            alt={providerName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-lg">
                            {providerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {providerName}
                            </h3>
                            <p className="text-sm text-primary font-medium">
                              {booking.categoryId?.name}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                              statusColors[booking.status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(booking.date)}</span>
                            <span className="text-gray-300">|</span>
                            <span>{booking.day}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span>
                              ${booking.serviceId?.hourRate?.toFixed(2)}/hr
                            </span>
                          </div>
                        </div>

                        {booking.bookingProgress && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-gray-500 font-medium">
                                {booking.bookingProgress.label}
                              </span>
                              <span className="text-xs text-gray-400">
                                {booking.bookingProgress.step}/
                                {booking.bookingProgress.totalSteps}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-primary text-white shadow-md"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
