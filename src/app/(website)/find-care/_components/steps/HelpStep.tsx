// src/components/steps/HelpStep.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HelpStepProps {
  onNext: (data: { help: string }) => void;
  onBack: () => void;
  initialValue?: string;
}

export function HelpStep({ onNext, onBack, initialValue = "" }: HelpStepProps) {
  const [help, setHelp] = useState(initialValue);

  const handleContinue = () => {
    if (help.trim()) {
      onNext({ help });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-8">
        What kind of help are you looking for?
      </h1>
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <div className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="type here..."
              value={help}
              onChange={(e) => setHelp(e.target.value)}
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
              disabled={!help.trim()}
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
