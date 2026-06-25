// src/components/steps/LocationStep.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface Country {
  _id: string;
  countryName: string;
  cities?: Array<{
    cityName: string;
    neighborhoods: string[];
  }>;
  cityName?: string[]; // For backward compatibility
}

interface LocationStepProps {
  onNext: (data: { country: string; city: string; neighborhood?: string }) => void;
  onBack: () => void;
  initialCountry?: string;
  initialCity?: string;
  initialNeighborhood?: string;
}

export function LocationStep({
  onNext,
  onBack,
  initialCountry = "",
  initialCity = "",
  initialNeighborhood = "",
}: LocationStepProps) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialNeighborhood);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);

  // Fetch countries data
  const { data: countriesData, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/country/`);
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const json = await response.json();
      return json.data as Country[];
    },
  });

  // Get unique countries
  const uniqueCountries = countriesData
    ? Array.from(new Map(countriesData.map(item => [item.countryName, item])).values())
    : [];

  // Helper function to get cities with their neighborhoods
  const getCityNeighborhoods = (countryName: string, cityName: string): string[] => {
    const country = countriesData?.find((c) => c.countryName === countryName);
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
  useEffect(() => {
    if (selectedCountry && countriesData) {
      const country = countriesData.find((c) => c.countryName === selectedCountry);
      let cities: string[] = [];

      if (country?.cities && country.cities.length > 0) {
        // New format with cities array
        cities = country.cities.map((item) => item.cityName);
      } else if (country?.cityName && country.cityName.length > 0) {
        // Old format with cityName array
        cities = country.cityName;
      }

      setAvailableCities(cities);
      setSelectedCity("");
      setCustomCity("");
      setUseCustomCity(false);
      setSelectedNeighborhood("");
      setAvailableNeighborhoods([]);
    } else {
      setAvailableCities([]);
      setAvailableNeighborhoods([]);
    }
  }, [selectedCountry, countriesData]);

  // Update neighborhoods when city changes
  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const neighborhoods = getCityNeighborhoods(selectedCountry, selectedCity);
      setAvailableNeighborhoods(neighborhoods);
      setSelectedNeighborhood(""); // Reset neighborhood when city changes
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [selectedCountry, selectedCity]);

  // Set initial values if provided
  useEffect(() => {
    if (initialCity && availableCities.includes(initialCity)) {
      setSelectedCity(initialCity);
    }
  }, [initialCity, availableCities]);

  useEffect(() => {
    if (initialNeighborhood && availableNeighborhoods.includes(initialNeighborhood)) {
      setSelectedNeighborhood(initialNeighborhood);
    }
  }, [initialNeighborhood, availableNeighborhoods]);

  const finalCity = useCustomCity ? customCity.trim() : selectedCity;

  const handleContinue = () => {
    if (selectedCountry && finalCity) {
      onNext({
        country: selectedCountry,
        city: finalCity,
        neighborhood: selectedNeighborhood || undefined
      });
    }
  };

  const isValid = selectedCountry && finalCity;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-8">
        Where are you looking for care?
      </h1>
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  setSelectedNeighborhood("");
                  setAvailableNeighborhoods([]);
                }}
                className="text-sm text-primary hover:underline mt-2"
              >
                {useCustomCity
                  ? "Select from list instead"
                  : "My city is not listed"}
              </button>
            </div>
          )}

          {!useCustomCity && selectedCity && availableNeighborhoods.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Neighborhood (Optional)
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Select a neighborhood (optional)</option>
                {availableNeighborhoods.map((neighborhood, index) => (
                  <option key={index} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Select a neighborhood to find more specific care providers
              </p>
            </div>
          )}

          {!useCustomCity && selectedCity && availableNeighborhoods.length === 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ No specific neighborhoods listed for {selectedCity}. You can continue with just the city.
              </p>
            </div>
          )}

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
              disabled={!isValid}
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