// src/components/steps/PasswordStep.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface PasswordStepProps {
  email: string;
  onSignUp: (data: { password: string }) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function PasswordStep({
  email,
  onSignUp,
  onBack,
  isSubmitting = false,
}: PasswordStepProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    if (password.length >= 6) {
      onSignUp({ password });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl text-[#0A0A23] font-bold text-center mb-8">
        Finish setting up your account
      </h1>

      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-4 border-2 border-[#8E8E9A] rounded-full bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 pr-12 border-2 border-[#8E8E9A] rounded-full focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 -mt-2">
            Password must be at least 6 characters
          </p>

          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-full font-semibold bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={handleSignUp}
              disabled={password.length < 6 || isSubmitting}
              className="flex-1 bg-primary hover:bg-primary text-white py-2 rounded-full font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            By signing up, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-blue-600 underline underline-offset-2"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 underline underline-offset-2"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
