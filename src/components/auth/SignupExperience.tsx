"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  MoveRight,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PolicyModalLinks } from "@/components/shared/policy-modal-links";

type PublicRole = "find care" | "find job";
type RootStep = 1 | 2;
type CaregiverStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Category {
  _id: string;
  name: string;
  image: string;
  findCareUser: string[];
  findJobUser: string[];
}

interface Country {
  _id: string;
  countryName: string;
  cities?: Array<{
    cityName: string;
    neighborhoods: string[];
  }>;
  cityName?: string[];
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface ScheduleDay {
  day: string;
  selected: boolean;
  time: string;
}

const roleLabelMap: Record<PublicRole, string> = {
  "find care": "Parent",
  "find job": "Find Trusted Care",
};

const EMPTY_PARENT_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  country: "",
  city: "",
  gender: "",
  bio: "",
};

const EMPTY_CAREGIVER_FORM = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  gender: "",
  country: "",
  city: "",
  bio: "",
  hourRate: 20,
  ageVerified: false,
  termsAccepted: false,
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEFAULT_SCHEDULE: ScheduleDay[] = DAYS.map((day) => ({
  day,
  selected: false,
  time: "09:00 AM-05:00 PM",
}));

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "cisgender-woman", label: "Cisgender Woman" },
  { value: "cisgender-man", label: "Cisgender Man" },
  { value: "transgender-woman", label: "Transgender Woman" },
  { value: "transgender-man", label: "Transgender Man" },
  { value: "nonbinary", label: "Nonbinary" },
  { value: "genderqueer", label: "Genderqueer" },
  { value: "agender", label: "Agender" },
  { value: "bigender", label: "Bigender" },
  { value: "genderfluid", label: "Genderfluid" },
  { value: "demiboy", label: "Demiboy" },
  { value: "demigirl", label: "Demigirl" },
  { value: "two-spirit", label: "Two-Spirit" },
  { value: "pangender", label: "Pangender" },
  { value: "other", label: "Other" },
];

const sectionShell =
  "mt-10 rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_20px_60px_rgba(22,50,79,0.10)] backdrop-blur";
const fieldClass =
  "h-12 rounded-xl border-slate-200 bg-slate-50/80 px-4 text-[15px] shadow-sm focus-visible:ring-[#3ee0cf]";
const fieldGrid = "mx-auto grid max-w-4xl gap-4 md:grid-cols-2";
const stepCard =
  "mx-auto max-w-4xl rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)] md:p-8";

export default function SignupExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const existingRole = session?.user?.role as PublicRole | undefined;
  const requestedRole = searchParams.get("role") as PublicRole | null;
  const ambassadorCode = searchParams.get("ambassador") || "";

  const [rootStep, setRootStep] = useState<RootStep>(existingRole ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState<PublicRole | "">(
    existingRole || "",
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [parentForm, setParentForm] = useState(EMPTY_PARENT_FORM);
  const [caregiverForm, setCaregiverForm] = useState(EMPTY_CAREGIVER_FORM);
  const [caregiverStep, setCaregiverStep] = useState<CaregiverStep>(0);
  const [caregiverSchedule, setCaregiverSchedule] =
    useState<ScheduleDay[]>(DEFAULT_SCHEDULE);
  const [isSubmittingParent, setIsSubmittingParent] = useState(false);
  const [isSubmittingCaregiver, setIsSubmittingCaregiver] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCaregiverPassword, setShowCaregiverPassword] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [parentProfileImage, setParentProfileImage] = useState<File | null>(null);
  const [parentProfilePreview, setParentProfilePreview] = useState("");
  const [caregiverProfileImage, setCaregiverProfileImage] = useState<File | null>(
    null,
  );
  const [caregiverProfilePreview, setCaregiverProfilePreview] = useState("");

  const { data: categories = [], isLoading: isCategoryLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      if (!response.ok) throw new Error("Failed to load categories");
      const json: CategoriesResponse = await response.json();
      return json.data || [];
    },
  });

  const { data: countriesData = [], isLoading: isCountryLoading } = useQuery({
    queryKey: ["signup-countries"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/country/`);
      if (!response.ok) throw new Error("Failed to load countries");
      const json = await response.json();
      return (json.data || []) as Country[];
    },
  });

  const uniqueCountries = useMemo(
    () =>
      Array.from(
        new Map(
          countriesData.map((item) => [item.countryName, item]),
        ).values(),
      ),
    [countriesData],
  );

  const selectedCategories = useMemo(
    () =>
      categories.filter((category) => selectedCategoryIds.includes(category._id)),
    [categories, selectedCategoryIds],
  );

  const parentCities = useMemo(() => {
    if (!parentForm.country) return [];
    const country = countriesData.find(
      (item) => item.countryName === parentForm.country,
    );
    if (!country) return [];
    if (country.cities?.length) return country.cities.map((item) => item.cityName);
    return country.cityName || [];
  }, [countriesData, parentForm.country]);

  const caregiverCities = useMemo(() => {
    if (!caregiverForm.country) return [];
    const country = countriesData.find(
      (item) => item.countryName === caregiverForm.country,
    );
    if (!country) return [];
    if (country.cities?.length) return country.cities.map((item) => item.cityName);
    return country.cityName || [];
  }, [countriesData, caregiverForm.country]);

  const selectedDaysCount = caregiverSchedule.filter((day) => day.selected).length;
  useEffect(() => {
    if (existingRole) return;
    if (requestedRole === "find care" || requestedRole === "find job") {
      setSelectedRole(requestedRole);
      setRootStep(2);
      setCaregiverStep(0);
    }
  }, [existingRole, requestedRole]);

  const handleRoleSelect = (role: PublicRole) => {
    setSelectedRole(role);
    setRootStep(2);
    setCaregiverStep(0);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const updateParentField = (
    key: keyof typeof EMPTY_PARENT_FORM,
    value: string,
  ) => {
    setParentForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCaregiverField = (
    key: keyof typeof EMPTY_CAREGIVER_FORM,
    value: string | number | boolean,
  ) => {
    setCaregiverForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleParentProfileChange = (file: File | null) => {
    setParentProfileImage(file);
    setParentProfilePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleCaregiverProfileChange = (file: File | null) => {
    setCaregiverProfileImage(file);
    setCaregiverProfilePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleParentSignup = async () => {
    if (
      !parentForm.firstName ||
      !parentForm.email ||
      !parentForm.password ||
      !parentForm.country ||
      !parentForm.city ||
      !parentForm.gender ||
      !parentForm.bio.trim() ||
      !parentProfileImage
    ) {
      toast.error("Please complete all required Parent details.");
      return;
    }

    setIsSubmittingParent(true);
    try {
      const payload = new FormData();
      payload.append("firstName", parentForm.firstName);
      payload.append("lastName", parentForm.lastName);
      payload.append("email", parentForm.email);
      payload.append("password", parentForm.password);
      payload.append("country", parentForm.country);
      payload.append("city", parentForm.city);
      payload.append("gender", parentForm.gender);
      payload.append("bio", parentForm.bio);
      payload.append("role", "find care");
      payload.append("profileImage", parentProfileImage);
      if (ambassadorCode) {
        payload.append("referralCode", ambassadorCode);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: payload,
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to create your account");
      }

      toast.success("Parent account created successfully. Please log in.");
      setParentProfileImage(null);
      setParentProfilePreview("");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create your account",
      );
    } finally {
      setIsSubmittingParent(false);
    }
  };

  const handleCaregiverNext = () => {
    if (caregiverStep === 0) {
      if (selectedCategoryIds.length === 0) {
        toast.error("Please select at least one service category for signup.");
        return;
      }
      setCaregiverStep(1);
      return;
    }

    if (caregiverStep === 1) {
      if (!caregiverForm.email || !caregiverForm.ageVerified) {
        toast.error("Please enter your email and confirm your age.");
        return;
      }
      setCaregiverStep(2);
      return;
    }

    if (caregiverStep === 2) {
      if (!caregiverForm.password || caregiverForm.password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      setCaregiverStep(3);
      return;
    }

    if (caregiverStep === 3) {
      if (
        !caregiverForm.firstName ||
        !caregiverForm.lastName ||
        !caregiverForm.gender ||
        !caregiverForm.bio.trim() ||
        !caregiverProfileImage ||
        !caregiverForm.termsAccepted
      ) {
        toast.error("Please complete your personal details.");
        return;
      }
      setCaregiverStep(4);
      return;
    }

    if (caregiverStep === 4) {
      if (!caregiverForm.country || !caregiverForm.city) {
        toast.error("Please select your country and city.");
        return;
      }
      setCaregiverStep(5);
      return;
    }

    if (caregiverStep === 5) {
      setCaregiverStep(6);
    }
  };

  const handleCaregiverBack = () => {
    if (caregiverStep === 0) {
      setRootStep(1);
      setSelectedRole("");
      return;
    }
    setCaregiverStep((prev) => (prev - 1) as CaregiverStep);
  };

  const toggleScheduleDay = (day: string) => {
    setCaregiverSchedule((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const updateScheduleTime = (day: string, value: string) => {
    setCaregiverSchedule((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, time: value } : item,
      ),
    );
  };

  const applySameTimeToAll = () => {
    const firstSelected = caregiverSchedule.find((day) => day.selected);
    if (!firstSelected) return;
    setCaregiverSchedule((prev) =>
      prev.map((item) =>
        item.selected ? { ...item, time: firstSelected.time } : item,
      ),
    );
  };

  const handleCaregiverSubmit = async () => {
    if (selectedDaysCount === 0) {
      toast.error("Please select at least one available day.");
      return;
    }

    setIsSubmittingCaregiver(true);
    try {
      const selectedSchedule = caregiverSchedule.filter((day) => day.selected);
      const days = selectedSchedule.map((item) => {
        const [startTime, endTime] = item.time.split("-").map((value) => value.trim());
        return {
          day: item.day,
          startTime: startTime || "09:00 AM",
          endTime: endTime || "05:00 PM",
        };
      });

      const payload = new FormData();
      payload.append("role", "find job");
      payload.append("email", caregiverForm.email);
      payload.append("password", caregiverForm.password);
      payload.append("firstName", caregiverForm.firstName);
      payload.append("lastName", caregiverForm.lastName);
      payload.append("gender", caregiverForm.gender);
      payload.append("country", caregiverForm.country);
      payload.append("city", caregiverForm.city);
      payload.append("bio", caregiverForm.bio);
      payload.append("hourRate", String(caregiverForm.hourRate));
      payload.append("days", JSON.stringify(days));
      if (ambassadorCode) {
        payload.append("referralCode", ambassadorCode);
        payload.append("onboardingSource", "city_ambassador");
      }
      if (caregiverProfileImage) {
        payload.append("profileImage", caregiverProfileImage);
      }

      for (const categoryId of selectedCategoryIds) {
        const categoryPayload = new FormData();
        payload.forEach((value, key) => categoryPayload.append(key, value));
        categoryPayload.append("categoryId", categoryId);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/service/register-service`,
          {
            method: "POST",
            body: categoryPayload,
          },
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Unable to create caregiver account");
        }
      }

      setCaregiverProfileImage(null);
      setCaregiverProfilePreview("");
      setIsApprovalDialogOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create caregiver account",
      );
    } finally {
      setIsSubmittingCaregiver(false);
    }
  };

  const caregiverHeading = [
    "Choose Category",
    "Email Address",
    "Create Password",
    "Personal Details",
    "Location",
    "Hourly Rate",
    "Schedule",
  ][caregiverStep];

  const caregiverSubheading = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ][caregiverStep];

  const openLogin = () => {
    setIsApprovalDialogOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dffcf9_0%,#f7fffe_32%,#ffffff_68%)] pt-24 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-[#6de4d7]/20 blur-3xl" />
        <div className="absolute right-[-6%] top-32 h-80 w-80 rounded-full bg-[#9cc7ff]/20 blur-3xl" />
      </div>

      <div className="container relative max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#cbeeea] bg-white/90 px-5 py-2 text-sm font-semibold text-[#149d90] shadow-sm">
            <Sparkles className="h-4 w-4" />
            JetSet Cares Signup
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#16324f] sm:text-5xl">
            Create Your Account
          </h1>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-[2.25rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,248,247,0.92))] p-6 shadow-[0_30px_90px_rgba(22,50,79,0.12)] backdrop-blur md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0A0A23] md:text-2xl lg:text-3xl">
                {rootStep === 1
                  ? "Let's get started. Choose an option:"
                  : selectedRole === "find care"
                    ? "Parent Details"
                    : caregiverHeading}
              </h2>
              {(rootStep === 1 || caregiverSubheading) && (
                <p className="mt-2 text-sm text-[#3B3B4F] md:text-base">
                  {rootStep === 1
                    ? "Select your role"
                    : selectedRole === "find care"
                      ? "Complete the form below"
                      : caregiverSubheading}
                </p>
              )}
            </div>
            <Link
              href="/"
              className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:inline-flex"
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Link>
          </div>

          {rootStep === 1 && (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="flex-1 relative">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("find care")}
                  className="group relative w-full overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9fbf8] md:h-20 md:w-20">
                    <Image
                      src="/icon1.png"
                      alt="Parent account"
                      width={80}
                      height={80}
                      className="h-10 w-10 object-contain md:h-12 md:w-12"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#0A0A23] md:text-xl">
                    Find Trusted Care
                  </h3>
                  <p className="mb-6 text-sm leading-6 text-[#3B3B4F]">
                    Create an account to browse trusted care and book when you&apos;re ready.
                  </p>
                  <div className="flex items-center justify-between rounded-full bg-[#3ee0cf] px-4 py-3 text-sm font-bold text-slate-950 md:text-base">
                    <span>Continue as Parent</span>
                    <MoveRight className="h-5 w-5" />
                  </div>
                </button>
              </div>

              <div className="flex-1 relative">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("find job")}
                  className="group relative w-full overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9fbf8] md:h-20 md:w-20">
                    <Image
                      src="/icon2.png"
                      alt="Find Trusted Care account"
                      width={80}
                      height={80}
                      className="h-10 w-10 object-contain md:h-12 md:w-12"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#0A0A23] md:text-xl">
                    Join as a Partner
                  </h3>
                  <p className="mb-6 text-sm leading-6 text-[#3B3B4F]">
                    Select your service category and complete the full provider signup here.
                  </p>
                  <div className="flex items-center justify-between rounded-full bg-[#3ee0cf] px-4 py-3 text-sm font-bold text-slate-950 md:text-base">
                    <span>Continue as Partner</span>
                    <MoveRight className="h-5 w-5" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {existingRole && (
            <div className="mt-6 rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-700">
                You are currently signed in as{" "}
                <span className="font-semibold">{roleLabelMap[existingRole]}</span>.
              </p>
            </div>
          )}
        </div>

        {rootStep === 2 && selectedRole === "find care" && (
          <div className={sectionShell}>
            <div className="mx-auto mt-8 max-w-4xl">
              <div className={fieldGrid}>
                <Input
                  value={parentForm.firstName}
                  onChange={(e) => updateParentField("firstName", e.target.value)}
                  className={fieldClass}
                  placeholder="First name"
                />
                <Input
                  value={parentForm.lastName}
                  onChange={(e) => updateParentField("lastName", e.target.value)}
                  className={fieldClass}
                  placeholder="Last name"
                />
                <Input
                  type="email"
                  value={parentForm.email}
                  onChange={(e) => updateParentField("email", e.target.value)}
                  className={fieldClass}
                  placeholder="Email address"
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={parentForm.password}
                    onChange={(e) => updateParentField("password", e.target.value)}
                    className={`${fieldClass} pr-10`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Select
                  value={parentForm.country}
                  onValueChange={(value) => {
                    updateParentField("country", value);
                    updateParentField("city", "");
                  }}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder={isCountryLoading ? "Loading countries..." : "Country"} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country._id} value={country.countryName}>
                        {country.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={parentForm.city}
                  onValueChange={(value) => updateParentField("city", value)}
                  disabled={!parentForm.country || parentCities.length === 0}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder={parentForm.country ? "City" : "Select country first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={parentForm.gender}
                  onValueChange={(value) => updateParentField("gender", value)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Profile photo
                  </label>
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleParentProfileChange(e.target.files?.[0] || null)
                      }
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#3ee0cf] file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-[#2bcfbe]"
                    />
                    {parentProfilePreview && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3">
                        <Image
                          src={parentProfilePreview}
                          alt="Parent preview"
                          width={56}
                          height={56}
                          unoptimized
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <p className="text-sm text-slate-600">
                          Profile picture selected
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    value={parentForm.bio}
                    onChange={(e) => updateParentField("bio", e.target.value)}
                    className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-[15px] text-slate-900 shadow-sm outline-none focus:border-[#3ee0cf] focus-visible:ring-2 focus-visible:ring-[#3ee0cf]"
                    placeholder="Short bio about you"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#16978e] hover:underline">
                  Log in
                </Link>
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRootStep(1);
                    setSelectedRole("");
                  }}
                  className="h-11 rounded-full"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleParentSignup}
                  disabled={isSubmittingParent}
                  className="h-11 rounded-full bg-[#3ee0cf] px-8 text-slate-950 hover:bg-[#2bcfbe]"
                >
                  {isSubmittingParent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account
                    </>
                  ) : (
                    "Create Parent Account"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {rootStep === 2 && selectedRole === "find job" && (
          <div className={`${sectionShell} mx-auto max-w-5xl`}>
            <div className="mb-8 rounded-[1.5rem] border border-slate-100 bg-[linear-gradient(180deg,#ffffff,#f8fcfc)] p-5 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#149d90]">
                    Find Trusted Care
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
                    {caregiverHeading}
                  </h3>
                </div>
                {selectedCategories.length > 0 && (
                  <div className="hidden rounded-full bg-[#dffbf8] px-4 py-2 text-sm font-semibold text-[#149d90] md:block">
                    {selectedCategories.length} categor
                    {selectedCategories.length === 1 ? "y" : "ies"} selected
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2.5 flex-1 rounded-full transition-all ${
                    caregiverStep >= index ? "bg-[#3ee0cf]" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {caregiverStep === 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {isCategoryLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-[290px] animate-pulse rounded-[1.75rem] bg-slate-100"
                        />
                      ))
                    : categories.map((category) => {
                        const active = selectedCategoryIds.includes(category._id);
                        return (
                          <button
                            key={category._id}
                            type="button"
                            onClick={() => toggleCategory(category._id)}
                            className={`overflow-hidden rounded-[1.75rem] border bg-white text-left transition-all ${
                              active
                                ? "border-[#3ee0cf] shadow-[0_18px_45px_rgba(62,224,207,0.24)] ring-2 ring-[#b8f7f0]"
                                : "border-slate-200 hover:-translate-y-1 hover:border-[#8ddfd8] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                            }`}
                          >
                            <div className="relative h-44 w-full bg-slate-100">
                              <Image
                                src={category.image || "/placeholder.png"}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-lg font-semibold text-[#16324f]">
                                    {category.name}
                                  </p>
                                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                                    {category.findCareUser.length + category.findJobUser.length} active members
                                  </p>
                                </div>
                                {active && (
                                  <span className="inline-flex rounded-full bg-[#dffbf8] px-3 py-1 text-xs font-semibold text-[#16978e]">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="mt-4 text-sm font-medium text-[#16978e]">
                                {active ? "Selected" : "Click to select"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                </div>
              </>
            )}

            {caregiverStep === 1 && (
              <div className={stepCard}>
                <div className="mx-auto max-w-2xl space-y-4">
                <Input
                  type="email"
                  value={caregiverForm.email}
                  onChange={(e) => updateCaregiverField("email", e.target.value)}
                  className={fieldClass}
                  placeholder="Email address"
                />
                <label className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={caregiverForm.ageVerified}
                    onChange={(e) =>
                      updateCaregiverField("ageVerified", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  I verify that I am at least 18 years old
                </label>
                </div>
              </div>
            )}

            {caregiverStep === 2 && (
              <div className={stepCard}>
                <div className="mx-auto max-w-2xl space-y-4">
                <Input
                  type="email"
                  value={caregiverForm.email}
                  disabled
                  className={`${fieldClass} bg-slate-100`}
                  placeholder="Email address"
                />
                <div className="relative">
                  <Input
                    type={showCaregiverPassword ? "text" : "password"}
                    value={caregiverForm.password}
                    onChange={(e) =>
                      updateCaregiverField("password", e.target.value)
                    }
                    className={`${fieldClass} pr-10`}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCaregiverPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showCaregiverPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                </div>
              </div>
            )}

            {caregiverStep === 3 && (
              <div className={stepCard}>
                <div className={fieldGrid}>
                <Input
                  value={caregiverForm.firstName}
                  onChange={(e) =>
                    updateCaregiverField("firstName", e.target.value)
                  }
                  className={fieldClass}
                  placeholder="First name"
                />
                <Input
                  value={caregiverForm.lastName}
                  onChange={(e) =>
                    updateCaregiverField("lastName", e.target.value)
                  }
                  className={fieldClass}
                  placeholder="Last name"
                />
                <Select
                  value={caregiverForm.gender}
                  onValueChange={(value) =>
                    updateCaregiverField("gender", value)
                  }
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Profile photo
                  </label>
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleCaregiverProfileChange(
                          e.target.files?.[0] || null,
                        )
                      }
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#3ee0cf] file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-[#2bcfbe]"
                    />
                    {caregiverProfilePreview && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3">
                        <Image
                          src={caregiverProfilePreview}
                          alt="Partner preview"
                          width={56}
                          height={56}
                          unoptimized
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <p className="text-sm text-slate-600">
                          Profile picture selected
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    value={caregiverForm.bio}
                    onChange={(e) =>
                      updateCaregiverField("bio", e.target.value)
                    }
                    className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-[15px] text-slate-900 shadow-sm outline-none focus:border-[#3ee0cf] focus-visible:ring-2 focus-visible:ring-[#3ee0cf]"
                    placeholder="Short bio about your care experience"
                  />
                </div>
                </div>
                <label className="mx-auto mt-5 flex max-w-4xl items-start gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={caregiverForm.termsAccepted}
                    onChange={(e) =>
                      updateCaregiverField("termsAccepted", e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <span>
                    I agree to the{" "}
                    <PolicyModalLinks linkClassName="text-[#16978e] underline" />
                  </span>
                </label>
              </div>
            )}

            {caregiverStep === 4 && (
              <div className={stepCard}>
              <div className={fieldGrid}>
                <Select
                  value={caregiverForm.country}
                  onValueChange={(value) => {
                    updateCaregiverField("country", value);
                    updateCaregiverField("city", "");
                  }}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder={isCountryLoading ? "Loading countries..." : "Country"} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country._id} value={country.countryName}>
                        {country.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={caregiverForm.city}
                  onValueChange={(value) => updateCaregiverField("city", value)}
                  disabled={!caregiverForm.country || caregiverCities.length === 0}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder={caregiverForm.country ? "City" : "Select country first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {caregiverCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              </div>
            )}

            {caregiverStep === 5 && (
              <div className={stepCard}>
              <div className="mx-auto max-w-2xl space-y-8">
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    My hourly rate
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-[#16324f]">
                    ${caregiverForm.hourRate}
                    <span className="ml-1 text-base font-normal text-slate-500">
                      /hour
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-8">
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={caregiverForm.hourRate}
                    onChange={(e) =>
                      updateCaregiverField("hourRate", Number(e.target.value))
                    }
                    className="w-full cursor-pointer appearance-none"
                    style={{
                      accentColor: "#3ee0cf",
                    }}
                  />
                </div>
              </div>
              </div>
            )}

            {caregiverStep === 6 && (
              <div className={stepCard}>
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {caregiverSchedule.map((item) => (
                    <button
                      key={item.day}
                      type="button"
                      onClick={() => toggleScheduleDay(item.day)}
                      className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                        item.selected
                          ? "border-[#3ee0cf] bg-[#3ee0cf] text-slate-950 shadow-md"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {item.day}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applySameTimeToAll}
                    disabled={selectedDaysCount === 0}
                    className="rounded-full"
                  >
                    Apply same time to all
                  </Button>
                </div>

                {selectedDaysCount > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {caregiverSchedule
                      .filter((item) => item.selected)
                      .map((item) => (
                        <div
                          key={item.day}
                          className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                        >
                          <p className="mb-2 font-semibold text-[#16324f]">
                            {item.day}
                          </p>
                          <Input
                            value={item.time}
                            onChange={(e) =>
                              updateScheduleTime(item.day, e.target.value)
                            }
                            className={`${fieldClass} bg-white`}
                            placeholder="09:00 AM-05:00 PM"
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Select at least one day to continue.
                  </div>
                )}
              </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {selectedCategories.length
                  ? `Selected categories: ${selectedCategories.map((category) => category.name).join(", ")}`
                  : "Choose the path that fits you best."}
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCaregiverBack}
                  className="h-11 rounded-full"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {caregiverStep < 6 ? (
                  <Button
                    type="button"
                    onClick={handleCaregiverNext}
                    className="h-11 rounded-full bg-[#3ee0cf] px-8 text-slate-950 hover:bg-[#2bcfbe]"
                  >
                    Continue
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCaregiverSubmit}
                    disabled={isSubmittingCaregiver}
                    className="h-11 rounded-full bg-[#3ee0cf] px-8 text-slate-950 hover:bg-[#2bcfbe]"
                  >
                    {isSubmittingCaregiver ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account
                      </>
                    ) : (
                      "Create Find Trusted Care Account"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="overflow-hidden rounded-[1.75rem] border-none p-0">
          <div className="bg-[linear-gradient(180deg,#effcfa,#ffffff)] p-8">
            <DialogHeader className="items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dffbf8] text-[#149d90]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <DialogTitle className="mt-4 text-2xl text-[#16324f]">
                Profile Submitted
              </DialogTitle>
              <DialogDescription className="max-w-md text-center text-sm leading-6 text-slate-600">
                Your Partner profile has been submitted successfully.
                The admin team will review your profile before approval.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-600">
              You can log in after approval and continue managing your profile from there.
            </div>

            <DialogFooter className="mt-8 sm:justify-center">
              <Button
                type="button"
                onClick={openLogin}
                className="h-11 w-full rounded-full bg-[#3ee0cf] text-slate-950 hover:bg-[#2bcfbe] sm:w-auto sm:px-8"
              >
                Go to Login
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
