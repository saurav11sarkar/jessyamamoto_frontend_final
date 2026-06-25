// src/components/steps/TypeStep.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TypeStepProps {
  onNext: (data: { type: string }) => void;
  onBack: () => void;
  initialValue?: string;
}

export function TypeStep({ onNext, onBack, initialValue = "" }: TypeStepProps) {
  const [type, setType] = useState(initialValue);

  const handleContinue = () => {
    if (type.trim()) {
      onNext({ type });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-8">
        What type of care are you interested in?
      </h1>
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <div className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="type here..."
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-[#8E8E9A]"
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
              disabled={!type.trim()}
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
