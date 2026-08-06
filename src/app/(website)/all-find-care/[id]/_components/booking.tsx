"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  MessageCircle,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ServiceDay {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

interface BlockedDate {
  date: string;
  reason?: string;
}

interface BookingProps {
  days: ServiceDay[];
  hourlyRate?: number;
  providerName?: string;
  providerUserId?: string;
  serviceId?: string;
  serviceName?: string;
  minAdvanceNoticeHours?: number;
  maxBookingHorizonDays?: number;
  blockedDates?: BlockedDate[];
}

interface BookingRequest {
  serviceId: string;
  day: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  bookingMode: "request" | "instant";
  hotelName?: string;
  location?: string;
  childCount?: number;
  childAges?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  medicalNotes?: string;
  instructions?: string;
  timezone?: string;
  idempotencyKey?: string;
}

interface BookingResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    booking: {
      _id: string;
      userId: string;
      serviceId: string;
      categoryId: {
        _id: string;
        name: string;
      };
      day: string;
      date: string;
      time: string;
      status: string;
      location: string;
    };
    checkoutUrl: string;
    sessionId: string;
    paymentDetails: {
      totalAmount: number;
      trustedBookingFee: number;
      payPartnerLater: number;
      bookingFeePercent: number;
      bookingFeeMinimum: number;
      serviceSubtotal: number;
    };
  };
}

interface SubscriptionPlan {
  _id: string;
  type: string;
  title: string;
  price: number;
  bookingFeePercent?: number;
  bookingFeeMinimum?: number;
}

interface PricingPreview {
  hourlyRate: number;
  durationHours: number;
  serviceSubtotal: number;
  bookingFeePercent: number;
  bookingFeeMinimum: number;
  trustedBookingFee: number;
  membershipType: string;
  membershipPrice: number;
  nonMemberBookingFeePercent: number;
  nonMemberBookingFeeMinimum: number;
  nonMemberTrustedBookingFee: number;
}

const Booking = ({
  days = [],
  serviceId = "",
  serviceName = "Care Service",
  hourlyRate,
  providerUserId = "",
  minAdvanceNoticeHours = 0,
  maxBookingHorizonDays = 90,
  blockedDates = [],
}: BookingProps) => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [bookingMode, setBookingMode] = useState<"request" | "instant">(
    "request",
  );
  const [hotelName, setHotelName] = useState("");
  const [bookingLocation, setBookingLocation] = useState("");
  const [childCount, setChildCount] = useState(1);
  const [childAges, setChildAges] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [instructions, setInstructions] = useState("");

  const normalizeDay = (day: string) => {
    const dayMap: Record<string, string> = {
      sun: "Sunday",
      sunday: "Sunday",
      mon: "Monday",
      monday: "Monday",
      tue: "Tuesday",
      tues: "Tuesday",
      tuesday: "Tuesday",
      wed: "Wednesday",
      wednesday: "Wednesday",
      thu: "Thursday",
      thur: "Thursday",
      thurs: "Thursday",
      thursday: "Thursday",
      fri: "Friday",
      friday: "Friday",
      sat: "Saturday",
      saturday: "Saturday",
    };
    return dayMap[day.trim().toLowerCase()] || day;
  };

  const { data: userProfile } = useQuery({
    queryKey: ["userProfileBooking"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  const { data: subscriptionPlans } = useQuery<{ data: SubscriptionPlan[] }>({
    queryKey: ["bookingMembershipPlans"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription?limit=20`,
      );
      if (!res.ok) throw new Error("Failed to load membership plans");
      return res.json();
    },
  });

  const isMember =
    userProfile?.isSubscription === true &&
    userProfile?.subscriptionExpiry &&
    new Date(userProfile.subscriptionExpiry) > new Date();

  const cheapestPaidPlan = (subscriptionPlans?.data || []).find(
    (plan) => plan.type !== "free",
  );

  const bookingServiceId = serviceId || (params?.id as string);

  const handleMessagePartner = async () => {
    if (!token) {
      setError("Please login first to message this partner.");
      return;
    }
    if (!providerUserId) {
      setError("Unable to find this partner for messaging.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversation/${providerUserId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result?.message || "Failed to start conversation");
      }
      router.push(`/profile/messages/${result.data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to message partner");
    }
  };

  const selectedDurationHours = React.useMemo(() => {
    if (!selectedTime || !selectedEndTime) return 1;
    const startIndex = availableTimeSlots.indexOf(selectedTime);
    const endIndex = availableTimeSlots.indexOf(selectedEndTime);
    return Math.max(endIndex - startIndex, 1);
  }, [availableTimeSlots, selectedEndTime, selectedTime]);

  const previewServiceSubtotal = Number(
    ((hourlyRate || 0) * selectedDurationHours).toFixed(2),
  );

  // Fee preview is computed server-side (same code path as the real Stripe checkout, including
  // any city/category overrides an admin has set), so this can never drift from what's actually
  // charged — the frontend just displays whatever the backend returns.
  const { data: pricingPreview } = useQuery<{ data: PricingPreview }>({
    queryKey: ["bookingPricingPreview", bookingServiceId, selectedDurationHours, token],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/pricing-preview?serviceId=${bookingServiceId}&durationHours=${selectedDurationHours}`,
        { headers },
      );
      if (!res.ok) throw new Error("Failed to load pricing preview");
      return res.json();
    },
    enabled: !!bookingServiceId,
  });

  const previewFeePercent = pricingPreview?.data?.bookingFeePercent ?? (isMember ? 12.5 : 25);
  const previewFeeMinimum = pricingPreview?.data?.bookingFeeMinimum ?? (isMember ? 3 : 5);
  const previewTrustedFee =
    pricingPreview?.data?.trustedBookingFee ??
    Number(
      Math.max(
        previewServiceSubtotal * (previewFeePercent / 100),
        previewFeeMinimum,
      ).toFixed(2),
    );
  const nonMemberFeePercent = pricingPreview?.data?.nonMemberBookingFeePercent ?? 25;
  const nonMemberFeeMinimum = pricingPreview?.data?.nonMemberBookingFeeMinimum ?? 5;
  const nonMemberPreviewFee =
    pricingPreview?.data?.nonMemberTrustedBookingFee ??
    Number(
      Math.max(
        previewServiceSubtotal * (nonMemberFeePercent / 100),
        nonMemberFeeMinimum,
      ).toFixed(2),
    );
  const paidPlans = (subscriptionPlans?.data || []).filter((plan) =>
    ["monthly", "6month", "quarterly", "annual", "yearly"].includes(plan.type),
  );

  const selectedDateLabel = date
    ? format(date, "EEEE, MMMM d, yyyy")
    : "Select a date";
  const selectedWindowLabel =
    selectedTime && selectedEndTime
      ? `${selectedTime} - ${selectedEndTime} (${selectedDurationHours} hour${
          selectedDurationHours === 1 ? "" : "s"
        })`
      : "Select a start and end time";
  const nonMemberSavings = Math.max(nonMemberPreviewFee - previewTrustedFee, 0);

  const getPlanPeriod = (type: string) => {
    if (type === "monthly") return "/month";
    if (type === "6month" || type === "quarterly") return "/6 months";
    if (type === "annual" || type === "yearly") return "/year";
    return "";
  };

  const getPlanCta = (type: string) => {
    if (type === "monthly") return "Choose Monthly";
    if (type === "6month" || type === "quarterly") return "Choose 6 Months";
    if (type === "annual" || type === "yearly") return "Choose Annual";
    return "Choose Plan";
  };


  const bookingMutation = useMutation({
    mutationFn: async (bookingData: BookingRequest) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }

      return response.json() as Promise<BookingResponse>;
    },
    onSuccess: (data) => {
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        setError("No checkout URL received");
      }
    },
    onError: (error: Error) => {
      setError(error.message || "An error occurred while booking");
      console.error("Booking error:", error);
    },
  });

  // Get available days for the selected date
  const getAvailableDayFromDate = (selectedDate: Date): string => {
    return format(selectedDate, "EEEE");
  };

  // Generate time slots based on start and end time
  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];

    const timeToMinutes = (timeStr: string): number => {
      const [timePart, modifier = ""] = timeStr.trim().split(" ");
      const [hourStr, minuteStr] = timePart.split(":");
      let hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);
    if (endMinutes <= startMinutes) endMinutes += 24 * 60;

    // Generate hourly slots and include the closing boundary for end time.
    for (let mins = startMinutes; mins <= endMinutes; mins += 60) {
      const normalizedMins = mins % (24 * 60);
      const hours = Math.floor(normalizedMins / 60);
      const minsOfHour = normalizedMins % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

      const timeString = `${displayHours.toString().padStart(2, "0")}:${minsOfHour.toString().padStart(2, "0")} ${period}`;
      slots.push(timeString);
    }

    return slots;
  };

  const formatTimeForApi = (time: string): string => {
    // Input format: "08:00 AM" or "02:30 PM"
    const [timePart, modifier] = time.split(" ");
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = timePart.split(":").map(Number);

    // Convert to 24-hour format (HH:mm)
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    // Return in HH:mm format (24-hour)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Update available time slots when date changes
  useEffect(() => {
    if (date && days.length > 0) {
      const selectedDayName = getAvailableDayFromDate(date);
      const daySchedule = days.find(
        (d) => normalizeDay(d.day) === selectedDayName,
      );

      if (daySchedule) {
        const slots = generateTimeSlots(
          daySchedule.startTime,
          daySchedule.endTime,
        );
        setAvailableTimeSlots(slots);
        setSelectedTime(null);
        setSelectedEndTime(null);
        setError(null);
      } else {
        setAvailableTimeSlots([]);
        setSelectedTime(null);
        setSelectedEndTime(null);
      }
    }
  }, [date, days]);

  // Check if selected date is available
  const isDateAvailable = (date: Date): boolean => {
    const dayName = format(date, "EEEE");
    if (!days.some((d) => normalizeDay(d.day) === dayName)) return false;

    // Past calendar days are never bookable, regardless of minAdvanceNoticeHours.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (date < startOfToday) return false;

    const hoursUntil = (date.getTime() - Date.now()) / (1000 * 60 * 60);
    if (minAdvanceNoticeHours > 0 && hoursUntil < minAdvanceNoticeHours) {
      return false;
    }
    if (maxBookingHorizonDays > 0 && hoursUntil > maxBookingHorizonDays * 24) {
      return false;
    }

    const dateKey = format(date, "yyyy-MM-dd");
    if (blockedDates.some((b) => b.date === dateKey)) return false;

    return true;
  };

  const requestDisabledReason = !date
    ? "Select a date and time slot to continue."
    : !isDateAvailable(date)
      ? "This date is not available."
      : !selectedTime || !selectedEndTime
        ? "Select a start and end time slot to continue."
        : !hotelName.trim() || !bookingLocation.trim()
          ? "Add hotel/stay name and service address before checkout."
          : !emergencyContactName.trim() || !emergencyContactPhone.trim()
            ? "Add emergency contact details before checkout."
            : "";

  // Handle week navigation
  const goToPreviousWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 7);
      setDate(newDate);
    }
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1);
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 7);
      setDate(newDate);
    }
  };

  // Handle booking
  const handleBookNow = () => {
    if (!date || !selectedTime || !selectedEndTime || !bookingServiceId) {
      setError("Missing required information for booking");
      return;
    }

    const dayName = format(date, "EEEE");
    const daySchedule = days.find((d) => normalizeDay(d.day) === dayName);

    if (!daySchedule) {
      setError("Invalid schedule selected");
      return;
    }

    const formattedTime = formatTimeForApi(selectedTime);
    const formattedEndTime = formatTimeForApi(selectedEndTime);
    const formattedDate = format(date, "yyyy-MM-dd");
    const startIndex = availableTimeSlots.indexOf(selectedTime);
    const endIndex = availableTimeSlots.indexOf(selectedEndTime);

    if (endIndex <= startIndex) {
      setError("Please choose an end time after the start time");
      return;
    }

    if (
      !hotelName.trim() ||
      !bookingLocation.trim() ||
      !emergencyContactName.trim() ||
      !emergencyContactPhone.trim()
    ) {
      setError(
        "Please add hotel/location and emergency contact details before checkout",
      );
      return;
    }

    const endDate = new Date(date);
    if (
      selectedEndTime.includes("AM") &&
      selectedTime.includes("PM") &&
      endIndex > startIndex
    ) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const bookingData: BookingRequest = {
      serviceId: bookingServiceId,
      day: dayName,
      date: formattedDate,
      time: formattedTime,
      endDate: format(endDate, "yyyy-MM-dd"),
      endTime: formattedEndTime,
      bookingMode,
      hotelName,
      location: bookingLocation,
      childCount,
      childAges: childAges
        .split(",")
        .map((age) => age.trim())
        .filter(Boolean),
      emergencyContactName,
      emergencyContactPhone,
      allergies,
      medicalNotes,
      instructions,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      idempotencyKey: `${bookingServiceId}-${formattedDate}-${formattedTime}-${formattedEndTime}`,
    };

    bookingMutation.mutate(bookingData);
  };

  if (!days || days.length === 0) {
    return (
      <div className="p-8 bg-gray-50 border border-gray-200 container rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-[#001f3f]">
          Select Available Time slot
        </h2>
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-10 text-center text-gray-500">
            No availability information available
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 border border-gray-200 container rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-[#001f3f]">
        Select Available Time slot
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Your Booking Details
            </h3>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Tag className="h-4 w-4 text-slate-500" />
              <span className="text-slate-500">Service</span>
              <span className="ml-auto font-semibold text-slate-900">
                {serviceName}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <span className="text-slate-500">Date & Time</span>
              <span className="ml-auto text-right font-semibold text-slate-900">
                {selectedDateLabel}
                <br />
                {selectedWindowLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Info className="h-4 w-4 text-slate-500" />
              <span className="text-slate-500">Partner Rate</span>
              <span className="ml-auto font-semibold text-slate-900">
                ${hourlyRate || 0} per hour
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Info className="h-4 w-4 text-slate-500" />
              <span className="text-slate-500">Service Total</span>
              <span className="ml-auto font-semibold text-slate-900">
                ${previewServiceSubtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Payment Summary
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Service Total</span>
              <span className="font-semibold">${previewServiceSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {isMember ? "Member" : "Non-Member"} Trusted Platform Fee (
                {previewFeePercent}%)
              </span>
              <span className="font-semibold">${previewTrustedFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between rounded-xl bg-teal-50 px-4 py-3 font-bold text-teal-700">
              <span>Pay Online Today (Trusted Platform Fee)</span>
              <span>${previewTrustedFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pay Partner at Time of Service</span>
              <span className="font-semibold">${previewServiceSubtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              The partner&apos;s service fee is paid directly to the partner in
              local currency at the time of service.
            </p>
            <div className="flex items-start gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">
              <Tag className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                JetSet members pay 12.5% instead of 25%
                {nonMemberSavings > 0
                  ? ` and save $${nonMemberSavings.toFixed(2)} on this booking.`
                  : "."}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Date Picker */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-50">
            <Calendar
              mode="single"
              required={true}
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
              classNames={{
                day_selected:
                  "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600",
                head_cell: "text-gray-500 font-normal text-[0.8rem]",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full",
              }}
              modifiers={{
                available: isDateAvailable,
              }}
              modifiersClassNames={{
                available: "bg-green-50 text-green-700 font-medium",
              }}
              disabled={(date) => !isDateAvailable(date)}
            />
          </div>

          {/* Middle: Time Slots */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-8 border border-gray-50 flex flex-col items-center w-full max-w-lg">
            <p className="text-gray-400 text-sm mb-1">Available Time for</p>
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">
              {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
            </h3>

            {date && !isDateAvailable(date) ? (
              <div className="text-center text-red-500 py-4">
                No availability for this day
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!selectedTime || selectedEndTime) {
                            setSelectedTime(time);
                            setSelectedEndTime(null);
                            return;
                          }
                          setSelectedEndTime(time);
                        }}
                        disabled={bookingMutation.isPending}
                        className={cn(
                          "py-3 px-2 border rounded-xl text-sm transition-all",
                          selectedTime === time || selectedEndTime === time
                            ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                            : "border-gray-200 text-gray-600 hover:border-blue-300",
                          bookingMutation.isPending &&
                            "opacity-50 cursor-not-allowed",
                        )}
                      >
                        {selectedTime === time
                          ? "Start "
                          : selectedEndTime === time
                            ? "End "
                            : ""}
                        {time}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-gray-500 py-4">
                      No time slots available
                    </div>
                  )}
                </div>

                <div className="flex justify-between w-full mt-6">
                  <ChevronLeft
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={goToPreviousWeek}
                  />
                  <span className="text-sm text-gray-500">
                    Week {currentWeekOffset + 1}
                  </span>
                  <ChevronRight
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={goToNextWeek}
                  />
                </div>
              </>
            )}
          </div>

          {/* Right: Action Button & Fee Info */}
          <div className="flex-1 flex flex-col items-center gap-4 w-full">
            {hourlyRate && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 w-full max-w-xs text-center">
                <p className="text-sm text-gray-500 mb-1">Caregiver Rate</p>
                <p className="text-2xl font-bold text-gray-800">${hourlyRate}/hr</p>
                <p className="text-xs text-gray-400 mt-1">Paid directly to caregiver</p>
                <div className="border-t border-blue-100 mt-3 pt-3">
                  <p className="text-sm text-gray-500 mb-1">Trusted Booking Fee</p>
                  <p className="text-lg font-semibold text-primary">
                    {previewFeePercent}%
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      (${previewTrustedFee.toFixed(2)} minimum ${previewFeeMinimum.toFixed(2)})
                    </span>
                  </p>
                  {!isMember && (
                    <p className="text-xs text-primary mt-1">
                      Members pay {cheapestPaidPlan?.bookingFeePercent ?? 12.5}
                      % with a $
                      {(cheapestPaidPlan?.bookingFeeMinimum ?? 3).toFixed(2)}{" "}
                      minimum
                    </p>
                  )}
                </div>
                <div className="border-t border-blue-100 mt-3 pt-3 text-left text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Pay now</span>
                    <span className="font-semibold">${previewTrustedFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pay partner later</span>
                    <span className="font-semibold">${previewServiceSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setBookingMode("request")}
                  className={cn(
                    "rounded-md px-3 py-2 font-medium",
                    bookingMode === "request"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500",
                  )}
                >
                  Request
                </button>
                <button
                  type="button"
                  onClick={() => setBookingMode("instant")}
                  className={cn(
                    "rounded-md px-3 py-2 font-medium",
                    bookingMode === "instant"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500",
                  )}
                >
                  Instant
                </button>
              </div>
              <input
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Hotel / stay name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={bookingLocation}
                onChange={(e) => setBookingLocation(e.target.value)}
                placeholder="Service address / room details"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="grid grid-cols-[90px_1fr] gap-2">
                <input
                  type="number"
                  min={1}
                  value={childCount}
                  onChange={(e) => setChildCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  value={childAges}
                  onChange={(e) => setChildAges(e.target.value)}
                  placeholder="Child ages, comma separated"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <input
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Emergency contact name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="Emergency contact phone"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Allergies"
                className="min-h-[70px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Medical notes"
                className="min-h-[70px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions"
                className="min-h-[70px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <Button
              className="text-white px-16 py-7 rounded-full text-lg font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !!requestDisabledReason || bookingMutation.isPending
              }
              title={requestDisabledReason || "Pay trusted platform fee and send request"}
              onClick={handleBookNow}
            >
              {bookingMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                bookingMode === "request"
                  ? (
                    <span className="inline-flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Pay Trusted Platform Fee & Send Request
                    </span>
                  )
                  : "Pay Booking Fee & Confirm"
              )}
            </Button>
            {requestDisabledReason && (
              <p className="max-w-xs text-center text-xs text-slate-500">
                {requestDisabledReason}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full max-w-xs rounded-full border-slate-200 bg-white"
              onClick={handleMessagePartner}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Partner
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isMember && paidPlans.length > 0 && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-5">
          <div className="mb-4">
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                3
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
              Membership savings for this booking
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              Members reduce their Trusted Platform Fee from 25% to 12.5%.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {paidPlans.map((plan) => {
              const memberPercent = plan.bookingFeePercent ?? 12.5;
              const memberMinimum = plan.bookingFeeMinimum ?? 3;
              const memberFee = Number(
                Math.max(
                  previewServiceSubtotal * (memberPercent / 100),
                  memberMinimum,
                ).toFixed(2),
              );
              const savings = Math.max(nonMemberPreviewFee - memberFee, 0);
              const breakEven =
                savings > 0 ? Math.ceil(plan.price / savings) : null;
              return (
                <div
                  key={plan._id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{plan.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    ${plan.price} {getPlanPeriod(plan.type)}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    Save ${savings.toFixed(2)} on this booking
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {memberPercent}% fee, ${memberMinimum.toFixed(2)} minimum
                  </p>
                  {breakEven && (
                    <p className="mt-2 text-xs text-slate-500">
                      Break-even after about {breakEven} similar booking
                      {breakEven === 1 ? "" : "s"}.
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {getPlanCta(plan.type)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Availability Summary & Payment Info */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Available days: {days.map((d) => normalizeDay(d.day)).join(", ")}</p>
        {date && isDateAvailable(date) && (
          <p className="mt-1">
            Selected time: {format(date, "MMMM d, yyyy")} from{" "}
            {selectedTime || "not selected"} to{" "}
            {selectedEndTime || "not selected"}
          </p>
        )}
      </div>
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-medium text-amber-800">How payment works</p>
        <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>You pay only the Trusted Platform Fee online. Request bookings confirm after partner acceptance.</li>
          <li>The caregiver&apos;s service fee is paid directly to them at the time of service.</li>
          <li>Pay directly to the partner in local currency at the time of service.</li>
          <li>More than a booking: the fee supports verification, platform safety, and support; it is not a charitable donation.</li>
          <li>Your booking includes identity verification, secure messaging, reviews, and platform support.</li>
        </ul>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
        <span>
          Secure payment. Your booking request is sent after payment
          authorization. Booking is confirmed when the partner accepts.
        </span>
      </div>
    </div>
  );
};

export default Booking;
