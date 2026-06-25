/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
// src/components/find-job/MultiStepForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LocationStep } from "../steps/LocationStep";
import { HourlyRateStep } from "../steps/HourlyRateStep";
import { ScheduleStep } from "../steps/ScheduleStep";
import { EmailStep } from "../steps/EmailStep";
import { PersonalDetailsStep } from "../steps/PersonalDetailsStep";
import { PasswordStep } from "../steps/PasswordStep";
import {
  FindJobDataTypes,
  DaySchedule,
  ScheduleTypes,
} from "../find-job-data-type";

const INITIAL_FORM_DATA: FindJobDataTypes = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "find job",
  categoryId: "",
  subscriptionId: "",
  country: "",
  city: "",
  gender: "",
  hourRate: 10,
  days: { day: [], time: [] },
};

export default function MultiStepForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const searchParams = useSearchParams();
  const redirectingRef = useRef(false);

  const role = searchParams.get("role") || "find job";
  const categoryId = searchParams.get("categoryId") || "";
  const userId = searchParams.get("userId");
  const ambassadorCode = searchParams.get("ambassador") || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FindJobDataTypes>({
    ...INITIAL_FORM_DATA,
    role,
    categoryId,
  });
  const queryClient = useQueryClient();

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

  // Load from localStorage and pre-fill with user profile
  useEffect(() => {
    const saved = localStorage.getItem("findJobForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }

    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        email: userProfile.email || prev.email,
        firstName: userProfile.firstName || prev.firstName,
        lastName: userProfile.lastName || prev.lastName,
        gender: userProfile.gender || prev.gender,
        country: userProfile.country || prev.country,
        city: userProfile.city || prev.city,
        subscriptionId: userProfile.subscription || prev.subscriptionId,
      }));
    }
  }, [userProfile]);

  // Save to localStorage whenever formData changes (exclude password)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeData } = formData;
    localStorage.setItem("findJobForm", JSON.stringify(safeData));
  }, [formData]);

  // Convert ScheduleTypes to API format
  const convertToAPIFormat = (days: ScheduleTypes): DaySchedule[] => {
    return days.day.map((day: string, index: number) => {
      const timeRange = days.time[index] || "10:00-12:00";
      const [startTime, endTime] = timeRange
        .split("-")
        .map((t: string) => t.trim());
      return {
        day,
        startTime: startTime || "09:00 AM",
        endTime: endTime || "05:00 PM",
      };
    });
  };

  // For new user registration
  const registerMutation = useMutation({
    mutationFn: async (password?: string) => {
      const apiBody: Record<string, any> = {
        role: formData.role,
        country: formData.country,
        city: formData.city,
        email: formData.email,
        password: password || formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        referralCode: ambassadorCode || undefined,
        onboardingSource: ambassadorCode ? 'city_ambassador' : undefined,
      };

      // Remove undefined/empty fields
      Object.keys(apiBody).forEach((key) => {
        const value = apiBody[key];
        if (
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete apiBody[key];
        }
      });

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

      return result;
    },
    onSuccess: () => {
      localStorage.removeItem("findJobForm");
      toast.success("Registration successful! Please log in.");
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        router.push(`/login`);
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast.error(error?.message || "Registration failed. Please try again.");
      redirectingRef.current = false;
    },
  });

  // For logged-in user profile update
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const apiBody: Record<string, any> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        country: formData.country,
        city: formData.city,
        hourRate: formData.hourRate,
      };

      // Remove undefined fields
      Object.keys(apiBody).forEach((key) => {
        if (apiBody[key] === undefined) {
          delete apiBody[key];
        }
      });

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

      return result;
    },
    onSuccess: async () => {
      await refetch();
      // After profile update, register for service
      await serviceRegisterMutation.mutateAsync();
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      redirectingRef.current = false;
    },
  });

  // For logged-in user service registration
  const serviceRegisterMutation = useMutation({
    mutationFn: async () => {
      const apiBody: Record<string, any> = {
        role: formData.role,
        country: formData.country,
        city: formData.city,
        hourRate: formData.hourRate,
        categoryId: formData.categoryId,
      };

      if (formData.days && formData.days.day.length > 0) {
        apiBody.days = convertToAPIFormat(formData.days);
      }

      // Remove undefined/empty fields
      Object.keys(apiBody).forEach((key) => {
        const value = apiBody[key];
        if (
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete apiBody[key];
        }
      });

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

      return result;
    },
    onSuccess: () => {
      localStorage.removeItem("findJobForm");
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        router.push(`/`);
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Service registration error:", error);
      redirectingRef.current = false;
    },
  });

  const handleNewUserSubmit = (password?: string) => {
    registerMutation.mutate(password);
  };

  const handleLoggedInSubmit = () => {
    updateProfileMutation.mutate();
  };

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

  const getSteps = () => {
    const steps = [];

    steps.push({
      title: "Location",
      component: (
        <LocationStep
          key="location"
          data={formData}
          onNext={(data) => {
            setFormData((p) => ({ ...p, ...data }));
            setCurrentStep(1);
          }}
          onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        />
      ),
    });

    steps.push({
      title: "Hourly Rate",
      component: (
        <HourlyRateStep
          key="hourlyRate"
          data={formData}
          onNext={(data) => {
            setFormData((p) => ({ ...p, ...data }));
            setCurrentStep(2);
          }}
          onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        />
      ),
    });

    steps.push({
      title: "Schedule",
      component: (
        <ScheduleStep
          key="schedule"
          data={formData}
          onNext={(data) => {
            setFormData((p) => ({ ...p, ...data }));
            setCurrentStep(3);
          }}
          onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        />
      ),
    });

    if (!userProfile) {
      steps.push({
        title: "Email",
        component: (
          <EmailStep
            key="email"
            data={formData}
            onNext={(data) => {
              setFormData((p) => ({ ...p, ...data }));
              setCurrentStep(4);
            }}
            onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
          />
        ),
      });
    }

    steps.push({
      title: "Personal Details",
      component: (
        <PersonalDetailsStep
          key="personal"
          data={formData}
          onNext={(data) => {
            setFormData((p) => ({ ...p, ...data }));

            if (userProfile) {
              // Logged in user - update profile and register service
              handleLoggedInSubmit();
            } else {
              // New user - go to password step
              setCurrentStep(5);
            }
          }}
          onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
          initialData={userProfile}
          isLoggedIn={!!userProfile}
        />
      ),
    });

    if (!userProfile) {
      steps.push({
        title: "Password",
        component: (
          <PasswordStep
            key="password"
            email={formData.email}
            onSignUp={(data) => {
              setFormData((p) => ({ ...p, ...data }));
              handleNewUserSubmit(data.password);
            }}
            onBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
            isSubmitting={registerMutation.isPending}
          />
        ),
      });
    }
    return steps;
  };

  const steps = getSteps();
  const stepsToRender = steps.filter((_, index) => index >= currentStep);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {stepsToRender[0]?.component}
    </div>
  );
}
