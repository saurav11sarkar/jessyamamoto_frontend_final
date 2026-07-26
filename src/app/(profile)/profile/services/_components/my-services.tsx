"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Heart,
  Award,
  Briefcase,
  Users,
  ChevronRight,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FULL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

interface MyServiceDay {
  day: string;
  startTime: string;
  endTime: string;
  _id?: string;
}

interface BlockedDate {
  date: string;
  reason?: string;
}

interface MyService {
  _id: string;
  hourRate?: number;
  days?: MyServiceDay[];
  minAdvanceNoticeHours?: number;
  maxBookingHorizonDays?: number;
  blockedDates?: BlockedDate[];
  categoryId?: { _id: string; name?: string } | string;
}

interface AvailabilityDayState {
  day: string;
  selected: boolean;
  startTime: string;
  endTime: string;
}

const buildAvailabilityState = (
  days?: MyServiceDay[],
): AvailabilityDayState[] => {
  return FULL_DAYS.map((day) => {
    const existing = days?.find((d) => d.day === day);
    return {
      day,
      selected: !!existing,
      startTime: existing?.startTime || "10:00",
      endTime: existing?.endTime || "18:00",
    };
  });
};

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
  badges?: Array<{
    badge?: {
      _id: string;
      title: string;
      description: string;
      issuer?: string;
    };
    verified?: boolean;
    validThrough?: string;
    revokedAt?: string;
  }>;
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

  // Fetch the partner's own Service documents (hourRate/days) so hours & rate can be edited
  const { data: myServices, refetch: refetchMyServices } = useQuery<
    MyService[]
  >({
    queryKey: ["myServices"],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/mine`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) throw new Error("Failed to fetch your services");
      const json = await response.json();
      return json.data;
    },
    enabled: !!token,
  });

  const getServiceForCategory = (categoryId: string) =>
    myServices?.find((s) => {
      const catId =
        typeof s.categoryId === "string" ? s.categoryId : s.categoryId?._id;
      return catId === categoryId;
    });

  const [editingService, setEditingService] = useState<MyService | null>(
    null,
  );
  const [editHourRate, setEditHourRate] = useState("");
  const [editAvailability, setEditAvailability] = useState<
    AvailabilityDayState[]
  >(buildAvailabilityState());
  const [editMinNotice, setEditMinNotice] = useState("0");
  const [editMaxHorizon, setEditMaxHorizon] = useState("90");
  const [editBlockedDates, setEditBlockedDates] = useState<BlockedDate[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");
  const [savingAvailability, setSavingAvailability] = useState(false);

  const openAvailabilityEditor = (service: MyService) => {
    setEditingService(service);
    setEditHourRate(String(service.hourRate ?? ""));
    setEditAvailability(buildAvailabilityState(service.days));
    setEditMinNotice(String(service.minAdvanceNoticeHours ?? 0));
    setEditMaxHorizon(String(service.maxBookingHorizonDays ?? 90));
    setEditBlockedDates(service.blockedDates || []);
    setNewBlockedDate("");
    setNewBlockedReason("");
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    if (editBlockedDates.some((d) => d.date === newBlockedDate)) {
      toast.error("That date is already blocked");
      return;
    }
    setEditBlockedDates((prev) => [
      ...prev,
      { date: newBlockedDate, reason: newBlockedReason || undefined },
    ]);
    setNewBlockedDate("");
    setNewBlockedReason("");
  };

  const removeBlockedDate = (date: string) => {
    setEditBlockedDates((prev) => prev.filter((d) => d.date !== date));
  };

  const toggleAvailabilityDay = (day: string) => {
    setEditAvailability((prev) =>
      prev.map((d) => (d.day === day ? { ...d, selected: !d.selected } : d)),
    );
  };

  const updateAvailabilityTime = (
    day: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setEditAvailability((prev) =>
      prev.map((d) => (d.day === day ? { ...d, [field]: value } : d)),
    );
  };

  const handleSaveAvailability = async () => {
    if (!editingService) return;

    const hourRate = Number(editHourRate);
    if (!hourRate || hourRate <= 0) {
      toast.error("Enter a valid hourly rate");
      return;
    }

    const selectedDays = editAvailability.filter((d) => d.selected);
    if (selectedDays.length === 0) {
      toast.error("Select at least one day you're available");
      return;
    }

    setSavingAvailability(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/${editingService._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hourRate,
            days: selectedDays.map((d) => ({
              day: d.day,
              startTime: d.startTime,
              endTime: d.endTime,
            })),
            minAdvanceNoticeHours: Number(editMinNotice) || 0,
            maxBookingHorizonDays: Number(editMaxHorizon) || 90,
            blockedDates: editBlockedDates,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to update availability");
      }

      toast.success("Hours & rate updated");
      setEditingService(null);
      refetchMyServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update availability",
      );
    } finally {
      setSavingAvailability(false);
    }
  };

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

  if (userProfile.role !== "find job") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 mb-4">
            <Briefcase className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            My Services is only for Partners
          </h3>
          <p className="text-gray-500 mb-6">
            Parent accounts can manage bookings here, but only Partner accounts
            can add services to their profile.
          </p>
          <button
            onClick={() => router.push("/profile/bookings")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            View My Bookings
          </button>
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
                Manage the services attached to your Partner profile
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Badge Wallet</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {userProfile.badges?.filter((b) => !b.revokedAt).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Award className="h-5 w-5 text-emerald-600" />
            Badge Wallet
          </h2>
          {userProfile.badges?.filter((item) => item.badge && !item.revokedAt)
            .length ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.badges
                .filter((item) => item.badge && !item.revokedAt)
                .map((item) => (
                  <div
                    key={item.badge?._id}
                    className="rounded-full border border-[#9aece3] bg-[#ecfffd] px-3 py-2 text-sm font-semibold text-[#087c73]"
                    title={`${item.badge?.description || ""}${
                      item.validThrough
                        ? ` Valid through ${new Date(item.validThrough).toLocaleDateString()}`
                        : ""
                    }`}
                  >
                    {item.badge?.title}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No badges assigned yet. Admin can assign badges after reviewing
              documents, training, or verification.
            </p>
          )}
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
              Start by adding categories directly to your Partner profile.
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
                      {getServiceForCategory(service._id) && (
                        <button
                          onClick={() =>
                            openAvailabilityEditor(
                              getServiceForCategory(service._id)!,
                            )
                          }
                          className="px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Clock className="w-4 h-4" />
                          Hours & Rate
                        </button>
                      )}
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

      {/* Edit Hours & Rate Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Hours & Rate
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5">
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Hourly rate ($)
              </label>
              <input
                type="number"
                min={1}
                step="0.01"
                value={editHourRate}
                onChange={(e) => setEditHourRate(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Weekly availability
            </label>
            <div className="space-y-2 mb-2">
              {editAvailability.map((d) => (
                <div
                  key={d.day}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={d.selected}
                        onChange={() => toggleAvailabilityDay(d.day)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      {d.day}
                    </label>
                    {d.selected && (
                      <div className="flex items-center gap-2 text-sm">
                        <select
                          value={d.startTime}
                          onChange={(e) =>
                            updateAvailabilityTime(
                              d.day,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        >
                          {TIME_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-400">to</span>
                        <select
                          value={d.endTime}
                          onChange={(e) =>
                            updateAvailabilityTime(
                              d.day,
                              "endTime",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        >
                          {TIME_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Min notice (hours)
                </label>
                <input
                  type="number"
                  min={0}
                  value={editMinNotice}
                  onChange={(e) => setEditMinNotice(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Max booking horizon (days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={editMaxHorizon}
                  onChange={(e) => setEditMaxHorizon(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Blocked dates
              </label>
              <div className="mb-2 flex gap-2">
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  className="flex-1 rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addBlockedDate}
                  className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
              {editBlockedDates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editBlockedDates.map((d) => (
                    <span
                      key={d.date}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                    >
                      {d.date}
                      {d.reason ? ` — ${d.reason}` : ""}
                      <button
                        type="button"
                        onClick={() => removeBlockedDate(d.date)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={savingAvailability}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {savingAvailability ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyServices;
