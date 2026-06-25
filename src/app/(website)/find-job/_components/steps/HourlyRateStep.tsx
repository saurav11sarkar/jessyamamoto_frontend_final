// src/components/steps/HourlyRateStep.tsx (আপডেটেড)
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FindJobDataTypes } from "../find-job-data-type";

interface HourlyRateStepProps {
  data: Partial<FindJobDataTypes>;
  onNext: (data: Partial<FindJobDataTypes>) => void;
  onBack: () => void;
}

export function HourlyRateStep({ data, onNext, onBack }: HourlyRateStepProps) {
  const [hourRate, setHourRate] = useState<number>(data.hourRate ?? 10);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("findJobForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.hourRate !== undefined) {
          setHourRate(parsed.hourRate);
        }
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }
  }, []);

  const handleContinue = () => {
    const payload: Partial<FindJobDataTypes> = {
      hourRate,
    };

    // Persist merged data
    localStorage.setItem(
      "findJobForm",
      JSON.stringify({ ...data, ...payload }),
    );

    onNext(payload);
  };

  const progress = ((hourRate - 5) / 95) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Which jobs are you open to?
        </h1>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-4">
              My hourly rate
            </label>

            <p className="text-2xl font-bold mb-4">
              ${hourRate}
              <span className="text-base font-normal text-gray-600">/hour</span>
            </p>

            <input
              type="range"
              min={5}
              max={100}
              value={hourRate}
              onChange={(e) => setHourRate(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(
                  to right,
                  #003366 0%,
                  #003366 ${progress}%,
                  #d3d3d3 ${progress}%,
                  #d3d3d3 100%
                )`,
              }}
            />
          </div>

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
