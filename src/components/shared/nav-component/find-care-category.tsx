"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Heart, Users, Clock, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Category {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  findCareUser?: string[];
  findJobUser?: string[];
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    serviceActivationRequiresPaidMembership?: boolean;
    perCategoryPaymentRequired?: boolean;
  };
  data: Category[];
}

const FindCareCategory = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return await res.json();
    },
  });

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/all-find-care?id=${categoryId}`);
  };

  const displayCategories = data?.data || [];
  const totalCareProviders = displayCategories.reduce(
    (sum, cat) => sum + (cat.findCareUser?.length || 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Categories
            </h3>
            <p className="text-gray-500 mb-4">
              Please check your connection and try again
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Find Care Services
              </h2>
              <p className="text-gray-500 mt-1">
                Discover trusted care providers across {displayCategories.length} categories
              </p>
            </div>
            {data?.meta && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  {displayCategories.length} Categories
                </div>
                {data.meta.serviceActivationRequiresPaidMembership && (
                  <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Premium Service
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {displayCategories.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayCategories.map((category, index) => (
                <motion.button
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative w-full text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative bg-white rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                    <div className="flex items-start gap-3">
                      {/* Category Image/Icon */}
                      <div className="flex-shrink-0">
                        {category.image ? (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={1000}
                              height={1000}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Category Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-3 mt-2">
                          {(category.findCareUser?.length || 0) > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Users className="w-3 h-3" />
                              <span>
                                {category.findCareUser?.length || 0} care
                                providers
                              </span>
                            </div>
                          )}
                          {category.findJobUser &&
                            category.findJobUser.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Heart className="w-3 h-3" />
                                <span>
                                  {category.findJobUser?.length || 0} seeking
                                  care
                                </span>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Stats Footer - Only show for logged in users with categories */}
        {displayCategories.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    {displayCategories.length} Active{" "}
                    {displayCategories.length === 1 ? "Service" : "Services"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {totalCareProviders}+ Care Providers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Available 24/7</span>
                </div>
              </div>
              {!token && (
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                >
                  Login to access your services
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindCareCategory;
