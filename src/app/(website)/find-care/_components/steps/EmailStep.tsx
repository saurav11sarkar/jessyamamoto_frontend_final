// src/components/steps/EmailStep.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EmailStepProps {
  onNext: (data: { email: string; ageVerified: boolean }) => void;
  onBack: () => void;
}

export function EmailStep({ onNext, onBack }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [ageVerified, setAgeVerified] = useState(false);

  const handleContinue = () => {
    if (email.trim() && ageVerified) {
      onNext({ email, ageVerified });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-8">
        What&apos;s your email address?
      </h1>
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <div className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Write Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-[#8E8E9A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="age"
              checked={ageVerified}
              onChange={(e) => setAgeVerified(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="age"
              className="text-sm cursor-pointer text-[#4B4B4B]"
            >
              I verify that I am at least 18 years old
            </label>
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
              disabled={!email || !ageVerified}
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
