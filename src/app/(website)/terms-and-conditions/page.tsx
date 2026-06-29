import type { Metadata } from "next";
import { TermsContent } from "@/components/shared/policies/terms-content";

export const metadata: Metadata = {
  title: "Terms and Conditions | JetSet Cares",
  description:
    "JetSet Cares Terms and Conditions governing access to and use of the platform.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-slate-50 pt-32 pb-16 mt-10">
      <div className="container">
        <TermsContent />
      </div>
    </div>
  );
}
