/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modals/RoleSelectionModal.tsx
"use client";

import { X } from "lucide-react";
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
                className="group w-full bg-white p-5 md:p-6 rounded-xl transition-all duration-200 hover:shadow-lg relative overflow-hidden"
              >
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
                    "bg-primary group-hover:bg-primary/90"
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
                className="group w-full bg-white p-5 md:p-6 rounded-xl transition-all duration-200 hover:shadow-lg relative overflow-hidden"
              >
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
                    "bg-primary group-hover:bg-primary/90"
                  }`}
                >
                  Find Trusted Childcare →
                </div>
              </button>
            </div>
          </div>

          {role && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                You can use the same Jetset Cares account as a Parent and as a
                Partner. Choose the path you want to add or continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
