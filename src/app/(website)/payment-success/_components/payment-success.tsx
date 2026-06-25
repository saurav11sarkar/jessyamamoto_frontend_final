"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, LogIn, Crown, Home } from "lucide-react";
import { useSession } from "next-auth/react";

const PaymentSuccess = () => {
  const session = useSession();
  const isLoggedIn = !!session?.data?.user;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-5">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your membership has been activated. You now enjoy reduced Trusted
            Booking Fees on every booking.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Crown className="w-5 h-5" />
              <span>Member Trusted Booking Fee: 12.5%</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              You save 50% compared to the non-member fee of 25%
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Go to Login
            </Link>

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
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-5">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Your membership is now active. Enjoy reduced Trusted Booking Fees on all your bookings.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-primary font-semibold">
            <Crown className="w-5 h-5" />
            <span>You are now a JetSet Member</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Trusted Booking Fee reduced from 25% to 12.5% on every booking
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/#categories"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
          >
            Find Care Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/profile"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
