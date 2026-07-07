// src/components/steps/LocationStep.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FindJobDataTypes } from "../find-job-data-type";
import { isSameLocationName, normalizeLocationName } from "@/lib/utils";

interface Country {
  _id: string;
  countryName: string;
  cities?: Array<{
    cityName: string;
    neighborhoods?: string[];
  }>;
  cityName?: string | string[];
}

interface LocationStepProps {
  data: FindJobDataTypes;
  onNext: (data: Partial<FindJobDataTypes>) => void;
  onBack: () => void;
}

export function LocationStep({ data, onNext, onBack }: LocationStepProps) {
  const [selectedCountry, setSelectedCountry] = useState(data.country || "");
  const [selectedCity, setSelectedCity] = useState(data.city || "");
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Fetch countries data
  const { data: countriesData, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/country/?limit=1000&sortBy=countryName&sortOrder=asc`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const json = await response.json();
      return json.data as Country[];
    },
  });

  // Get unique countries
  const uniqueCountries = countriesData
    ? Array.from(
        new Map(countriesData.map((item) => [normalizeLocationName(item.countryName), item])).values(),
      )
    : [];

  const getCitiesForCountry = useCallback((countryName: string) => {
    if (!countriesData) return [];

    const cities = countriesData
      .filter((item) => isSameLocationName(item.countryName, countryName))
      .flatMap((item) => {
        if (item.cities?.length) {
          return item.cities.map((city) => city.cityName);
        }
        if (Array.isArray(item.cityName)) {
          return item.cityName;
        }
        return item.cityName ? [item.cityName] : [];
      })
      .map((city) => city.trim())
      .filter(Boolean);

    return Array.from(new Set(cities));
  }, [countriesData]);

  // Reconcile the saved country (which may be an older/differently-cased
  // value) with the canonical casing from the Country list, so the <select>
  // can actually match and display it as selected.
  useEffect(() => {
    if (!countriesData || !selectedCountry) return;
    const canonicalCountry = countriesData.find((c) =>
      isSameLocationName(c.countryName, selectedCountry),
    );
    if (canonicalCountry && canonicalCountry.countryName !== selectedCountry) {
      setSelectedCountry(canonicalCountry.countryName);
    }
  }, [countriesData, selectedCountry]);

  // Update cities when country changes
  useEffect(() => {
    if (selectedCountry && countriesData) {
      const cities = getCitiesForCountry(selectedCountry);
      setAvailableCities(cities);
      setSelectedCity((current) => {
        if (!current) return "";
        const canonicalCity = cities.find((c) => isSameLocationName(c, current));
        return canonicalCity ?? "";
      });
      setCustomCity((current) => (current ? current : ""));
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, countriesData, getCitiesForCountry]);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("findJobForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.country) setSelectedCountry(parsed.country);
        if (parsed.city) setSelectedCity(parsed.city);
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }
  }, []);

  const finalCity = useCustomCity ? customCity.trim() : selectedCity;

  const handleContinue = () => {
    if (!selectedCountry || !finalCity) return;

    const payload: Partial<FindJobDataTypes> = {
      country: selectedCountry,
      city: finalCity,
    };

    localStorage.setItem(
      "findJobForm",
      JSON.stringify({ ...data, ...payload }),
    );

    onNext(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Where would you like to work?
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedCity("");
                setCustomCity("");
                setUseCustomCity(false);
              }}
              className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-primary bg-white"
            >
              <option value="">Select a country...</option>
              {uniqueCountries.map((country) => (
                <option key={country._id} value={country.countryName}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {useCustomCity ? "Type Your City" : "Select City"}
              </label>
              {useCustomCity ? (
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="Type your city name..."
                  className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-primary bg-white"
                />
              ) : (
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">Select a city...</option>
                  {availableCities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => {
                  setUseCustomCity(!useCustomCity);
                  setSelectedCity("");
                  setCustomCity("");
                }}
                className="text-sm text-primary hover:underline mt-2"
              >
                {useCustomCity
                  ? "Select from list instead"
                  : "My city is not listed"}
              </button>
            </div>
          )}

          <p className="text-sm text-gray-600">
            We&apos;ll use this to find jobs near you
          </p>

          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-2 rounded-full font-semibold bg-transparent"
            >
              Back
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedCountry || !finalCity}
              className="flex-1 bg-primary hover:bg-primary text-white py-2 rounded-full font-semibold"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
