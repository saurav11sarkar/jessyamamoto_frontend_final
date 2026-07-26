"use client";

import { CalendarCheck2, CheckCircle2, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { toast } from "sonner"; // অথবা আপনার পছন্দের কোনো টোস্ট লাইব্রেরি

interface ServiceDay {
  day: string;
  startTime: string;
  endTime: string;
  _id?: string;
}

interface ProfileHeroProps {
  userId: string;
  name: string;
  location: string;
  hourlyRate: number;
  hideRate?: boolean;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  isVerified?: boolean;
  days?: ServiceDay[];
  bookingSectionId?: string;
}

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatTimeLabel = (time: string) => {
  const [hourStr, minuteStr = "00"] = (time || "").split(":");
  const hour = Number(hourStr);
  if (Number.isNaN(hour)) return time;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr.padStart(2, "0")} ${period}`;
};

const getNextAvailability = (days: ServiceDay[]) => {
  if (!days.length) return null;

  const normalizedDay = (day: string) =>
    WEEK_DAYS.find((w) => w.toLowerCase().startsWith(day.trim().toLowerCase().slice(0, 3))) ||
    day;

  const todayIndex = new Date().getDay();

  for (let offset = 0; offset < 7; offset += 1) {
    const dayIndex = (todayIndex + offset) % 7;
    const dayName = WEEK_DAYS[dayIndex];
    const matches = days
      .filter((d) => normalizedDay(d.day) === dayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (matches.length > 0) {
      const label = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : dayName;
      return `Available ${label} from ${formatTimeLabel(matches[0].startTime)}`;
    }
  }

  return null;
};

export function ProfileHero({
  userId,
  name,
  location,
  hourlyRate,
  hideRate = false,
  rating,
  reviewCount,
  profileImage,
  isVerified = false,
  days = [],
  bookingSectionId = "booking-section",
}: ProfileHeroProps) {
  const router = useRouter();
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // কনভারসেশন তৈরি করার ফাংশন
  const handleJoinToConnect = async () => {
    if (!token) {
      toast.error("Please login first to connect.");
      return;
    }

    if (!userId) {
      toast.error("Unable to find this user's profile.");
      return;
    }

    setLoading(true);
    try {
      // এপিআই কল করে কনভারসেশন শুরু করা
      const res = await fetch(`${baseUrl}/conversation/${userId}`, {
        method: "POST", // আপনার এপিআই অনুযায়ী মেথড চেক করে নিন (সাধারণত POST হয়)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        // কনভারসেশন আইডি দিয়ে মেসেজ পেজে পাঠিয়ে দেওয়া
        router.push(`/profile/messages/${result.data._id}`);
      } else {
        toast.error(result.message || "Failed to start conversation");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const nextAvailability = useMemo(() => getNextAvailability(days), [days]);

  const handleRequestToBook = () => {
    document
      .getElementById(bookingSectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#BDE3F9] py-10">
      <div className="container flex flex-col gap-8 rounded-none w-full lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-8">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage
              src={profileImage || "/default-avatar.jpg"}
              className="object-cover"
              alt={name}
            />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#001F3F]">{name}</h1>
              {isVerified && (
                <CheckCircle2 className="h-7 w-7 fill-green-600 text-white" />
              )}
            </div>
            <p className="font-medium text-slate-600">{location}</p>
            {!hideRate && hourlyRate > 0 && (
              <p className="text-blue-700 font-bold italic">
                Partner rate: ${hourlyRate} per hour
              </p>
            )}
            <div className="flex items-center gap-1 pt-1">
              <span className="font-bold text-slate-900">{rating}</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-slate-500 font-medium">
                ({reviewCount})
              </span>
            </div>
            {nextAvailability && (
              <div className="flex items-center gap-1.5 pt-1 text-sm font-semibold text-emerald-700">
                <CalendarCheck2 className="h-4 w-4" />
                <span>{nextAvailability}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <Button
            onClick={handleRequestToBook}
            className="bg-primary hover:bg-primary text-white rounded-full font-bold shadow-lg transition-transform active:scale-95 px-8"
          >
            Request to Book
          </Button>
          <Button
            onClick={handleJoinToConnect}
            disabled={loading}
            variant="outline"
            className="rounded-full font-bold border-primary text-primary hover:bg-primary/10 px-8"
          >
            {loading ? "Connecting..." : "Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}
