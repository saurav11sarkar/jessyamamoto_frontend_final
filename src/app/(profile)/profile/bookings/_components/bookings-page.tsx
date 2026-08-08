"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CalendarDays,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  userId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        profileImage?: string;
        role?: string;
      };
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
  endDate?: string;
  endTime?: string;
  status: string;
  bookingMode?: string;
  location?: string;
  hotelName?: string;
  childCount?: number;
  childAges?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  medicalNotes?: string;
  instructions?: string;
  disputeReason?: string;
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
  data: Booking[];
  meta: BookingMeta;
}

type FilterTab = "all" | "upcoming" | "completed" | "cancelled";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  accepted: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  declined: "bg-slate-100 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

const BookingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightedBookingId = searchParams.get("bookingId");
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [changeTimeTarget, setChangeTimeTarget] = useState<Booking | null>(null);
  const [changeTimeDate, setChangeTimeDate] = useState("");
  const [changeTimeStart, setChangeTimeStart] = useState("");
  const [changeTimeEnd, setChangeTimeEnd] = useState("");

  const [reportIssueTarget, setReportIssueTarget] = useState<Booking | null>(null);
  const [disputeReasonInput, setDisputeReasonInput] = useState("");

  const [viewTarget, setViewTarget] = useState<Booking | null>(null);

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

  // Deep-link support: notifications link here with ?bookingId=..., scroll to and
  // briefly highlight the matching card instead of just landing on a generic list.
  React.useEffect(() => {
    if (!highlightedBookingId || !bookingsData) return;
    const el = document.getElementById(`booking-${highlightedBookingId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-primary", "ring-offset-2");
    const timeout = setTimeout(() => {
      el.classList.remove("ring-2", "ring-primary", "ring-offset-2");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [highlightedBookingId, bookingsData]);

  const bookingActionMutation = useMutation({
    mutationFn: async ({
      bookingId,
      status,
      date,
      time,
      endTime,
      disputeReason,
    }: {
      bookingId: string;
      status?:
        | "accepted"
        | "confirmed"
        | "completed"
        | "declined"
        | "cancelled"
        | "no_show"
        | "disputed";
      date?: string;
      time?: string;
      endTime?: string;
      disputeReason?: string;
    }) => {
      if (!token) throw new Error("Not authenticated");

      const isParentCancel = !isPartner && status === "cancelled";
      const actionBody =
        status && !isParentCancel
          ? { status, ...(disputeReason ? { disputeReason } : {}) }
          : date && time
            ? {
                date,
                day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                  weekday: "long",
                }),
                time,
                endTime,
                endDate: date,
              }
            : undefined;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/${bookingId}${
          isParentCancel ? "/cancel" : ""
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: isParentCancel ? undefined : JSON.stringify(actionBody),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update booking");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error: Error) => {
      window.alert(error.message || "Failed to update booking");
    },
  });

  const allBookings = bookingsData?.data || [];
  const meta = bookingsData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  const filteredBookings = allBookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming")
      return booking.status === "pending" || booking.status === "confirmed" || booking.status === "accepted";
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

  const isPartner = userProfile?.role === "find job";

  const isBookingActionPending = (bookingId: string) =>
    bookingActionMutation.isPending &&
    bookingActionMutation.variables?.bookingId === bookingId;

  const handleChangeTime = (booking: Booking) => {
    setChangeTimeTarget(booking);
    setChangeTimeDate(booking.date ? booking.date.slice(0, 10) : "");
    setChangeTimeStart(booking.time || "");
    setChangeTimeEnd(booking.endTime || "");
  };

  const submitChangeTime = () => {
    if (!changeTimeTarget || !changeTimeDate || !changeTimeStart) return;
    bookingActionMutation.mutate({
      bookingId: changeTimeTarget._id,
      date: changeTimeDate,
      time: changeTimeStart,
      endTime: changeTimeEnd || undefined,
    });
    setChangeTimeTarget(null);
  };

  const openReportIssue = (booking: Booking) => {
    setReportIssueTarget(booking);
    setDisputeReasonInput("");
  };

  const submitReportIssue = () => {
    if (!reportIssueTarget || !disputeReasonInput.trim()) return;
    bookingActionMutation.mutate({
      bookingId: reportIssueTarget._id,
      status: "disputed",
      disputeReason: disputeReasonInput.trim(),
    });
    setReportIssueTarget(null);
  };

  const getBookingPartyName = (booking: Booking) => {
    if (isPartner && typeof booking.userId === "object" && booking.userId) {
      return `${booking.userId.firstName || ""} ${booking.userId.lastName || ""}`.trim();
    }
    if (booking.serviceId?.userId?.firstName) {
      return `${booking.serviceId.userId.firstName} ${booking.serviceId.userId.lastName}`;
    }
    return `${booking.serviceId?.firstName || ""} ${booking.serviceId?.lastName || ""}`.trim();
  };

  const getBookingPartyImage = (booking: Booking) => {
    if (isPartner && typeof booking.userId === "object" && booking.userId) {
      return booking.userId.profileImage || "";
    }
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
              {isPartner ? "Service Bookings" : "My Bookings"}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            {isPartner
              ? "See which Parents booked your services"
              : "See the services you booked as a Parent"}
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
              {isPartner
                ? "No one has booked your services yet."
                : "Browse care providers to make your first booking."}
            </p>
            {isPartner ? (
              <Link
                href="/profile/services"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
              >
                View My Services
              </Link>
            ) : (
              <Link
                href="/#categories"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
              >
                Browse Providers
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => {
                const bookingPartyImage = getBookingPartyImage(booking);
                const bookingPartyName = getBookingPartyName(booking);
                const progressPercent =
                  booking.bookingProgress?.totalSteps > 0
                    ? (booking.bookingProgress.step /
                        booking.bookingProgress.totalSteps) *
                      100
                    : 0;

                return (
                  <div
                    key={booking._id}
                    id={`booking-${booking._id}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {bookingPartyImage ? (
                          <Image
                            src={bookingPartyImage}
                            alt={bookingPartyName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-lg">
                            {bookingPartyName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {bookingPartyName}
                            </h3>
                            <p className="text-sm text-primary font-medium">
                              {isPartner ? "Booked by Parent" : booking.categoryId?.name}
                            </p>
                            {isPartner && (
                              <p className="text-xs text-slate-500 mt-1">
                                Service: {booking.categoryId?.name}
                              </p>
                            )}
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
                            <span>
                              {booking.time}
                              {booking.endTime ? ` - ${booking.endTime}` : ""}
                            </span>
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

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setViewTarget(booking)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>

                          {isPartner && booking.status === "pending" && (
                            <button
                              type="button"
                              disabled={isBookingActionPending(booking._id)}
                              onClick={() =>
                                bookingActionMutation.mutate({
                                  bookingId: booking._id,
                                  status: "accepted",
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Accept
                            </button>
                          )}

                          {isPartner && booking.status === "pending" && (
                            <button
                              type="button"
                              disabled={isBookingActionPending(booking._id)}
                              onClick={() =>
                                bookingActionMutation.mutate({
                                  bookingId: booking._id,
                                  status: "declined",
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Decline
                            </button>
                          )}

                          {isPartner && (booking.status === "confirmed" || booking.status === "accepted") && (
                            <button
                              type="button"
                              disabled={isBookingActionPending(booking._id)}
                              onClick={() =>
                                bookingActionMutation.mutate({
                                  bookingId: booking._id,
                                  status: "completed",
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Complete
                            </button>
                          )}

                          {isPartner && (booking.status === "confirmed" || booking.status === "accepted") && (
                            <button
                              type="button"
                              disabled={isBookingActionPending(booking._id)}
                              onClick={() =>
                                bookingActionMutation.mutate({
                                  bookingId: booking._id,
                                  status: "no_show",
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50"
                            >
                              <AlertCircle className="h-4 w-4" />
                              No-show
                            </button>
                          )}

                          {(booking.status === "confirmed" || booking.status === "accepted") && (
                            <button
                              type="button"
                              disabled={isBookingActionPending(booking._id)}
                              onClick={() => openReportIssue(booking)}
                              className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
                            >
                              <AlertCircle className="h-4 w-4" />
                              Report Issue
                            </button>
                          )}

                          {(booking.status === "pending" ||
                            booking.status === "confirmed" ||
                            booking.status === "accepted") && (
                            <>
                              {!isPartner && (
                                <button
                                  type="button"
                                  disabled={isBookingActionPending(booking._id)}
                                  onClick={() => handleChangeTime(booking)}
                                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                                >
                                  <CalendarClock className="h-4 w-4" />
                                  Change Time
                                </button>
                              )}

                            <button
                              type="button"
                              disabled={isBookingActionPending(booking._id)}
                              onClick={() =>
                                bookingActionMutation.mutate({
                                  bookingId: booking._id,
                                  status: "cancelled",
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel
                            </button>
                            </>
                          )}
                        </div>
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

      <Dialog
        open={!!changeTimeTarget}
        onOpenChange={(open) => !open && setChangeTimeTarget(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change booking time</DialogTitle>
            <DialogDescription>
              Propose a new date and time for your booking with{" "}
              {changeTimeTarget ? getBookingPartyName(changeTimeTarget) : ""}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="change-time-date">Date</Label>
              <Input
                id="change-time-date"
                type="date"
                value={changeTimeDate}
                onChange={(e) => setChangeTimeDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="change-time-start">Start time</Label>
                <Input
                  id="change-time-start"
                  type="time"
                  value={changeTimeStart}
                  onChange={(e) => setChangeTimeStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="change-time-end">End time</Label>
                <Input
                  id="change-time-end"
                  type="time"
                  value={changeTimeEnd}
                  onChange={(e) => setChangeTimeEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangeTimeTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!changeTimeDate || !changeTimeStart}
              onClick={submitChangeTime}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!reportIssueTarget}
        onOpenChange={(open) => !open && setReportIssueTarget(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report an issue</DialogTitle>
            <DialogDescription>
              Briefly describe the issue with your booking
              {reportIssueTarget
                ? ` with ${getBookingPartyName(reportIssueTarget)}`
                : ""}
              . JetSet support will follow up.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="dispute-reason">What went wrong?</Label>
            <Textarea
              id="dispute-reason"
              value={disputeReasonInput}
              onChange={(e) => setDisputeReasonInput(e.target.value)}
              placeholder="Describe the issue..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReportIssueTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!disputeReasonInput.trim()}
              onClick={submitReportIssue}
            >
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>
              {viewTarget ? getBookingPartyName(viewTarget) : ""} ·{" "}
              {viewTarget?.categoryId?.name}
            </DialogDescription>
          </DialogHeader>

          {viewTarget && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[viewTarget.status] ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {viewTarget.status}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {viewTarget.bookingMode || "request"} booking
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>
                    {formatDate(viewTarget.date)} ({viewTarget.day})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {viewTarget.time}
                    {viewTarget.endTime ? ` - ${viewTarget.endTime}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>${viewTarget.serviceId?.hourRate?.toFixed(2)}/hr</span>
                </div>
                {viewTarget.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{viewTarget.location}</span>
                  </div>
                )}
              </div>

              {(viewTarget.hotelName ||
                viewTarget.childCount ||
                (viewTarget.childAges && viewTarget.childAges.length > 0)) && (
                <div className="space-y-1.5">
                  <p className="font-semibold text-gray-900">Care details</p>
                  {viewTarget.hotelName && (
                    <p className="text-gray-600">
                      Hotel / stay: {viewTarget.hotelName}
                    </p>
                  )}
                  {viewTarget.childCount !== undefined && (
                    <p className="text-gray-600">
                      Children: {viewTarget.childCount}
                      {viewTarget.childAges && viewTarget.childAges.length > 0
                        ? ` (ages: ${viewTarget.childAges.join(", ")})`
                        : ""}
                    </p>
                  )}
                </div>
              )}

              {(viewTarget.emergencyContactName ||
                viewTarget.emergencyContactPhone) && (
                <div className="space-y-1.5">
                  <p className="font-semibold text-gray-900">
                    Emergency contact
                  </p>
                  <p className="text-gray-600">
                    {viewTarget.emergencyContactName || "-"}
                    {viewTarget.emergencyContactPhone
                      ? ` · ${viewTarget.emergencyContactPhone}`
                      : ""}
                  </p>
                </div>
              )}

              {viewTarget.allergies && (
                <div className="space-y-1.5">
                  <p className="font-semibold text-gray-900">Allergies</p>
                  <p className="text-gray-600">{viewTarget.allergies}</p>
                </div>
              )}

              {viewTarget.medicalNotes && (
                <div className="space-y-1.5">
                  <p className="font-semibold text-gray-900">Medical notes</p>
                  <p className="text-gray-600">{viewTarget.medicalNotes}</p>
                </div>
              )}

              {viewTarget.instructions && (
                <div className="space-y-1.5">
                  <p className="font-semibold text-gray-900">Instructions</p>
                  <p className="text-gray-600">{viewTarget.instructions}</p>
                </div>
              )}

              {viewTarget.disputeReason && (
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
                  <p className="font-semibold text-purple-900">
                    Reported issue
                  </p>
                  <p className="mt-1 text-purple-800">
                    {viewTarget.disputeReason}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setViewTarget(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsPage;
