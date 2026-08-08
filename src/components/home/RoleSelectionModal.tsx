/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modals/RoleSelectionModal.tsx
"use client";

import { Heart, MoveRight, ShieldCheck, Sparkles, Users, X } from "lucide-react";
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
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(242,250,249,0.96))] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
          aria-label="Close modal"
        >
          <X size={18} />
          <span className="hidden sm:inline">Close</span>
        </button>

        <div className="p-5 pt-12 md:p-8 md:pt-10">
          <div className="mx-auto max-w-2xl text-center">
            <Image
              src="/jetset-logo.webp"
              alt="JetSet Cares"
              width={170}
              height={105}
              className="mx-auto h-24 w-auto object-contain"
            />
            <h2 className="text-3xl font-extrabold leading-tight text-[#0A0A23] md:text-5xl">
              Let&apos;s get started.
            </h2>
            <p className="mt-1 text-2xl font-extrabold leading-tight text-[#129d9a] md:text-5xl">
              Choose an option:
            </p>
            <p className="mt-3 text-sm text-[#3B3B4F] md:text-base">
              Select your role
            </p>
          </div>

          <div className="mt-8 grid w-full gap-6 md:grid-cols-2">
            {/* Card 1 - Looking for job */}
            <div className="flex-1 relative">
              <button
                onClick={handleFindJob}
                className="group relative flex h-full min-h-[500px] w-full flex-col overflow-hidden rounded-[1.5rem] border border-[#91e8e1] bg-white text-left shadow-[0_18px_50px_rgba(20,157,144,0.13)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(20,157,144,0.20)]"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#fff3e6] md:h-64">
                  <Image
                    src="/partner-role-card.png"
                    alt="Professional childcare partner"
                    fill
                    sizes="(min-width: 768px) 460px, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: "center 38%" }}
                  />
                  <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffd7ac] bg-white/92 text-[#ff7a1a] shadow-[0_10px_28px_rgba(255,122,26,0.18)] backdrop-blur">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                </div>
                <div className="relative flex flex-1 flex-col px-6 pb-6 pt-11">
                  <div className="absolute left-1/2 top-0 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white bg-white text-[#36d9cc] shadow-[0_10px_30px_rgba(20,157,144,0.20)]">
                    <Users className="h-9 w-9" />
                  </div>
                  <p className="mb-2 text-center text-base font-medium text-[#6b7280]">
                    I want to
                  </p>
                  <h3 className="mx-auto mb-4 max-w-xs text-center text-2xl font-extrabold leading-snug text-[#21cfc1]">
                    Apply to Become a Premium Partner
                  </h3>
                  <div className="mb-4 h-px w-full bg-slate-200" />
                  <p className="mx-auto mb-7 min-h-[3.5rem] max-w-sm text-center text-base leading-7 text-[#4B5563]">
                    Offer your {categoryName.toLowerCase()} services to trusted families and grow your business with JetSet.
                  </p>
                  <div className="mt-auto flex items-center justify-between rounded-full bg-[#ff781f] px-6 py-4 text-lg font-extrabold text-white shadow-[inset_-48px_0_0_rgba(255,255,255,0.16)]">
                    <span>Apply Now</span>
                    <MoveRight className="h-6 w-6" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-extrabold leading-tight text-[#23bfb4] sm:text-sm">
                    <span className="flex min-h-12 items-center gap-2 rounded-2xl bg-[#effdfa] px-3 py-2">
                      <ShieldCheck className="h-5 w-5 shrink-0" />
                      Verified & Background-Checked
                    </span>
                    <span className="flex min-h-12 items-center gap-2 rounded-2xl bg-[#effdfa] px-3 py-2">
                      <Sparkles className="h-5 w-5 shrink-0" />
                      More Booking Opportunities
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Card 2 - Looking for caregiver */}
            <div className="flex-1 relative">
              <button
                onClick={handleFindCare}
                className="group relative flex h-full min-h-[500px] w-full flex-col overflow-hidden rounded-[1.5rem] border border-[#91e8e1] bg-white text-left shadow-[0_18px_50px_rgba(20,157,144,0.13)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(20,157,144,0.20)]"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#e9fbf8] md:h-64">
                  <Image
                    src="/parent-role-card.png"
                    alt="Trusted caregiver with children"
                    fill
                    sizes="(min-width: 768px) 460px, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: "center 44%" }}
                  />
                  <div className="absolute left-4 top-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9cebe5] bg-white/92 text-[#129d9a] shadow-[0_10px_28px_rgba(20,157,144,0.18)] backdrop-blur">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                </div>
                <div className="relative flex flex-1 flex-col px-6 pb-6 pt-11">
                  <div className="absolute left-1/2 top-0 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white bg-white text-[#36d9cc] shadow-[0_10px_30px_rgba(20,157,144,0.20)]">
                    <Users className="h-9 w-9" />
                  </div>
                  <p className="mb-2 text-center text-base font-medium text-[#6b7280]">
                    I want to
                  </p>
                  <h3 className="mx-auto mb-4 max-w-xs text-center text-2xl font-extrabold leading-snug text-[#21cfc1]">
                    Find Trusted Care
                  </h3>
                  <div className="mb-4 h-px w-full bg-slate-200" />
                  <p className="mx-auto mb-7 min-h-[3.5rem] max-w-sm text-center text-base leading-7 text-[#4B5563]">
                    Discover verified {categoryName.toLowerCase()} and safe, loving care for your little ones.
                  </p>
                  <div className="mt-auto flex items-center justify-between rounded-full bg-[#3bd9cc] px-6 py-4 text-lg font-extrabold text-white shadow-[inset_-48px_0_0_rgba(255,255,255,0.16)]">
                    <span>Find Trusted Care</span>
                    <MoveRight className="h-6 w-6" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-extrabold leading-tight text-[#23bfb4] sm:text-sm">
                    <span className="flex min-h-12 items-center gap-2 rounded-2xl bg-[#effdfa] px-3 py-2">
                      <ShieldCheck className="h-5 w-5 shrink-0" />
                      Trusted & Background-Checked
                    </span>
                    <span className="flex min-h-12 items-center gap-2 rounded-2xl bg-[#effdfa] px-3 py-2">
                      <Heart className="h-5 w-5 shrink-0 fill-[#40cfc4]/20" />
                      Safe, Reliable Care
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-9 flex items-center justify-center gap-4 rounded-2xl bg-[#f2fffd] px-5 py-4 text-center text-sm text-[#4B5563] md:text-base">
            <ShieldCheck className="h-9 w-9 shrink-0 text-[#3ee0cf]" />
            <p>
              <span className="font-extrabold text-[#0A0A23]">
                Your family&apos;s safety is our top priority.
              </span>{" "}
              All partners are background-checked and verified.
            </p>
          </div>

          {role && (
            <div className="mt-6 rounded-lg bg-blue-50 p-3">
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
