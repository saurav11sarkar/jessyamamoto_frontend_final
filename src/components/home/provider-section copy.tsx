"use client";
import React from "react";
import { Button } from "../ui/button";
import { Shield, Star, Heart, Clock } from "lucide-react";

const ProviderSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A2B3E] mb-4">
          Become a JetSet Care Partner
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          JetSet Cares is for trusted childcare and pet care professionals who
          are warm, reliable, well presented, responsive and recommended by the
          families they already support. Whether you care for children, pets, or
          both, we want partners who come with real experience, real references,
          and real trust from the families and little ones already in their
          care. If you want to grow with a platform built on safety,
          professionalism, and strong family experiences, we would love to
          welcome you as a JetSet Care Partner.
        </p>

        {/* ট্রাস্ট ব্যাজেস */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#40E0D0]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-[#40E0D0]" />
            </div>
            <p className="text-sm font-medium">Family Recommended</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#40E0D0]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-[#40E0D0]" />
            </div>
            <p className="text-sm font-medium">ID Verified</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#40E0D0]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-[#40E0D0]" />
            </div>
            <p className="text-sm font-medium">Background Checked</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#40E0D0]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-[#40E0D0]" />
            </div>
            <p className="text-sm font-medium">Reliable and Responsive</p>
          </div>
        </div>

        <div className="hidden sm:block">
          <Button className="rounded-full px-8 h-12 bg-[#40E0D0] hover:bg-[#2CB0A0] text-black">
            Apply as a JetSet Care Partner
          </Button>
        </div>

        <div className="block sm:hidden">
          <Button className="rounded-full px-8 h-12 bg-[#40E0D0] hover:bg-[#2CB0A0] text-black">
            Become a JetSet Care Partner
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProviderSection;
