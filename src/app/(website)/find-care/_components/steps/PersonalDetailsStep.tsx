/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PersonalDetailsStepProps {
  onNext: (data: {
    firstName: string;
    lastName: string;
    gender: string;
    termsAccepted: boolean;
  }) => void;
  onBack: () => void;
  initialData?: any;
  isLoggedIn?: boolean;
}

export function PersonalDetailsStep({
  onNext,
  onBack,
  initialData,
  isLoggedIn = false,
}: PersonalDetailsStepProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [gender, setGender] = useState(initialData?.gender || "");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || "");
      setLastName(initialData.lastName || "");
      setGender(initialData.gender || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (firstName.trim() && lastName.trim() && gender && termsAccepted) {
      onNext({ firstName, lastName, gender, termsAccepted });
    }
  };

  const isSubmitDisabled = () => {
    return !firstName || !lastName || !gender || !termsAccepted;
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 mt-10">
      <h1 className="text-3xl text-foreground font-bold text-center mb-8">
        Tell us about yourself
      </h1>

      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Nonbinary</option>
              <option value="cisgender-woman">Cisgender Woman</option>
              <option value="cisgender-man">Cisgender Man</option>
              <option value="transgender-woman">Transgender Woman</option>
              <option value="transgender-man">Transgender Man</option>
              <option value="genderqueer">Genderqueer</option>
              <option value="agender">Agender</option>
              <option value="bigender">Bigender</option>
              <option value="genderfluid">Genderfluid</option>
              <option value="demiboy">Demiboy</option>
              <option value="demigirl">Demigirl</option>
              <option value="two-spirit">Two Spirit</option>
              <option value="pangender">Pangender</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 mt-1 cursor-pointer accent-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm cursor-pointer text-muted-foreground"
            >
              I agree to the{" "}
              <Link
                href="/terms-and-conditions"
                className="text-primary underline underline-offset-2"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-primary underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-2 rounded-full font-semibold"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              className="flex-1 py-2 rounded-full font-semibold disabled:opacity-50"
            >
              {isLoggedIn ? "Continue" : "Sign Up"}
            </Button>
          </div>

          {isLoggedIn && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Your information will be updated and saved to your profile
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
