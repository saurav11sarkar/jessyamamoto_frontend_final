"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

interface UserProfile {
  _id: string;
  isSubscription?: boolean;
  subscription?: string | { _id: string; type: string; title: string };
  subscriptionExpiry?: string;
}

const typeOrder: Record<string, number> = {
  free: 0,
  monthly: 1,
  "6month": 2,
  yearly: 3,
  annual: 3,
};

const typeLabel: Record<string, string> = {
  free: "Free",
  monthly: "Monthly",
  "6month": "6 Month",
  yearly: "Annual",
  annual: "Annual",
};

const typePeriod: Record<string, string> = {
  free: "forever",
  monthly: "/month",
  "6month": "/6 months",
  yearly: "/year",
  annual: "/year",
};

const planAccent: Record<string, string> = {
  free:
    "border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]",
  monthly:
    "border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
  "6month":
    "border-primary/40 bg-gradient-to-b from-primary/[0.14] via-white to-white shadow-[0_24px_70px_rgba(14,165,233,0.2)]",
  yearly:
    "border-emerald-200 bg-gradient-to-b from-emerald-50 via-white to-white shadow-[0_18px_50px_rgba(16,185,129,0.12)]",
};

const planPill: Record<string, string> = {
  free: "bg-slate-100 text-slate-700",
  monthly: "bg-slate-100 text-slate-700",
  "6month": "bg-primary text-white",
  yearly: "bg-emerald-100 text-emerald-700",
  annual: "bg-emerald-100 text-emerald-700",
};

const freeMembershipPlan: Subscription = {
  _id: "free",
  type: "free",
  title: "Free Membership",
  price: 0,
  description:
    "Create a JetSet Cares account, explore care options, and book without paid member savings.",
  content:
    "Free account access, Browse trusted care profiles, Standard Trusted Booking Fee applies, Upgrade anytime for member savings",
};

export default function MembershipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.user?.accessToken || "";
  const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

  const { data: profileData } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch profile");
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  const isActive =
    profileData?.isSubscription === true &&
    !!profileData?.subscriptionExpiry &&
    new Date(profileData.subscriptionExpiry) > new Date();

  const isExpired =
    profileData?.subscriptionExpiry &&
    new Date(profileData.subscriptionExpiry) <= new Date();

  const activeSubscriptionId =
    typeof profileData?.subscription === "object"
      ? profileData.subscription._id
      : profileData?.subscription;

  const expiryDate = profileData?.subscriptionExpiry
    ? new Date(profileData.subscriptionExpiry).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const { data, isLoading } = useQuery<SubscriptionResponse>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription?limit=50`,
      );
      if (!res.ok) throw new Error("Failed to fetch membership plans");
      return res.json();
    },
  });

  const plans = React.useMemo(() => {
    const paidPlans = data?.data || [];
    return [freeMembershipPlan, ...paidPlans].sort(
      (a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99),
    );
  }, [data]);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      if (!session) {
        router.push("/signup");
        return;
      }
      toast.success("You are already on the Free Membership option.");
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    if (isActive && activeSubscriptionId === planId) {
      toast.error("This membership is already active.");
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
        throw new Error(result?.message || "Membership purchase failed");
      }

      if (result?.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        toast.success("Membership activated successfully!");
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_28%,#f8fafc_100%)] pt-[90px]">
      <section className="px-4 py-12 sm:py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10 sm:py-14">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_68%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Become a Member
                </div>
                <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Choose the JetSet Cares membership that fits your family.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Start free, then upgrade when you want member savings,
                  priority-ready support, and a smoother way to arrange trusted
                  care while traveling.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm text-slate-500">Free membership</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      $0
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm text-slate-500">Paid member fee</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      12.5%
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-slate-500">Plan options</p>
                    <p className="mt-2 text-3xl font-bold text-primary">4</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.3)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      Member Advantage
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      Lower fees, clearer value
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Reduced Trusted Booking Fees on every eligible booking",
                    "Clear choices from free to monthly, 6 month, and annual",
                    "A more polished member experience from search to checkout",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {session && isActive && (
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-4 rounded-[26px] border border-green-200 bg-green-50/90 p-6 shadow-[0_16px_50px_rgba(34,197,94,0.1)]">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Membership Active
                </h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-green-700">
                  <CalendarDays className="h-4 w-4" />
                  Your membership is active until {expiryDate}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {session && isExpired && !isActive && (
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-4 rounded-[26px] border border-amber-200 bg-amber-50/90 p-6 shadow-[0_16px_50px_rgba(245,158,11,0.12)]">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Membership Expired
                </h3>
                <p className="text-sm text-amber-700">
                  Your membership expired on {expiryDate}. Renew now to continue
                  enjoying reduced booking fees.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-10 sm:pb-12">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Membership Options
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Free Membership keeps the platform accessible. Paid memberships add
            savings and enhanced member value for families who book more often.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 pb-24">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : plans.length === 0 ? (
            <p className="py-20 text-center text-slate-500">
              No membership plans available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => {
                const isPopular = plan.type === "6month";
                const isFreePlan = plan.type === "free";
                const isCurrentPlan =
                  isFreePlan
                    ? !!session && !isActive
                    : isActive && activeSubscriptionId === plan._id;
                const features = plan.content
                  .split(",")
                  .map((f) => f.trim())
                  .filter(Boolean);

                return (
                  <div
                    key={plan._id}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)] ${planAccent[plan.type] || planAccent.monthly}`}
                  >
                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-70" />

                    {isPopular && (
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-lg">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <div
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${planPill[plan.type] || planPill.monthly}`}
                        >
                          {typeLabel[plan.type] || plan.type}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-slate-900">
                          {plan.title}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                        <Crown
                          className={`h-5 w-5 ${isPopular ? "text-primary" : "text-slate-500"}`}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold tracking-tight text-slate-900">
                          {isFreePlan ? "Free" : `$${plan.price}`}
                        </span>
                        <span className="pb-2 text-sm font-medium text-slate-500">
                          {typePeriod[plan.type] || ""}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Included in this plan
                      </p>
                      <ul className="mt-4 space-y-3">
                        {features.map((feature, fIndex) => (
                          <li
                            key={fIndex}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="leading-6">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      {isCurrentPlan ? (
                        <button
                          disabled
                          className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-green-100 px-6 py-3.5 text-sm font-semibold text-green-700"
                        >
                          {isFreePlan ? "Current Free Membership" : "Current Plan"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(plan._id)}
                          disabled={loadingPlanId === plan._id}
                          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                            isPopular
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {loadingPlanId === plan._id
                            ? "Processing..."
                            : isFreePlan
                              ? "Become a Free Member"
                              : isActive
                              ? "Change Membership"
                              : isExpired
                                ? "Renew Membership"
                                : "Become a Member"}
                          {loadingPlanId !== plan._id && (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <p className="mt-3 text-center text-xs text-slate-500">
                        Secure checkout. Cancel according to plan terms.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {session && (
        <section className="border-t bg-white/70 px-4 py-12 backdrop-blur">
          <div className="container mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-slate-50/80 px-6 py-8 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:px-8">
            <h3 className="mb-2 text-xl font-semibold text-slate-800">
              Your Membership
            </h3>
            {isActive ? (
              <p className="text-slate-600">
                Your membership is{" "}
                <span className="font-semibold text-green-600">active</span> and
                your reduced 12.5% booking fee is automatically applied to all
                bookings. Expires on{" "}
                <span className="font-semibold">{expiryDate}</span>.
              </p>
            ) : isExpired ? (
              <p className="text-slate-600">
                Your membership{" "}
                <span className="font-semibold text-amber-600">expired</span> on{" "}
                <span className="font-semibold">{expiryDate}</span>. Renew above
                to continue enjoying reduced booking fees.
              </p>
            ) : (
              <p className="text-slate-600">
                You don&apos;t have an active membership yet. Become a member
                above to enjoy reduced 12.5% booking fees instead of 25%.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
