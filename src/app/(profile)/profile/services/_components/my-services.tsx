"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Heart,
  Briefcase,
  Users,
  ChevronRight,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  findCareUser?: string[];
  findJobUser?: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  category: string[];
  country: string;
  city: string;
  gender: string;
  nidNumber?: string;
  subscription?: string;
}

const MyServices = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const json = await response.json();
      return json.data;
    },
    enabled: !!token,
  });

  // Fetch all categories
  const { data: allCategories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const json = await response.json();
      return json.data;
    },
  });

  // Get user's services/categories
  const userServices = React.useMemo(() => {
    if (!allCategories || !userProfile?.category) return [];
    return allCategories.filter((cat) =>
      userProfile.category.includes(cat._id),
    );
  }, [allCategories, userProfile]);

  // Delete service mutation
  const deleteService = async (categoryId: string) => {
    setDeletingId(categoryId);
    try {
      const updatedCategories = userProfile?.category.filter(
        (id) => id !== categoryId,
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: updatedCategories,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to delete service");

      await refetchProfile();
      setShowDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete service. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Get service type (care or job)
  const getServiceType = (category: Category) => {
    const hasCare = category.findCareUser?.includes(userProfile?._id || "");
    const hasJob = category.findJobUser?.includes(userProfile?._id || "");

    if (hasCare && hasJob) return "Both";
    if (hasCare) return "Find Care";
    if (hasJob) return "Find Job";
    return "Unknown";
  };

  // Get service icon
  const getServiceIcon = (category: Category) => {
    const type = getServiceType(category);
    if (type === "Find Care") return <Heart className="w-5 h-5" />;
    if (type === "Find Job") return <Briefcase className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  // Get service color
  const getServiceColor = (category: Category) => {
    const type = getServiceType(category);
    if (type === "Find Care") return "text-pink-600 bg-pink-50";
    if (type === "Find Job") return "text-blue-600 bg-blue-50";
    return "text-purple-600 bg-purple-50";
  };

  if (profileLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-500">Loading your services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Not Authenticated
            </h2>
            <p className="text-gray-500 mb-6">
              Please login to view your services
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Services
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {userServices.length} Active
                </span>
              </h1>
              <p className="text-gray-500 mt-2">
                Manage your active care and job services
              </p>
            </div>
            <button
              onClick={() => router.push("/category")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 self-start"
            >
              Add New Service
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Services</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userServices.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Care Services</p>
                <p className="text-3xl font-bold text-pink-600">
                  {
                    userServices.filter((s) =>
                      s.findCareUser?.includes(userProfile._id),
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Job Services</p>
                <p className="text-3xl font-bold text-blue-600">
                  {
                    userServices.filter((s) =>
                      s.findJobUser?.includes(userProfile._id),
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {userServices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Services Added Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding care or job services to your profile
            </p>
            <button
              onClick={() => router.push("/category")}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {userServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Service Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {getServiceIcon(service)}
                      </div>
                    )}
                    {/* Service Type Badge */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getServiceColor(
                          service,
                        )}`}
                      >
                        {getServiceIcon(service)}
                        <span>{getServiceType(service)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>
                          {service.findCareUser?.length || 0} Care Seekers
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        <span>
                          {service.findJobUser?.length || 0} Job Providers
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() =>
                          router.push(
                            getServiceType(service) === "Find Care"
                              ? `/all-find-care?id=${service._id}`
                              : `/all-find-jobs?id=${service._id}`,
                          )
                        }
                        className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(service._id)}
                        className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm === service._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-50 rounded-lg"
                      >
                        <p className="text-sm text-red-700 mb-3">
                          Are you sure you want to remove this service?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteService(service._id)}
                            disabled={deletingId === service._id}
                            className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {deletingId === service._id ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              "Yes, Remove"
                            )}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
