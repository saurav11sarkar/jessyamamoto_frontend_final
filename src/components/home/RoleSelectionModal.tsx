/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modals/RoleSelectionModal.tsx
"use client";

import { X, Ban } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  categoryId: string;
  userProfile?: any;
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  categoryName,
  categoryId,
  userProfile,
}: RoleSelectionModalProps) {
  const router = useRouter();
  const session = useSession();
  const role = session?.data?.user?.role;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleFindCare = () => {
    // Pass role, category info, and user profile if logged in
    const searchParams = new URLSearchParams({
      role: "find care",
      categoryId,
      categoryName,
    });

    if (userProfile) {
      searchParams.append("userId", userProfile._id);
      searchParams.append(
        "hasSubscription",
        userProfile.isSubscription ? "true" : "false",
      );
    }

    router.push(`/find-care/1?${searchParams.toString()}`);
    onClose();
  };

  const handleFindJob = () => {
    const searchParams = new URLSearchParams({
      role: "find job",
      categoryId,
      categoryName,
    });

    if (userProfile) {
      searchParams.append("userId", userProfile._id);
      searchParams.append(
        "hasSubscription",
        userProfile.isSubscription ? "true" : "false",
      );
    }

    router.push(`/find-job/1?${searchParams.toString()}`);
    onClose();
  };

  const isFindCareDisabled = role === "find job";
  const isFindJobDisabled = role === "find care";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center w-full z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#E6EBF0] rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="p-6 md:p-8 text-center flex flex-col items-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-[#0A0A23] font-bold mb-8 md:mb-10">
            Let&apos;s get started. Choose an option:
          </h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
            {/* Card 1 - Looking for caregiver */}
            <div className="flex-1 relative">
              <button
                onClick={handleFindCare}
                disabled={isFindCareDisabled}
                className="group w-full bg-white p-5 md:p-6 rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed relative overflow-hidden"
              >
                {/* Disabled Overlay */}
                {isFindCareDisabled && (
                  <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                    <Ban className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-xs font-semibold text-red-600 bg-white/90 px-3 py-1 rounded-full">
                      Not Allowed
                    </span>
                    <span className="text-xs text-gray-600 mt-1 px-3 text-center">
                      You are registered as a job seeker
                    </span>
                  </div>
                )}

                <div className="mb-4 w-16 h-16 md:w-20 md:h-20 mx-auto">
                  <Image
                    src="/icon1.png"
                    alt="Caregivers smiling"
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-lg md:text-xl text-left font-semibold mb-2 text-[#0A0A23]">
                  I&apos;m looking for a caregiver
                </h3>
                <p className="text-xs md:text-sm text-left text-[#3B3B4F] mb-4">
                  Start your free search for {categoryName.toLowerCase()} in
                  your area.
                </p>
                <div
                  className={`w-full py-2.5 px-4 text-white text-sm md:text-base rounded-full font-bold transition-colors ${
                    isFindCareDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary group-hover:bg-primary/90"
                  }`}
                >
                  Parent →
                </div>
              </button>
            </div>

            {/* Card 2 - Looking for job */}
            <div className="flex-1 relative">
              <button
                onClick={handleFindJob}
                disabled={isFindJobDisabled}
                className="group w-full bg-white p-5 md:p-6 rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed relative overflow-hidden"
              >
                {/* Disabled Overlay */}
                {isFindJobDisabled && (
                  <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                    <Ban className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-xs font-semibold text-red-600 bg-white/90 px-3 py-1 rounded-full">
                      Not Allowed
                    </span>
                    <span className="text-xs text-gray-600 mt-1 px-3 text-center">
                      You are registered as a care seeker
                    </span>
                  </div>
                )}

                <div className="mb-4 w-16 h-16 md:w-20 md:h-20 mx-auto">
                  <Image
                    src="/icon2.png"
                    alt="Caregiving jobs"
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-lg md:text-xl text-left font-semibold mb-2 text-[#0A0A23]">
                  I&apos;m looking for a caregiving job
                </h3>
                <p className="text-xs md:text-sm text-left text-[#3B3B4F] mb-4">
                  Create a profile and search for {categoryName.toLowerCase()}{" "}
                  jobs.
                </p>
                <div
                  className={`w-full py-2.5 px-4 text-white text-sm md:text-base rounded-full font-bold transition-colors ${
                    isFindJobDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary group-hover:bg-primary/90"
                  }`}
                >
                  Find Trusted Childcare →
                </div>
              </button>
            </div>
          </div>

          {/* Role Info Message */}
          {role && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                {role === "find care" && (
                  <span>
                    ℹ️ You are registered as a care seeker. You can only find
                    caregivers, not apply for jobs.
                  </span>
                )}
                {role === "find job" && (
                  <span>
                    ℹ️ You are registered as a job seeker. You can only apply
                    for jobs, not find caregivers.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
