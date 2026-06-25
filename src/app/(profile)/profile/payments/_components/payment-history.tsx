"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Crown,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react";

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentType: "subscription" | "booking";
  userType: "findJob" | "findCare";
  createdAt: string;
  adminFree?: number;
  serviceProviderFree?: number;
  caregiverRate?: number;
  subscription?: {
    _id: string;
    type: string;
    title: string;
    price: number;
    description: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  service?: {
    _id: string;
    firstName: string;
    lastName: string;
    hourRate: number;
    categoryId?: {
      _id: string;
      name: string;
    };
  };
  booking?: {
    _id: string;
    day: string;
    date: string;
    time: string;
    status: string;
  };
}

interface PaymentMeta {
  total: number;
  page: number;
  limit: number;
}

interface PaymentResponse {
  success: boolean;
  data: Payment[];
  meta: PaymentMeta;
}

type FilterTab = "all" | "subscription" | "booking";
type StatusFilter = "all" | "completed" | "pending" | "failed" | "refunded";

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType; label: string }
> = {
  completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  failed: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Failed" },
  refunded: { color: "bg-purple-100 text-purple-800", icon: RotateCcw, label: "Refunded" },
};

const PaymentHistoryPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: paymentsData,
    isLoading,
  } = useQuery<PaymentResponse>({
    queryKey: ["userPayments", currentPage, activeTab, statusFilter],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      if (activeTab !== "all") params.set("paymentType", activeTab);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/user?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
    enabled: !!token,
  });

  const payments = paymentsData?.data || [];
  const meta = paymentsData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(amount);
  };

  const typeTabs: { label: string; value: FilterTab; icon: React.ElementType }[] = [
    { label: "All", value: "all", icon: CreditCard },
    { label: "Subscriptions", value: "subscription", icon: Crown },
    { label: "Bookings", value: "booking", icon: BookOpen },
  ];

  const statusTabs: { label: string; value: StatusFilter }[] = [
    { label: "All Status", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div>
          <div className="mb-8">
            <div className="h-9 w-56 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-72 bg-gray-200 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Authenticated</h2>
            <p className="text-gray-500 mb-6">Please login to view your payment history</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Payment History
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            View all your subscription and booking payments
          </p>
        </div>

        {/* Summary Cards */}
        {meta && meta.total > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Payments</p>
                  <p className="text-xl font-bold text-gray-900">{meta.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {payments.filter((p) => p.status === "completed").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {payments.filter((p) => p.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {typeTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                statusFilter === tab.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "subscription"
                ? "You haven't purchased any subscriptions yet."
                : activeTab === "booking"
                  ? "You haven't made any booking payments yet."
                  : "Your payment history will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {payments.map((payment) => {
                const status = statusConfig[payment.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const isSubscription = payment.paymentType === "subscription";

                return (
                  <div
                    key={payment._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Icon + Info */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSubscription
                              ? "bg-purple-50"
                              : "bg-blue-50"
                          }`}
                        >
                          {isSubscription ? (
                            <Crown className="w-6 h-6 text-purple-600" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-900">
                              {isSubscription
                                ? payment.subscription?.title || "Membership Plan"
                                : payment.category?.name ||
                                  payment.service?.categoryId?.name ||
                                  "Booking Payment"}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                isSubscription
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {isSubscription ? "Subscription" : "Booking"}
                            </span>
                          </div>

                          {/* Subscription details */}
                          {isSubscription && payment.subscription && (
                            <p className="text-sm text-gray-500 mt-1">
                              {payment.subscription.type?.charAt(0).toUpperCase() +
                                payment.subscription.type?.slice(1)}{" "}
                              plan
                            </p>
                          )}

                          {/* Booking details */}
                          {!isSubscription && (
                            <div className="mt-1 space-y-0.5">
                              {payment.service && (
                                <p className="text-sm text-gray-600">
                                  Provider: {payment.service.firstName}{" "}
                                  {payment.service.lastName}
                                </p>
                              )}
                              {payment.booking && (
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    {payment.booking.date} ({payment.booking.day})
                                  </span>
                                  <span>{payment.booking.time}</span>
                                </div>
                              )}
                              {(payment.adminFree != null || payment.caregiverRate != null) && (
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                  {payment.caregiverRate != null && (
                                    <span>
                                      Rate: ${payment.caregiverRate.toFixed(2)}/hr
                                    </span>
                                  )}
                                  {payment.adminFree != null && (
                                    <span>
                                      Platform fee: ${payment.adminFree.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Right: Amount + Status */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
