/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/steps/PricingStep.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type SubscriptionPlan = {
  _id: string;
  type: "monthly" | "yearly";
  title: string;
  price: number;
  description: string;
  content: string;
};

interface PricingStepProps {
  data: any;
  onBack: () => void;
  onSubmit: (data: { plan: string }) => Promise<any>;
  token?: string;
}

async function fetchSubscriptions() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.status}`);
  }
  const json = await response.json();
  return json.data as SubscriptionPlan[];
}

export function PricingStep({ data, onBack, onSubmit }: PricingStepProps) {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    data.subscriptionId || null,
  );

  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000,
  });

  // TanStack Query mutation
  const mutation = useMutation({
    mutationFn: onSubmit,
    onSuccess: (result) => {
      // Redirect to checkout URL if provided
      if (result?.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        // If no checkout URL, redirect to success page
        const categoryName = data.categoryName || "";
        router.push(
          `/payment-success?category=${encodeURIComponent(categoryName)}`,
        );
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    mutation.mutate({ plan: selectedPlanId });
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg p-8 max-w-md shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Error Loading Plans
          </h2>
          <p className="text-gray-600 mb-6">
            Failed to load subscription plans. Please try again later.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onBack}
              variant="outline"
              className="px-6 py-2 rounded-full font-semibold"
            >
              Go Back
            </Button>
            <Button
              onClick={() => refetch()}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-10">
          Almost done! Choose your plan.
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-[700px] mx-auto">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border-2 border-gray-200 bg-white animate-pulse"
                >
                  <div className="h-8 w-4/5 bg-gray-300 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-4" />
                  <div className="h-10 w-1/3 bg-gray-300 rounded mb-6" />
                  <div className="space-y-4 mb-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-300 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded w-4/5" />
                      </div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-300 rounded-full" />
                </div>
              ))
            : plans.map((plan) => {
                const isSelected = selectedPlanId === plan._id;
                const isYearly = plan.type === "yearly";

                return (
                  <div
                    key={plan._id}
                    onClick={() =>
                      !mutation.isPending && handleSelectPlan(plan._id)
                    }
                    className={`relative p-6 rounded-[12px] border-2 border-[#B6B6B6] cursor-pointer shadow-md transition-all bg-white ${
                      isSelected
                        ? "border-[#2B61EB] shadow-xl scale-[1.02]"
                        : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                    } ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSelected && isYearly && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-10">
                      <span className="text-3xl font-bold">
                        ${plan.price.toFixed(2)}
                      </span>
                      <span className="text-gray-600 ml-1">
                        {isYearly ? "/year" : "/month"}
                      </span>
                    </div>

                    <div className="space-y-4 mb-10 min-h-[120px]">
                      {plan.content.split(",").map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check
                            size={18}
                            className="text-green-600 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-base text-[#374151]">
                            {feature.trim()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      disabled={mutation.isPending}
                      className={`w-full py-6 text-base font-semibold rounded-[8px] transition-colors ${
                        isSelected
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-[#E1AD96] text-white hover:bg-[#E1AD96]/90"
                      } ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!mutation.isPending) {
                          handleSelectPlan(plan._id);
                        }
                      }}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </Button>
                  </div>
                );
              })}
        </div>

        {selectedPlanId && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              disabled={mutation.isPending}
              variant="outline"
              className="px-8 py-6 text-lg rounded-full font-semibold border-2 border-primary text-primary hover:bg-primary/10 disabled:opacity-50"
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full font-semibold min-w-[250px] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue with Selected Plan"
              )}
            </Button>
          </div>
        )}

        {/* Error message if mutation fails */}
        {mutation.isError && (
          <p className="text-center text-red-600 mt-4">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
