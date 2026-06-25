"use client";

import React, { useState } from "react";
import { MoveRight, Sparkles, ShieldCheck, Globe2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import RoleSelectionModal from "@/components/home/RoleSelectionModal";

// ─── Types ────────────────────────────────────────────────────────────────
interface Category {
  image: string;
  _id: string;
  name: string;
  findCareUser: string[];
  findJobUser: string[];
}

interface ApiResponse {
  success: boolean;
  data: Category[];
}

// ─── Fetch Function ───────────────────────────────────────────────────────
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
  if (!response.ok) throw new Error("Failed to fetch");
  const json: ApiResponse = await response.json();
  return json.data;
};

export default function CategoriesPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  const isCategoryDisabled = (id: string) =>
    userProfile?.category?.includes(id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] mt-16">
      {/* ─── Hero / Header Section ─── */}
      <section className="relative bg-white border-b border-gray-100 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Discover Professional Care Across Asia</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            More than a booking. <br />
            <span className="text-indigo-600">Real peace of mind.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            JetSet Cares focuses on safety, reliability, and professionalism.
            Whether traveling, relocating, or living abroad, find the confidence
            you need with our trusted provider network.
          </p>

          {/* Stats / Features */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" /> 100% Verified
              Providers
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-500" /> Coverage across Asia
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Grid ─── */}
      <section className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Explore Categories
            </h2>
            <p className="text-slate-500">Select a service to get started</p>
          </div>
          <div className="h-px flex-1 bg-gray-100 mx-8 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100"
                />
              ))
            : categories.map((cat) => {
                const disabled = isCategoryDisabled(cat._id);
                return (
                  <div
                    key={cat._id}
                    onClick={() => !disabled && setSelectedCategory(cat)}
                    className={`group relative bg-white rounded-[2rem] p-3 border border-gray-100 shadow-sm transition-all duration-500 flex flex-col h-full ${
                      disabled
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-[240px] overflow-hidden rounded-[1.5rem] bg-gray-50">
                      <Image
                        src={cat.image || "/placeholder.jpg"}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay for disabled state */}
                      {disabled && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            Already Added
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex items-center justify-between mt-auto">
                      <div>
                        <h3
                          className={`text-xl font-bold transition-colors ${
                            disabled
                              ? "text-slate-400"
                              : "text-slate-900 group-hover:text-primary"
                          }`}
                        >
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          {cat.findCareUser.length + cat.findJobUser.length}{" "}
                          Active Members
                        </p>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          disabled
                            ? "bg-gray-50 text-gray-300"
                            : "bg-primary text-white group-hover:bg-primary "
                        }`}
                      >
                        <MoveRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </section>

      {/* Role Selection Modal */}
      {selectedCategory && (
        <RoleSelectionModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          categoryName={selectedCategory.name}
          categoryId={selectedCategory._id}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}
