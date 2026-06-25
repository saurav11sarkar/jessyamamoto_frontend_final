// src/components/home/categories.tsx
"use client";

import { MoveRight, CheckCircle, Lock } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────
interface Category {
  image: string;
  _id: string;
  name: string;
  findCareUser: string[];
  findJobUser: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  image: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Category[];
}

// ─── Fetch Function ───────────────────────────────────────────────────────
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  const json: ApiResponse = await response.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || "Invalid API response format");
  }

  return json.data;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────
const CategorySkeleton = () => (
  <div className="shadow-[0_4px_24px_#0000003D] rounded-xl bg-white animate-pulse overflow-hidden">
    <div className="relative w-full aspect-[4/3] bg-gray-200" />
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-300 rounded" />
        <div className="h-5 w-5 bg-gray-300 rounded-full" />
      </div>
    </div>
  </div>
);

export default function Categories() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addingCategoryId, setAddingCategoryId] = React.useState<string | null>(
    null,
  );

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch user profile if logged in
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) return null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) return null;
      const json = await response.json();
      return json.data;
    },
    enabled: !!token,
  });

  // Check if category is disabled (user already has this category)
  const isCategoryDisabled = (categoryId: string) => {
    if (!userProfile?.category) return false;
    return userProfile.category.includes(categoryId);
  };

  // Get user's categories
  const userCategories = userProfile?.category || [];

  const handleCategoryClick = (category: Category) => {
    if (session?.user?.role === "find job" && token && userProfile) {
      void (async () => {
        setAddingCategoryId(category._id);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/service/register-service`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                role: userProfile.role,
                categoryId: category._id,
                gender: userProfile.gender,
                ...(userProfile.country
                  ? { country: userProfile.country }
                  : {}),
                ...(userProfile.city ? { city: userProfile.city } : {}),
                ...(userProfile.hourRate && userProfile.hourRate > 0
                  ? { hourRate: userProfile.hourRate }
                  : {}),
                subscriptionId: userProfile.subscription || "",
              }),
            },
          );

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Failed to add service");
          }

          toast.success("Service added successfully.");
          await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to add service",
          );
        } finally {
          setAddingCategoryId(null);
        }
      })();
      return;
    }

    const targetUrl = `/all-find-jobs?id=${category._id}`;
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(targetUrl)}`);
      return;
    }
    router.push(targetUrl);
  };

  return (
    <section id="categories">
      <div className="container mx-auto space-y-10">
        <div>
          <h1 className="text-center text-3xl md:text-4xl font-bold tracking-tight lg:max-w-3xl mx-auto opacity-85">
            More than a booking. Real peace of mind.
          </h1>
          <p className="lg:max-w-4xl mx-auto text-md opacity-60 text-center mt-2">
            JetSet Cares was built for families who need trusted childcare in
            places that are not always fully familiar. We focus on safety,
            reliability, professionalism, and the kind of confidence parents
            need when they are traveling, relocating, living abroad, or staying
            in hotels across Asia
          </p>
        </div>

        {error && (
          <div className="text-center text-red-600 py-8">
            Failed to load categories: {error.message}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories available at the moment.
            </div>
          ) : (
            categories.map((cat) => {
              const disabled = isCategoryDisabled(cat._id);

              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => !disabled && handleCategoryClick(cat)}
                  disabled={disabled || addingCategoryId === cat._id}
                  className={`group text-left shadow-[0_4px_24px_rgba(0,0,0,0.15)] rounded-xl transition-all duration-200 bg-white border relative overflow-hidden flex flex-col ${
                    disabled || addingCategoryId === cat._id
                      ? "opacity-70 cursor-not-allowed hover:scale-100 border-gray-200"
                      : "hover:scale-[1.02] hover:shadow-xl hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary border-gray-100"
                  }`}
                >
                  {/* Disabled Overlay Badge */}
                  {(disabled || addingCategoryId === cat._id) && (
                    <div className="absolute top-3 right-3 z-10 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                      <CheckCircle className="w-3 h-3" />
                      {addingCategoryId === cat._id ? "Adding..." : "Added"}
                    </div>
                  )}

                  {/* Image Container - Fixed aspect ratio */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={cat?.image}
                      alt={`${cat.name} category`}
                      fill
                      className={`object-cover transition-transform duration-300 ${
                        !disabled && "group-hover:scale-105"
                      }`}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      priority={false}
                    />
                    {/* Dark Overlay for disabled */}
                    {disabled && (
                      <div className="absolute inset-0 bg-black/30" />
                    )}
                  </div>

                  {/* Content - Fixed height for consistency */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-base font-semibold transition-colors line-clamp-1 ${
                          disabled
                            ? "text-gray-500"
                            : "text-gray-900 group-hover:text-primary"
                        }`}
                      >
                        {cat.name}
                      </span>
                      {disabled ? (
                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <MoveRight
                          className={`w-4 h-4 transition-all flex-shrink-0 ${
                            disabled
                              ? "text-gray-400"
                              : "text-gray-500 group-hover:text-primary group-hover:translate-x-1"
                          }`}
                        />
                      )}
                    </div>
                    {disabled && (
                      <span className="text-xs text-gray-400 mt-1 block">
                        Already in your list
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}

        </div>

        {/* Show user's added categories summary if logged in and has categories */}
        {userProfile && userCategories.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">
                  Your Added Services ({userCategories.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((cat) => userCategories.includes(cat._id))
                  .map((cat) => (
                    <span
                      key={cat._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {cat.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
