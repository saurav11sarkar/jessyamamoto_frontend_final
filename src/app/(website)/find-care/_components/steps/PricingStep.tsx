/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/steps/PricingStep.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

type SubscriptionPlan = {
  _id: string;
  type: "monthly" | "yearly";
  title: string;
  price: number;
  description: string;
  content: string;
};

interface PricingStepProps {
  formData: any;
  onBack: () => void;
  onFinish: (data: { plan: string }) => void;
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

export function PricingStep({
  formData,
  onBack,
  onFinish,
}: PricingStepProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    formData.plan || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: plans = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000,
  });

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    setIsSubmitting(true);

    try {
      // Call onFinish which will trigger the API call in MultiStepForm
      await onFinish({ plan: selectedPlanId });
    } catch (error) {
      console.error("Error during submission:", error);
      setIsSubmitting(false);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-600 py-10 bg-white rounded-lg p-8 max-w-md">
          Failed to load subscription plans. Please try again later.
          <Button
            onClick={onBack}
            className="mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-10">
          Almost done! Order your safety screening to find jobs.
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
                    onClick={() => !isSubmitting && handleSelectPlan(plan._id)}
                    className={`relative p-6 rounded-[12px] border-2 border-[#B6B6B6] cursor-pointer shadow-md transition-all bg-white ${
                      isSelected
                        ? "border-[#2B61EB] shadow-xl scale-[1.02]"
                        : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSelected && isYearly && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
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

                    <div className="space-y-6 mb-10 min-h-[120px]">
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
                      variant={isSelected ? "default" : "outline"}
                      disabled={isSubmitting}
                      className={`w-full py-6 text-base font-semibold rounded-[8px] transition-colors ${
                        isSelected
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-[#E1AD96] text-white hover:bg-[#E1AD96]/90"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSubmitting) {
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
              disabled={isSubmitting}
              variant="outline"
              className="px-8 py-6 text-lg rounded-full font-semibold border-2 border-primary text-primary hover:bg-primary/10"
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full font-semibold min-w-[250px]"
            >
              {isSubmitting ? (
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
      </div>
    </div>
  );
}
