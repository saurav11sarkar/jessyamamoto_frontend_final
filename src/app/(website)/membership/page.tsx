"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  _id: string;
  type: string;
  title: string;
  price: number;
  description: string;
  content: string;
  totalSubscripeUser?: string[];
  totalServices?: string[];
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Subscription[];
}

const typeOrder: Record<string, number> = {
  monthly: 1,
  "6month": 2,
  yearly: 3,
};

const typeLabel: Record<string, string> = {
  monthly: "Monthly",
  "6month": "6 Month",
  yearly: "Annual",
};

const typePeriod: Record<string, string> = {
  monthly: "/month",
  "6month": "/6 months",
  yearly: "/year",
};

export default function MembershipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.user?.accessToken || "";
  const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery<SubscriptionResponse>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription?limit=50`,
      );
      if (!res.ok) throw new Error("Failed to fetch subscription plans");
      return res.json();
    },
  });

  const plans = React.useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort(
      (a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99),
    );
  }, [data]);

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoadingPlanId(planId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/register-service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subscriptionId: planId }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Subscription failed");
      }

      if (result?.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        toast.success("Subscription activated successfully!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[90px]">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Membership Plans
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Become a JetSet Cares member and enjoy reduced Trusted Booking Fees.
            Members pay only a 12.5% booking fee compared to 25% for
            non-members.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Non-Member */}
            <div className="border border-slate-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Non-Member
              </h3>
              <p className="text-4xl font-bold text-slate-400 mb-4">25%</p>
              <p className="text-slate-500">Trusted Booking Fee</p>
            </div>

            {/* Member */}
            <div className="border-2 border-primary rounded-2xl p-8 text-center bg-primary/5">
              <h3 className="text-xl font-semibold text-primary mb-2">
                Member
              </h3>
              <p className="text-4xl font-bold text-primary mb-4">12.5%</p>
              <p className="text-slate-600">
                Trusted Booking Fee - save 50%!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : plans.length === 0 ? (
            <p className="text-center text-slate-500 py-20">
              No membership plans available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const isPopular = plan.type === "6month";
                const features = plan.content
                  .split(",")
                  .map((f) => f.trim())
                  .filter(Boolean);

                return (
                  <div
                    key={plan._id}
                    className={`relative rounded-2xl border-2 p-8 flex flex-col transition-shadow hover:shadow-lg ${
                      isPopular
                        ? "border-primary shadow-md"
                        : "border-slate-200"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                        {typeLabel[plan.type] || plan.type}
                      </p>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        {plan.title}
                      </h2>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-slate-900">
                          ${plan.price}
                        </span>
                        <span className="text-slate-500 ml-1">
                          {typePeriod[plan.type] || ""}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-center text-sm mb-6">
                      {plan.description}
                    </p>

                    <div className="flex-1">
                      <ul className="space-y-3 mb-8">
                        {features.map((feature, fIndex) => (
                          <li
                            key={fIndex}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={loadingPlanId === plan._id}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        isPopular
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {loadingPlanId === plan._id
                        ? "Processing..."
                        : "Subscribe"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Current Subscription Status */}
      {session && (
        <section className="py-12 px-4 bg-slate-50 border-t">
          <div className="container mx-auto max-w-2xl text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Your Subscription
            </h3>
            <p className="text-slate-600">
              If you already have an active subscription, your benefits are
              automatically applied to all bookings. Manage your subscription
              from your profile settings.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
