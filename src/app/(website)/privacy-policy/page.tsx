import type { Metadata } from "next";
import { PrivacyContent } from "@/components/shared/policies/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | JetSet Cares",
  description:
    "JetSet Cares Privacy Policy explaining what information we collect, how we use it, how we share it, and user choices.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 pt-32 pb-16 mt-10">
      <div className="container">
        <PrivacyContent />
      </div>
    </div>
  );
}
