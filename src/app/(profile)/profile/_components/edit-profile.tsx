/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  experience: z.number().optional(),
  language: z.array(z.string()).default([]),
  languageLavel: z.string().optional(),
  profileImage: z.string().optional(),
  galary: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  agegroup: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  canHelpWith: z.array(z.string()).default([]),
  professionalSkill: z.array(z.string()).default([]),
  perferences: z.array(z.string()).default([]),
  neighborhoods: z.string().optional(),
});

type ProfileFormValues = z.input<typeof profileSchema>;

interface Country {
  _id: string;
  countryName: string;
  cities?: Array<{
    cityName: string;
    neighborhoods: string[];
  }>;
  cityName?: string[]; // For backward compatibility
}

interface Language {
  _id: string;
  languageName: string;
}

const MAX_PROFILE_PHOTOS = 6;
const LANGUAGE_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

const getPrimaryImage = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const isImageSource = (value: string) =>
  /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(value);

const isPdfSource = (value: string) => /\.pdf(\?.*)?$/i.test(value);

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const EditProfilePage = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<
    string[]
  >([]);
  const [countryValue, setCountryValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const [selectedMainPhoto, setSelectedMainPhoto] = useState("");
  const [existingCertificates, setExistingCertificates] = useState<string[]>(
    [],
  );
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [certificatePreviews, setCertificatePreviews] = useState<string[]>([]);
  const photoPreviewRef = React.useRef<string[]>([]);
  const certificatePreviewRef = React.useRef<string[]>([]);

  // Tag input states
  const [currentSkillTag, setCurrentSkillTag] = useState("");
  const [currentEducationTag, setCurrentEducationTag] = useState("");
  const [currentAgeGroupTag, setCurrentAgeGroupTag] = useState("");
  const [currentCanHelpWithTag, setCurrentCanHelpWithTag] = useState("");
  const [currentPreferenceTag, setCurrentPreferenceTag] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: session?.user?.email || "",
      phone: "",
      bio: "",
      country: "",
      city: "",
      experience: 0,
      language: [],
      languageLavel: "",
      profileImage: "",
      galary: [],
      certifications: [],
      agegroup: [],
      education: [],
      canHelpWith: [],
      professionalSkill: [],
      perferences: [],
      neighborhoods: "",
    },
  });

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/country/`,
        );
        if (!response.ok) throw new Error("Failed to fetch countries");
        const json = await response.json();
        setCountries(json.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/language`,
        );
        if (!response.ok) throw new Error("Failed to fetch languages");
        const json = await response.json();
        setLanguages(json.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  // Helper function to get cities with their neighborhoods
  const getCityNeighborhoods = (
    countryName: string,
    cityName: string,
  ): string[] => {
    const country = countries.find((c) => c.countryName === countryName);
    if (!country) return [];

    // New API format with cities array containing neighborhoods
    if (country.cities && country.cities.length > 0) {
      const city = country.cities.find((c) => c.cityName === cityName);
      return city?.neighborhoods || [];
    }

    // Old format - no neighborhoods available
    return [];
  };

  // Update cities when country changes
  const updateCities = (countryName: string) => {
    if (countryName && countries) {
      const country = countries.find((c) => c.countryName === countryName);
      let cities: string[] = [];

      if (country?.cities && country.cities.length > 0) {
        // New format with cities array
        cities = country.cities.map((item) => item.cityName);
      } else if (country?.cityName && country.cityName.length > 0) {
        // Old format with cityName array
        cities = country.cityName;
      }

      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  };

  // Update neighborhoods when city changes
  const updateNeighborhoods = (countryName: string, cityName: string) => {
    if (countryName && cityName) {
      const neighborhoods = getCityNeighborhoods(countryName, cityName);
      setAvailableNeighborhoods(neighborhoods);

      // Reset neighborhoods value if current value is not in the new list
      const currentNeighborhood = form.getValues("neighborhoods");
      if (
        currentNeighborhood &&
        neighborhoods.length > 0 &&
        !neighborhoods.includes(currentNeighborhood)
      ) {
        form.setValue("neighborhoods", "");
      }
    } else {
      setAvailableNeighborhoods([]);
    }
  };

  // Sync local state with form values
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country") {
        setCountryValue(value.country || "");
        if (value.country) {
          updateCities(value.country);
        }
      }
      if (name === "city") {
        setCityValue(value.city || "");
        if (value.city && countryValue) {
          updateNeighborhoods(countryValue, value.city);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, countries, countryValue]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.accessToken) {
        setIsFetching(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const result = await response.json();
        const data = result.data;
        const primaryImage = getPrimaryImage(data.profileImage);
        const photos = Array.from(
          new Set([primaryImage, ...(data.galary || [])].filter(Boolean)),
        ) as string[];

        form.reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          country: data.country || "",
          city: data.city || "",
          experience: data.exprience || data.experience || 0,
          language: data.language || [],
          languageLavel: data.languageLavel || "",
          profileImage: primaryImage,
          galary: photos,
          certifications: data.certifications || [],
          agegroup: data.agegroup || [],
          education: data.education || [],
          canHelpWith: data.canHelpWith || [],
          professionalSkill: data.professionalSkill || [],
          perferences: data.perferences || [],
          neighborhoods: data.neighborhoods || "",
        });

        setCountryValue(data.country || "");
        setCityValue(data.city || "");
        setExistingPhotos(photos);
        setSelectedMainPhoto(primaryImage ? `existing:${primaryImage}` : "");
        setExistingCertificates(data.certifications || []);

        if (data.country) {
          updateCities(data.country);
          if (data.city) {
            updateNeighborhoods(data.country, data.city);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [session, form]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    setIsLoading(true);
    try {
      const selectedExistingMain = selectedMainPhoto.startsWith("existing:")
        ? selectedMainPhoto.replace("existing:", "")
        : "";
      const payload = {
        ...values,
        galary: existingPhotos,
        certifications: existingCertificates,
        profileImage: selectedExistingMain,
        mainPhotoSource: selectedMainPhoto,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      newPhotoFiles.forEach((file) => formData.append("galary", file));
      if (role === "find job") {
        certificateFiles.forEach((file) =>
          formData.append("certifications", file),
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await response.json();
      const data = result.data;
      const primaryImage = getPrimaryImage(data.profileImage);
      const photos = Array.from(
        new Set([primaryImage, ...(data.galary || [])].filter(Boolean)),
      ) as string[];
      setExistingPhotos(photos);
      setSelectedMainPhoto(primaryImage ? `existing:${primaryImage}` : "");
      setExistingCertificates(data.certifications || []);
      setNewPhotoFiles([]);
      setNewPhotoPreviews((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
      setCertificateFiles([]);
      setCertificatePreviews((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
      form.setValue("profileImage", primaryImage);
      form.setValue("galary", photos);
      form.setValue("certifications", data.certifications || []);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (
    field: keyof ProfileFormValues,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (!value.trim()) return;
    const currentValues = (form.getValues(field) as string[]) || [];
    if (!currentValues.includes(value.trim())) {
      form.setValue(field, [...currentValues, value.trim()]);
    }
    setter("");
  };

  const removeTag = (field: keyof ProfileFormValues, value: string) => {
    const currentValues = (form.getValues(field) as string[]) || [];
    form.setValue(
      field,
      currentValues.filter((item: string) => item !== value),
    );
  };

  const handlePhotoFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const remainingSlots =
      MAX_PROFILE_PHOTOS - existingPhotos.length - newPhotoFiles.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_PROFILE_PHOTOS} profile photos allowed`);
      return;
    }
    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const startIndex = newPhotoFiles.length;
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setNewPhotoFiles((prev) => [...prev, ...selectedFiles]);
    setNewPhotoPreviews((prev) => [...prev, ...previews]);
    if (!selectedMainPhoto && selectedFiles.length > 0) {
      selectMainPhoto(`new:${startIndex}`, previews[0] || "");
    }
  };

  const selectMainPhoto = (source: string, previewUrl = "") => {
    setSelectedMainPhoto(source);
    form.setValue(
      "profileImage",
      source.startsWith("existing:")
        ? source.replace("existing:", "")
        : previewUrl,
      { shouldDirty: true },
    );
  };

  const removeExistingPhoto = (url: string) => {
    const nextPhotos = existingPhotos.filter((photo) => photo !== url);
    setExistingPhotos(nextPhotos);
    if (selectedMainPhoto === `existing:${url}`) {
      const fallbackSource = nextPhotos[0]
        ? `existing:${nextPhotos[0]}`
        : newPhotoFiles[0]
          ? "new:0"
          : "";
      const fallbackPreview =
        fallbackSource === "new:0" ? newPhotoPreviews[0] : "";
      if (fallbackSource) {
        selectMainPhoto(fallbackSource, fallbackPreview);
      } else {
        setSelectedMainPhoto("");
        form.setValue("profileImage", "", { shouldDirty: true });
      }
    }
  };

  const removeNewPhoto = (index: number) => {
    URL.revokeObjectURL(newPhotoPreviews[index]);
    const nextFiles = newPhotoFiles.filter(
      (_, itemIndex) => itemIndex !== index,
    );
    const nextPreviews = newPhotoPreviews.filter(
      (_, itemIndex) => itemIndex !== index,
    );
    setNewPhotoFiles(nextFiles);
    setNewPhotoPreviews(nextPreviews);
    if (selectedMainPhoto === `new:${index}`) {
      const fallbackSource = existingPhotos[0]
        ? `existing:${existingPhotos[0]}`
        : nextFiles[0]
          ? "new:0"
          : "";
      const fallbackPreview = fallbackSource === "new:0" ? nextPreviews[0] : "";
      if (fallbackSource) {
        selectMainPhoto(fallbackSource, fallbackPreview);
      } else {
        setSelectedMainPhoto("");
        form.setValue("profileImage", "", { shouldDirty: true });
      }
    } else if (selectedMainPhoto.startsWith("new:")) {
      const selectedIndex = Number(selectedMainPhoto.replace("new:", ""));
      if (selectedIndex > index) {
        selectMainPhoto(
          `new:${selectedIndex - 1}`,
          nextPreviews[selectedIndex - 1] || "",
        );
      }
    }
  };

  const handleCertificateFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    setCertificateFiles((prev) => [...prev, ...selectedFiles]);
    setCertificatePreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeCertificateFile = (index: number) => {
    URL.revokeObjectURL(certificatePreviews[index]);
    setCertificateFiles((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
    setCertificatePreviews((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  useEffect(() => {
    photoPreviewRef.current = newPhotoPreviews;
  }, [newPhotoPreviews]);

  useEffect(() => {
    certificatePreviewRef.current = certificatePreviews;
  }, [certificatePreviews]);

  useEffect(() => {
    return () => {
      photoPreviewRef.current.forEach((url) => URL.revokeObjectURL(url));
      certificatePreviewRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const uniqueCountries = countries
    ? Array.from(
        new Map(countries.map((item) => [item.countryName, item])).values(),
      )
    : [];
  const selectedMainPhotoUrl = selectedMainPhoto.startsWith("existing:")
    ? selectedMainPhoto.replace("existing:", "")
    : selectedMainPhoto.startsWith("new:")
      ? newPhotoPreviews[Number(selectedMainPhoto.replace("new:", ""))]
      : existingPhotos[0] || newPhotoPreviews[0] || "";
  const totalProfilePhotos = existingPhotos.length + newPhotoFiles.length;

  return (
    <div className="mx-auto border shadow-lg p-5 rounded-xl">
      {isFetching ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      ) : (
        <>
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-black">Edit Profile</h1>
              <p className="text-gray-500">
                Update your personal information and expertise.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-black">First Name *</Label>
                  <Input
                    {...form.register("firstName")}
                    className="focus-visible:ring-[#00D1C1] mt-2"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-black">Last Name</Label>
                  <Input
                    {...form.register("lastName")}
                    className="focus-visible:ring-[#00D1C1] mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={form.watch("email")}
                    disabled
                    className="bg-gray-50 mt-2"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input {...form.register("phone")} className="mt-2" />
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Country</Label>
                  <select
                    value={countryValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCountryValue(value);
                      form.setValue("country", value);
                      form.setValue("city", "");
                      form.setValue("neighborhoods", "");
                      setCityValue("");
                      setAvailableNeighborhoods([]);
                      updateCities(value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D1C1] mt-2"
                  >
                    <option value="">Select country</option>
                    {uniqueCountries.map((country) => (
                      <option key={country._id} value={country.countryName}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>City</Label>
                  <select
                    value={cityValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCityValue(value);
                      form.setValue("city", value);
                      form.setValue("neighborhoods", "");
                      if (value && countryValue) {
                        updateNeighborhoods(countryValue, value);
                      }
                    }}
                    disabled={availableCities.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D1C1] mt-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {availableCities.length === 0
                        ? "Select country first"
                        : "Select city"}
                    </option>
                    {availableCities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Neighborhoods Field - Now properly conditional */}
              <div className="mt-4">
                <Label>Neighborhoods</Label>
                {!cityValue ? (
                  // No city selected yet
                  <div>
                    <Input
                      value=""
                      disabled
                      placeholder="Select a city first"
                      className="mt-2 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-amber-600 mt-1">
                      Please select a country and city first
                    </p>
                  </div>
                ) : availableNeighborhoods.length > 0 ? (
                  // City has predefined neighborhoods - show dropdown
                  <select
                    value={form.watch("neighborhoods") || ""}
                    onChange={(e) => {
                      form.setValue("neighborhoods", e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D1C1] mt-2"
                  >
                    <option value="">
                      Select a neighborhood in {cityValue}
                    </option>
                    {availableNeighborhoods.map((neighborhood, idx) => (
                      <option key={idx} value={neighborhood}>
                        {neighborhood}
                      </option>
                    ))}
                  </select>
                ) : (
                  // City has no predefined neighborhoods - allow manual input
                  <div>
                    <Input
                      {...form.register("neighborhoods")}
                      placeholder={`Enter your neighborhood in ${cityValue}`}
                      className="mt-2 focus-visible:ring-[#00D1C1]"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      No predefined neighborhoods found. You can type your
                      neighborhood manually.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  {...form.register("bio")}
                  className="min-h-[100px] mt-2"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-black text-lg">
                      Profile Pictures
                    </h3>
                    <p className="text-sm text-gray-500">
                      Upload up to {MAX_PROFILE_PHOTOS} photos and choose one as
                      the main image.
                    </p>
                  </div>
                  <Label className="inline-flex items-center gap-2 bg-[#00D1C1] hover:bg-[#00b8aa] text-white px-4 h-10 rounded-md cursor-pointer text-sm font-medium shadow-sm">
                    <Upload className="h-4 w-4" />
                    Upload
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        handlePhotoFiles(event.target.files);
                        event.target.value = "";
                      }}
                      className="hidden"
                    />
                  </Label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-100 shadow-sm">
                      {selectedMainPhotoUrl ? (
                        <img
                          src={selectedMainPhotoUrl}
                          alt="Selected profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                          <ImageIcon className="h-10 w-10" />
                          <span className="text-sm font-medium">
                            No photo selected
                          </span>
                        </div>
                      )}
                      {selectedMainPhotoUrl && (
                        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow">
                          Main Photo
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {totalProfilePhotos}/{MAX_PROFILE_PHOTOS} uploaded
                      </span>
                      <span className="text-gray-500">
                        Click a photo to set main
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {existingPhotos.map((photo) => (
                        <div
                          key={photo}
                          className={`group relative aspect-square rounded-lg overflow-hidden border bg-gray-50 transition-all ${
                            selectedMainPhoto === `existing:${photo}`
                              ? "ring-2 ring-[#00D1C1] ring-offset-2"
                              : "hover:border-[#00D1C1]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => selectMainPhoto(`existing:${photo}`)}
                            className="block h-full w-full"
                            aria-label="Set main profile photo"
                          >
                            <img
                              src={photo}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => selectMainPhoto(`existing:${photo}`)}
                            className="absolute left-2 top-2 rounded-full bg-white/90 p-1 text-primary shadow"
                            aria-label="Set main profile photo"
                          >
                            {selectedMainPhoto === `existing:${photo}` ? (
                              <CheckCircle2 className="h-5 w-5 fill-primary text-white" />
                            ) : (
                              <ImageIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingPhoto(photo)}
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            aria-label="Remove profile photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {newPhotoPreviews.map((preview, index) => (
                        <div
                          key={preview}
                          className={`group relative aspect-square rounded-lg overflow-hidden border bg-gray-50 transition-all ${
                            selectedMainPhoto === `new:${index}`
                              ? "ring-2 ring-[#00D1C1] ring-offset-2"
                              : "hover:border-[#00D1C1]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              selectMainPhoto(`new:${index}`, preview)
                            }
                            className="block h-full w-full"
                            aria-label="Set main profile photo"
                          >
                            <img
                              src={preview}
                              alt="New profile"
                              className="h-full w-full object-cover"
                            />
                          </button>
                          <div className="absolute bottom-2 left-2 rounded-full bg-[#00D1C1] px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              selectMainPhoto(`new:${index}`, preview)
                            }
                            className="absolute left-2 top-2 rounded-full bg-white/90 p-1 text-primary shadow"
                            aria-label="Set main profile photo"
                          >
                            {selectedMainPhoto === `new:${index}` ? (
                              <CheckCircle2 className="h-5 w-5 fill-primary text-white" />
                            ) : (
                              <ImageIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeNewPhoto(index)}
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            aria-label="Remove profile photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {totalProfilePhotos === 0 && (
                        <Label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-[#00D1C1] hover:bg-[#00D1C1]/5">
                          <Upload className="h-6 w-6" />
                          <span className="text-sm font-medium">
                            Upload photo
                          </span>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(event) => {
                              handlePhotoFiles(event.target.files);
                              event.target.value = "";
                            }}
                            className="hidden"
                          />
                        </Label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-black text-lg">Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Languages</Label>
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          const currentValues =
                            form.getValues("language") || [];
                          if (!currentValues.includes(value)) {
                            form.setValue("language", [
                              ...currentValues,
                              value,
                            ]);
                          }
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D1C1] mt-2"
                    >
                      <option value="">Select languages</option>
                      {languages.map((lang) => (
                        <option key={lang._id} value={lang.languageName}>
                          {lang.languageName}
                        </option>
                      ))}
                    </select>
                    {/* Replace this part */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("language")
                        ?.map((lang: string | any, index: number) => {
                          // Handle if lang is an object
                          const languageName =
                            typeof lang === "object" && lang !== null
                              ? lang.language ||
                                lang.languageName ||
                                Object.values(lang)[0]
                              : lang;

                          return (
                            <span
                              key={index}
                              className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {languageName}
                              <X
                                size={14}
                                className="cursor-pointer hover:text-red-400"
                                onClick={() => removeTag("language", lang)}
                              />
                            </span>
                          );
                        })}
                    </div>
                  </div>

                  <div>
                    <Label>Language Level</Label>
                    <select
                      {...form.register("languageLavel")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D1C1] mt-2"
                    >
                      <option value="">Select level</option>
                      {LANGUAGE_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Details - Only for find job role */}
              {session?.user?.role === "find job" && (
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <h3 className="font-semibold text-black text-lg">
                    Professional Details
                  </h3>

                  <div>
                    <Label>Experience (Years)</Label>
                    <Input
                      type="number"
                      {...form.register("experience", { valueAsNumber: true })}
                      className="mt-2"
                    />
                  </div>

                  {/* Professional Skills */}
                  <div className="space-y-2">
                    <Label>Professional Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentSkillTag}
                        onChange={(e) => setCurrentSkillTag(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(
                              "professionalSkill",
                              currentSkillTag,
                              setCurrentSkillTag,
                            );
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          addTag(
                            "professionalSkill",
                            currentSkillTag,
                            setCurrentSkillTag,
                          )
                        }
                        className="bg-[#00D1C1] hover:bg-[#00b8aa]"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("professionalSkill")
                        ?.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <X
                              size={14}
                              className="cursor-pointer hover:text-red-400"
                              onClick={() =>
                                removeTag("professionalSkill", skill)
                              }
                            />
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentEducationTag}
                        onChange={(e) => setCurrentEducationTag(e.target.value)}
                        placeholder="Add education..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(
                              "education",
                              currentEducationTag,
                              setCurrentEducationTag,
                            );
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          addTag(
                            "education",
                            currentEducationTag,
                            setCurrentEducationTag,
                          )
                        }
                        className="bg-[#00D1C1] hover:bg-[#00b8aa]"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("education")
                        ?.map((edu: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {edu}
                            <X
                              size={14}
                              className="cursor-pointer hover:text-red-400"
                              onClick={() => removeTag("education", edu)}
                            />
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Age Group */}
                  <div className="space-y-2">
                    <Label>Age Group Preference</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentAgeGroupTag}
                        onChange={(e) => setCurrentAgeGroupTag(e.target.value)}
                        placeholder="Add age group..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(
                              "agegroup",
                              currentAgeGroupTag,
                              setCurrentAgeGroupTag,
                            );
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          addTag(
                            "agegroup",
                            currentAgeGroupTag,
                            setCurrentAgeGroupTag,
                          )
                        }
                        className="bg-[#00D1C1] hover:bg-[#00b8aa]"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("agegroup")
                        ?.map((age: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {age}
                            <X
                              size={14}
                              className="cursor-pointer hover:text-red-400"
                              onClick={() => removeTag("agegroup", age)}
                            />
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Can Help With */}
                  <div className="space-y-2">
                    <Label>Can Help With</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentCanHelpWithTag}
                        onChange={(e) =>
                          setCurrentCanHelpWithTag(e.target.value)
                        }
                        placeholder="Add subject..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(
                              "canHelpWith",
                              currentCanHelpWithTag,
                              setCurrentCanHelpWithTag,
                            );
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          addTag(
                            "canHelpWith",
                            currentCanHelpWithTag,
                            setCurrentCanHelpWithTag,
                          )
                        }
                        className="bg-[#00D1C1] hover:bg-[#00b8aa]"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("canHelpWith")
                        ?.map((subject: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {subject}
                            <X
                              size={14}
                              className="cursor-pointer hover:text-red-400"
                              onClick={() => removeTag("canHelpWith", subject)}
                            />
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-2">
                    <Label>Preferences</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentPreferenceTag}
                        onChange={(e) =>
                          setCurrentPreferenceTag(e.target.value)
                        }
                        placeholder="Add preference..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(
                              "perferences",
                              currentPreferenceTag,
                              setCurrentPreferenceTag,
                            );
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          addTag(
                            "perferences",
                            currentPreferenceTag,
                            setCurrentPreferenceTag,
                          )
                        }
                        className="bg-[#00D1C1] hover:bg-[#00b8aa]"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("perferences")
                        ?.map((pref: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {pref}
                            <X
                              size={14}
                              className="cursor-pointer hover:text-red-400"
                              onClick={() => removeTag("perferences", pref)}
                            />
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Label>Certificates</Label>
                        <p className="text-sm text-gray-500">
                          Upload certificate images or PDF files.
                        </p>
                      </div>
                      <Label className="inline-flex items-center gap-2 border border-gray-300 px-4 h-10 rounded-md cursor-pointer text-sm font-medium hover:bg-gray-50 shadow-sm">
                        <Upload className="h-4 w-4" />
                        Add Files
                        <Input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={(event) => {
                            handleCertificateFiles(event.target.files);
                            event.target.value = "";
                          }}
                          className="hidden"
                        />
                      </Label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {existingCertificates.map((certificate) => (
                        <div
                          key={certificate}
                          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                          <div className="relative aspect-[4/3] bg-gray-50">
                            {isImageSource(certificate) ? (
                              <img
                                src={certificate}
                                alt="Certificate preview"
                                className="h-full w-full object-cover"
                              />
                            ) : isPdfSource(certificate) ? (
                              <iframe
                                src={certificate}
                                title="Certificate PDF preview"
                                className="h-full w-full"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                                <FileText className="h-10 w-10" />
                                <span className="text-sm font-medium">
                                  Certificate file
                                </span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setExistingCertificates((prev) =>
                                  prev.filter((item) => item !== certificate),
                                )
                              }
                              className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-red-600 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              aria-label="Remove certificate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-3 px-3 py-2">
                            <a
                              href={certificate}
                              target="_blank"
                              rel="noreferrer"
                              className="flex min-w-0 items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <FileText className="h-4 w-4 shrink-0" />
                              <span className="truncate">
                                {certificate.split("/").pop() || "Certificate"}
                              </span>
                            </a>
                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                              Saved
                            </span>
                          </div>
                        </div>
                      ))}
                      {certificateFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                          <div className="relative aspect-[4/3] bg-gray-50">
                            {file.type.startsWith("image/") ? (
                              <img
                                src={certificatePreviews[index]}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            ) : file.type === "application/pdf" ? (
                              <iframe
                                src={certificatePreviews[index]}
                                title={`${file.name} preview`}
                                className="h-full w-full"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                                <FileText className="h-10 w-10" />
                                <span className="text-sm font-medium">
                                  Preview unavailable
                                </span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeCertificateFile(index)}
                              className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-red-600 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              aria-label="Remove certificate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-3 px-3 py-2">
                            <div className="flex min-w-0 items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 shrink-0 text-primary" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#00D1C1]/10 px-2 py-0.5 text-[11px] font-medium text-[#008a80]">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {existingCertificates.length === 0 &&
                        certificateFiles.length === 0 && (
                          <Label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-[#00D1C1] hover:bg-[#00D1C1]/5">
                            <FileText className="h-8 w-8" />
                            <span className="text-sm font-medium">
                              Upload certificate files
                            </span>
                            <span className="text-xs text-gray-400">
                              Images and PDFs supported
                            </span>
                            <Input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              onChange={(event) => {
                                handleCertificateFiles(event.target.files);
                                event.target.value = "";
                              }}
                              className="hidden"
                            />
                          </Label>
                        )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-[#042a2a] text-white px-8 h-12 rounded-lg"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default EditProfilePage;
