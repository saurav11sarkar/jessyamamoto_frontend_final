"use client";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { BookOpen, Award, Globe, Play, Pause } from "lucide-react";

const AcademySection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.muted = false;
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#E9E5FF] to-[#D9D0FF] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#9B87F5]/20 rounded-full px-4 py-2">
              <BookOpen className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-[#7C3AED] text-sm font-medium">
                Coming Soon
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-[#1E1B4B] leading-tight">
              JetSet Academy is getting ready for takeoff
            </h2>

            <p className="text-gray-700 text-lg">
              A new learning experience is on the way. JetSet Academy will help
              families build confidence before they travel through language
              lessons, cultural etiquette, and destination based learning.
            </p>

            <p className="text-gray-600">
              Users will also be able to earn badges as they complete lessons
              and prepare more thoughtfully for life across borders.
            </p>

            <Button className="rounded-full h-12 px-10 bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-all shadow-lg hover:shadow-purple-200">
              Coming Soon
            </Button>
          </div>

          {/* Right Side Video & Badges */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] md:max-w-[500px] lg:max-w-[550px]">
              {/* Video Container - Fixed aspect ratio matching video */}
              <div className="relative rounded-3xl md:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-[#b2a5ed] group">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <video
                    ref={videoRef}
                    src="/cat_video.mp4"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    loop
                    playsInline
                  />

                  {/* Play Button Overlay */}
                  {!isPlaying && (
                    <button
                      onClick={handlePlayVideo}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/40 cursor-pointer z-10"
                    >
                      <div className="bg-white/95 hover:bg-white rounded-full p-4 md:p-5 transition-all transform hover:scale-110 shadow-xl">
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-[#7C3AED] fill-[#7C3AED] ml-0.5" />
                      </div>
                    </button>
                  )}

                  {/* Pause button when video is playing */}
                  {isPlaying && (
                    <button
                      onClick={handlePlayVideo}
                      className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-10"
                    >
                      <div className="bg-white rounded-full p-1.5">
                        <Pause className="w-4 h-4 text-[#7C3AED]" />
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Badges */}
              {/* Top Right Badge */}
              <div className="absolute -top-8 -right-4 md:-top-10 md:-right-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-gray-100 z-20 animate-bounce-slow">
                <Award className="w-5 h-5 md:w-7 md:h-7 text-[#F59E0B]" />
              </div>

              {/* Bottom Left Badge */}
              <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-gray-100 z-20 animate-float">
                <Globe className="w-5 h-5 md:w-7 md:h-7 text-[#40E0D0]" />
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#7C3AED]/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0) rotate(8deg);
          }
          50% {
            transform: translateY(-12px) rotate(8deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
          transform: rotate(8deg);
        }

        .animate-float {
          animation: float 3.5s ease-in-out infinite;
          transform: rotate(-5deg);
        }
      `}</style>
    </section>
  );
};

export default AcademySection;
