import React from "react";

export const BannerSkeleton = () => {
  return (
    <section className="relative bg-[#E6F4FA] flex items-center overflow-hidden py-20 mt-20 animate-pulse">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Content Side Skeleton */}
        <div className="z-10 space-y-6 max-w-xl">
          

          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-12 bg-gray-300 rounded-lg w-3/4" />
            <div className="h-12 bg-gray-300 rounded-lg w-2/3" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-11/12" />
            <div className="h-4 bg-gray-300 rounded w-4/5" />
          </div>

          {/* Button skeleton */}
          <div className="w-40 h-14 bg-gray-300 rounded-full" />
        </div>

        {/* Right Image Side Skeleton */}
        <div className="relative h-[500px] w-full mt-12 lg:mt-0">
          {/* Main Large Image Skeleton */}
          <div className="absolute top-0 right-0 w-[85%] h-[90%] rounded-[40px] bg-gray-300 shadow-xl z-20" />

          {/* Top-Right Small Image Skeleton */}
          <div className="absolute top-[-20px] right-[-20px] w-[40%] h-[35%] rounded-2xl bg-gray-400 border-[8px] border-[#E6F4FA] shadow-lg z-30" />

          {/* Bottom-Left Small Image Skeleton */}
          <div className="absolute bottom-[-10px] left-[-20px] w-[35%] h-[30%] rounded-2xl bg-gray-400 border-[8px] border-[#E6F4FA] shadow-lg z-30" />
        </div>
      </div>
    </section>
  );
};

export default BannerSkeleton;
