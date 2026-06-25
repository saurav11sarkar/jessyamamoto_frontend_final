"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CareSection = () => {
  return (
    <section className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center font-sans pb-16">
      {/* Left Content Column */}
      <div className="space-y-10">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0A1D37] leading-tight">
          Find care on your terms
        </h2>

        <div className="space-y-8">
          <p className="text-[#4A4A4A] text-lg leading-relaxed">
            JetSet Cares is for trusted professionals who want to be part of a
            platform built around quality, reliability, and meaningful human
            support.
          </p>
        </div>

        <Link href={`/login`}>
          <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold transition-all group mt-4">
            Get Started
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CareSection;
