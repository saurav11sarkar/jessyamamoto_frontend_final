"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, CalendarDays, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const BookingSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

  if (!sessionId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-5">
            <CheckCircle className="text-green-500 w-14 h-14" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Your Trusted Booking Fee has been paid successfully. The care provider
          will be notified and you can track the status in your bookings.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Confirmed
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Trusted Booking Fee</span>
            <span className="text-green-600 font-medium">Paid Successfully</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Reference</span>
            <span className="text-gray-700 font-mono text-xs truncate max-w-[180px]">
              {sessionId.slice(-12)}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-amber-800 mb-1">Next Step</p>
          <p className="text-sm text-amber-700">
            Please pay the caregiver directly at the time of service. The
            caregiver&apos;s rate is shown in your booking details.
          </p>
        </div>

        <div className="space-y-3">
          {session ? (
            <Link
              href="/profile/bookings"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <CalendarDays className="w-5 h-5" />
              View My Bookings
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Login to View Bookings
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
