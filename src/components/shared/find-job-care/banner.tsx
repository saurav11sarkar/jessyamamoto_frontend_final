import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  title?: string;
  description?: string;
  banner?: string[] | string;
}

const Banner = ({ title, description, banner }: BannerProps) => {
  const bannerImage =
    Array.isArray(banner) && banner.length > 0
      ? banner[0]
      : banner || "/placeholder.png";

  const secondImage =
    Array.isArray(banner) && banner.length > 1 ? banner[1] : bannerImage;

  const thirdImage =
    Array.isArray(banner) && banner.length > 2 ? banner[2] : bannerImage;

  return (
    <section className="relative bg-[#E6F4FA] flex items-center overflow-hidden py-20 mt-20">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Content Side */}
        <div className="z-10 space-y-6 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-tight">
            {title}
          </h1>
          <p className="text-[#333333] text-lg leading-relaxed">
            {description}
          </p>

          <Link href="/get-started">
            <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold transition-all group mt-5">
              Get Started
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </Link>
        </div>

        {/* Right Image Side (Overlapping Grid) */}
        <div className="relative h-[500px] w-full mt-12 lg:mt-0">
          {/* Main Large Image */}
          <div className="absolute top-0 right-0 w-[85%] h-[90%] rounded-[40px] overflow-hidden shadow-xl z-20">
            <Image
              src={bannerImage as string}
              alt="Caregivers smiling"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top-Right Small Image */}
          <div className="absolute top-[-20px] right-[-20px] w-[40%] h-[35%] rounded-2xl overflow-hidden border-[8px] border-[#E6F4FA] shadow-lg z-30">
            <Image
              src={secondImage as string}
              alt="Caregiver and senior"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom-Left Small Image */}
          <div className="absolute bottom-[-10px] left-[-20px] w-[35%] h-[30%] rounded-2xl overflow-hidden border-[8px] border-[#E6F4FA] shadow-lg z-30">
            <Image
              src={thirdImage as string}
              alt="Group of caregivers"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
