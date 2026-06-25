/* eslint-disable react-hooks/rules-of-hooks */
// src/components/find-care/MultiStepForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmailStep } from "../steps/EmailStep";
import { PasswordStep } from "../steps/PasswordStep";
import { LocationStep } from "../steps/LocationStep";
import { PersonalDetailsStep } from "../steps/PersonalDetailsStep";

interface FormData {
  type?: string;
  help?: string;
  email: string;
  password?: string;
  country: string;
  city: string;
  neighborhood?: string;
  selectedDays: string[];
  timeRange: [number, number];
  applyForAllDays: boolean;
  scheduleVaries: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  termsAccepted: boolean;
  hourlyRate: number;
  role: string;
  categoryId: string;
  subscriptionId?: string;
}

const INITIAL_FORM_DATA: FormData = {
  type: "",
  help: "",
  email: "",
  password: "",
  country: "",
  city: "",
  neighborhood: "",
  selectedDays: [],
  timeRange: [10, 12],
  applyForAllDays: false,
  scheduleVaries: false,
  firstName: "",
  lastName: "",
  gender: "",
  termsAccepted: false,
  hourlyRate: 0,
  role: "",
  categoryId: "",
};

export function MultiStepForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "find care";
  const categoryId = searchParams.get("categoryId") || "";
  const userId = searchParams.get("userId");

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM_DATA,
    role,
    categoryId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile if logged in
  const {
    data: userProfile,
    isLoading: profileLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!token || !userId) return null;
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
    enabled: !!token && !!userId,
  });

  // Pre-fill form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        email: userProfile.email || prev.email,
        firstName: userProfile.firstName || prev.firstName,
        lastName: userProfile.lastName || prev.lastName,
        gender: userProfile.gender || prev.gender,
        country: userProfile.country || prev.country,
        city: userProfile.city || prev.city,
        neighborhood: userProfile.neighborhoods || prev.neighborhood,
        subscriptionId: userProfile.subscription || prev.subscriptionId,
              }));
    }
  }, [userProfile]);

  // For new user registration
  const submitRegistration = useCallback(
    async (password?: string) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      const finalPassword = password || formData.password;

      const apiBody: Record<string, unknown> = {
        email: formData.email,
        password: finalPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        country: formData.country,
        city: formData.city,
        neighborhoods: formData.neighborhood,
        gender: formData.gender,
      };

      Object.keys(apiBody).forEach((key) => {
        if (apiBody[key] === undefined || apiBody[key] === "") {
          delete apiBody[key];
        }
      });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiBody),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Registration failed");
        }

        toast.success("Registration successful! Please log in.");
        router.push(`/login`);
      } catch (error: unknown) {
        console.error("Registration error:", error);
        const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
        toast.error(message);
        setIsSubmitting(false);
      }
    },
    [formData, router, isSubmitting],
  );

  // For logged-in user profile update
  const updateProfile = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Prepare API body for profile update
    const apiBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      country: formData.country,
      city: formData.city,
      neighborhoods: formData.neighborhood,
      typeOfInterest: formData.type,
      helpOfInterest: formData.help,
      categoryId: formData.categoryId,
    };

    // Remove undefined fields
    Object.keys(apiBody).forEach((key) => {
      if (apiBody[key as keyof typeof apiBody] === undefined) {
        delete apiBody[key as keyof typeof apiBody];
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiBody),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }


      // Refetch user profile to get updated data
      await refetch();

      // Redirect to success page or dashboard
      router.push(`/`);
    } catch (error) {
      console.error("Profile update error:", error);
      setIsSubmitting(false);
      throw error;
    }
  }, [formData, token, router, isSubmitting, refetch]);

  // For logged-in user service registration
  const registerServiceForLoggedInUser = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Prepare API body for service registration
    const apiBody = {
      typeOfInterest: formData.type,
      helpOfInterest: formData.help,
      categoryId: formData.categoryId,
      country: formData.country,
      city: formData.city,
      neighborhoods: formData.neighborhood,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/register-service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiBody),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Service registration failed");
      }

      // Redirect to success page or dashboard
      router.push(`/`);
    } catch (error) {
      console.error("Service registration error:", error);
      setIsSubmitting(false);
      throw error;
    }
  }, [formData, token, router, isSubmitting]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  // Determine steps based on user state
  const getSteps = () => {
    const steps = [];

    // Note: Type and Help steps are temporarily commented out
    // Step order: Personal Details -> Location -> (Email if not logged in) -> Password

    // Step 0: Personal Details (always first)
    steps.push({
      id: "personal",
      title: "Personal Details",
      component: (
        <PersonalDetailsStep
          key="personal"
          onNext={(data) => {
            setFormData((p) => ({ ...p, ...data }));
            setCurrentStep(1); // Move to Location step
          }}
          onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
          initialData={userProfile}
          isLoggedIn={!!userProfile}
        />
      ),
    });

    // Step 1: Location (always second)
    steps.push({
      id: "location",
      title: "Location",
      component: (
        <LocationStep
          key="location"
          onNext={(data) => {
            setFormData((p) => ({ ...p, ...data }));

            if (userProfile) {
              updateProfile()
                .then(() => registerServiceForLoggedInUser())
                .catch((err: unknown) => {
                  const message = err instanceof Error ? err.message : "Failed to update profile";
                  toast.error(message);
                });
            } else {
              // New user - go to email step
              setCurrentStep(2);
            }
          }}
          onBack={() => setCurrentStep(0)} // Back to Personal Details
          initialCountry={formData.country}
          initialCity={formData.city}
          initialNeighborhood={formData.neighborhood}
        />
      ),
    });

    // Step 2: Email (only for new users)
    if (!userProfile) {
      steps.push({
        id: "email",
        title: "Email",
        component: (
          <EmailStep
            key="email"
            onNext={(data) => {
              setFormData((p) => ({ ...p, ...data }));
              setCurrentStep(3); // Move to Password step
            }}
            onBack={() => setCurrentStep(1)} // Back to Location
          />
        ),
      });
    }

    // Step 3: Password (only for new users)
    if (!userProfile) {
      steps.push({
        id: "password",
        title: "Password",
        component: (
          <PasswordStep
            key="password"
            email={formData.email}
            onSignUp={(data) => {
              setFormData((p) => ({ ...p, ...data }));
              submitRegistration(data.password);
            }}
            onBack={() => setCurrentStep(2)} // Back to Email
            isSubmitting={isSubmitting}
          />
        ),
      });
    }

    return steps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Current Step */}
      {currentStepData.component}
    </div>
  );
}
