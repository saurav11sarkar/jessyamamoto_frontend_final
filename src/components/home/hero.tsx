"use client";

import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Star,
  Headphones,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Vetted & Verified",
    description: "Every partner is screened and trusted",
  },
  {
    icon: Star,
    title: "Highly Rated",
    description: "Real reviews from real families",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here whenever you need us",
  },
];

const popularCities = [
  "Bangkok",
  "Bali",
  "Singapore",
  "Siem Reap",
  "Hong Kong",
  "Taipei",
];

const Hero = () => {
  const router = useRouter();

  const handleSearch = () => {
    router.push("/all-find-care");
  };

  const handleCityClick = (cityName: string) => {
    const params = new URLSearchParams({ searchTerm: cityName });
    router.push(`/all-find-care?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 mt-16 lg:mt-0">
      <div className="container relative px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Left Side - Text Content */}
          <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 lg:mx-0">
            <h1 className="text-4xl font-bold leading-tight text-[#0A0A23] sm:text-5xl lg:text-[56px]">
              More than a booking.
              <span className="mt-2 block text-primary">
                Real peace of mind.
              </span>
            </h1>

            <p className="w-full text-base leading-relaxed text-gray-600 sm:text-lg">
              JetSet Cares connects families with trusted childcare, pet care,
              and family support in the places that matter. Safety. Reliability.
              Professionalism. Everywhere in Asia.
            </p>

            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Button
                onClick={handleSearch}
                className="h-12 rounded-full bg-primary px-8 text-base font-semibold text-white shadow-[0_12px_30px_hsl(var(--primary)/0.28)] transition-all hover:opacity-90 sm:flex-1"
              >
                Find Trusted Care
              </Button>
              <Link href={`/signup?role=find%20job`}>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-2 border-primary px-8 text-base font-semibold text-primary transition-all hover:bg-primary/10 sm:flex-1 w-full"
                >
                  Become a Partner
                </Button>
              </Link>
            </div>

            <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {trustPoints.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-5 text-center"
                >
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#0A0A23]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">Popular:</span>
                {popularCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCityClick(c)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - App Mockup Banner */}
          <div className="mx-auto flex w-full max-w-[600px] flex-col items-stretch gap-6 lg:mr-0">
            <div className="flex w-full items-center justify-center">
              <Image
                src="/banner3.png"
                alt="JetSet Cares app preview"
                width={1000}
                height={1000}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
