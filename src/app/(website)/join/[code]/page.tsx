"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function AmbassadorJoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [ambassadorName, setAmbassadorName] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassador/verify/${code}`
        );
        const data = await res.json();
        if (data.success && data.data) {
          setValid(true);
          setAmbassadorName(
            `${data.data.userId?.firstName || ""} ${data.data.userId?.lastName || ""}`.trim()
          );
          setTimeout(() => {
            router.push(`/find-job/1?role=find job&ambassador=${code}`);
          }, 2000);
        } else {
          setValid(false);
        }
      } catch {
        setValid(false);
      } finally {
        setChecking(false);
      }
    };

    if (code) verify();
  }, [code, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-28">
        <Spinner />
        <p className="text-gray-600">Verifying referral link...</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-28">
        <h1 className="text-2xl font-bold text-gray-900">Invalid Referral Link</h1>
        <p className="text-gray-600">
          This referral link is not valid. You can still sign up directly.
        </p>
        <button
          onClick={() => router.push("/find-job/1?role=find job")}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90"
        >
          Sign Up as Partner
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-28">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to JetSet Cares!</h1>
        {ambassadorName && (
          <p className="text-gray-600 mt-2">
            Referred by <span className="font-semibold text-primary">{ambassadorName}</span>
          </p>
        )}
        <p className="text-gray-500 mt-4">Redirecting you to sign up...</p>
        <div className="mt-4">
          <Spinner />
        </div>
      </div>
    </div>
  );
}
