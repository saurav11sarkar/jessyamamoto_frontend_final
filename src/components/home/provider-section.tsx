"use client";
import React from "react";
import { Button } from "../ui/button";
import { Shield, Star, Heart, Clock } from "lucide-react";
import Link from "next/link";

const ProviderSection = () => {
  const trustItems = [
    {
      label: "Family Recommended",
      description: "Trusted by families already receiving care.",
      Icon: Star,
    },
    {
      label: "ID Verified",
      description: "Profiles are reviewed before going live.",
      Icon: Shield,
    },
    {
      label: "Background Checked",
      description: "Built around safety and professional standards.",
      Icon: Heart,
    },
    {
      label: "Reliable and Responsive",
      description: "Clear communication families can count on.",
      Icon: Clock,
    },
  ];

  return (
    <section className="bg-[#FDF7F4] py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <span className="inline-flex rounded-full border border-[#40E0D0]/30 bg-white px-4 py-2 text-sm font-semibold text-[#238F86] shadow-sm">
              Partner with JetSet Cares
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#0A2B3E] sm:text-4xl lg:text-5xl">
              Become a JetSet Care Partner
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              JetSet Cares welcomes trusted childcare and pet care
              professionals who are warm, reliable, well presented, responsive,
              and recommended by the families they already support.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              If you bring real experience, references, and care families can
              trust, we would love to help you grow with a platform built on
              safety, professionalism, and strong family experiences.
            </p>

            <div className="mt-8">
              <Link href="/signup">
                <Button className="h-12 rounded-full bg-[#40E0D0] px-8 text-sm font-bold text-slate-950 shadow-[0_14px_30px_rgba(64,224,208,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#2CB0A0]">
                  Apply as a JetSet Care Partner
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map(({ label, description, Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#E8DDD8] bg-white/90 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#40E0D0]/12 text-[#238F86]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderSection;
