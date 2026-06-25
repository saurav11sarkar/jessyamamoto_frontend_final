"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ServiceDay {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

interface BookingProps {
  days: ServiceDay[];
  hourlyRate?: number;
  providerName?: string;
  serviceId?: string;
}

interface BookingRequest {
  serviceId: string;
  day: string;
  date: string;
  time: string;
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
      adminCommission: number;
      providerAmount: number;
    };
  };
}

const Booking = ({ days = [], serviceId = "", hourlyRate }: BookingProps) => {
  const params = useParams();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  const isMember =
    userProfile?.isSubscription === true &&
    userProfile?.subscriptionExpiry &&
    new Date(userProfile.subscriptionExpiry) > new Date();

  const bookingServiceId = serviceId || (params?.id as string);

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
      const [timePart, modifier] = timeStr.split(" ");
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
    const endMinutes = timeToMinutes(endTime);

    // Generate slots every 2 hours
    for (let mins = startMinutes; mins < endMinutes; mins += 120) {
      const hours = Math.floor(mins / 60);
      const minsOfHour = mins % 60;
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
      const daySchedule = days.find((d) => d.day === selectedDayName);

      if (daySchedule) {
        const slots = generateTimeSlots(
          daySchedule.startTime,
          daySchedule.endTime,
        );
        setAvailableTimeSlots(slots);
        setSelectedTime(null);
        setError(null);
      } else {
        setAvailableTimeSlots([]);
        setSelectedTime(null);
      }
    }
  }, [date, days]);

  // Check if selected date is available
  const isDateAvailable = (date: Date): boolean => {
    const dayName = format(date, "EEEE");
    return days.some((d) => d.day === dayName);
  };

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
    if (!date || !selectedTime || !bookingServiceId) {
      setError("Missing required information for booking");
      return;
    }

    const dayName = format(date, "EEEE");
    const daySchedule = days.find((d) => d.day === dayName);

    if (!daySchedule) {
      setError("Invalid schedule selected");
      return;
    }

    const formattedTime = formatTimeForApi(selectedTime);
    const formattedDate = format(date, "yyyy-MM-dd");

    const bookingData: BookingRequest = {
      serviceId: bookingServiceId,
      day: dayName,
      date: formattedDate,
      time: formattedTime,
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
    <div className="p-8 bg-gray-50 border border-gray-200 container rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-[#001f3f]">
        Select Available Time slot
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
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
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-50 flex flex-col items-center w-full max-w-lg">
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
                <div className="grid grid-cols-3 gap-3 w-full">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        disabled={bookingMutation.isPending}
                        className={cn(
                          "py-3 px-2 border rounded-xl text-sm transition-all",
                          selectedTime === time
                            ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                            : "border-gray-200 text-gray-600 hover:border-blue-300",
                          bookingMutation.isPending &&
                            "opacity-50 cursor-not-allowed",
                        )}
                      >
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
                    {isMember ? "12.5%" : "25%"}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      (${(hourlyRate * (isMember ? 0.125 : 0.25)).toFixed(2)})
                    </span>
                  </p>
                  {!isMember && (
                    <p className="text-xs text-primary mt-1">Members pay only 12.5%</p>
                  )}
                </div>
              </div>
            )}
            <Button
              className="text-white px-16 py-7 rounded-full text-lg font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !date ||
                !isDateAvailable(date) ||
                !selectedTime ||
                bookingMutation.isPending
              }
              onClick={handleBookNow}
            >
              {bookingMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Pay Booking Fee & Confirm"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Availability Summary & Payment Info */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Available days: {days.map((d) => d.day).join(", ")}</p>
        {date && isDateAvailable(date) && (
          <p className="mt-1">
            Selected time: {format(date, "MMMM d, yyyy")} at{" "}
            {selectedTime || "not selected"}
          </p>
        )}
      </div>
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-medium text-amber-800">How payment works</p>
        <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>You pay only the Trusted Booking Fee online to confirm your booking.</li>
          <li>The caregiver&apos;s service fee is paid directly to them at the time of service.</li>
          <li>Your booking includes identity verification, secure messaging, reviews, and platform support.</li>
        </ul>
      </div>
    </div>
  );
};

export default Booking;
