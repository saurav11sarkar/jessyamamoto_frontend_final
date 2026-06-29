"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PrivacyContent } from "@/components/shared/policies/privacy-content";
import { TermsContent } from "@/components/shared/policies/terms-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PolicyType = "terms" | "privacy";

interface PolicyModalLinksProps {
  linkClassName?: string;
}

const policyConfig: Record<
  PolicyType,
  { title: string; description: string; href: string }
> = {
  terms: {
    title: "Terms and Conditions",
    description: "Review the JetSet Cares terms inside this modal.",
    href: "/terms-and-conditions",
  },
  privacy: {
    title: "Privacy Policy",
    description: "Review the JetSet Cares privacy policy inside this modal.",
    href: "/privacy-policy",
  },
};

export function PolicyModalLinks({
  linkClassName,
}: PolicyModalLinksProps) {
  const [open, setOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>("terms");

  const openPolicy = (policy: PolicyType) => {
    setActivePolicy(policy);
    setOpen(true);
  };

  const activeConfig = policyConfig[activePolicy];

  return (
    <>
      <button
        type="button"
        onClick={() => openPolicy("terms")}
        className={cn(linkClassName)}
      >
        Terms and Conditions
      </button>{" "}
      and{" "}
      <button
        type="button"
        onClick={() => openPolicy("privacy")}
        className={cn(linkClassName)}
      >
        Privacy Policy
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[88vh] max-w-6xl flex-col gap-0 overflow-hidden border-slate-200 p-0 sm:rounded-2xl">
          <DialogHeader className="border-b border-slate-200 px-5 py-4 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
              <div>
                <DialogTitle className="text-xl text-slate-950">
                  {activeConfig.title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-slate-600">
                  {activeConfig.description}
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setActivePolicy("terms")}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    activePolicy === "terms"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-600 hover:text-slate-950",
                  )}
                >
                  Terms
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy("privacy")}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    activePolicy === "privacy"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-600 hover:text-slate-950",
                  )}
                >
                  Privacy
                </button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-6">
            {activePolicy === "terms" ? <TermsContent /> : <PrivacyContent />}
          </div>

        
        </DialogContent>
      </Dialog>
    </>
  );
}
