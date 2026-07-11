"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center text-[#1a2b3b]">
      <h2 className="text-2xl font-bold">This profile couldn&apos;t be loaded</h2>
      <p className="text-gray-500 max-w-md">
        Something went wrong while loading this profile. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-2 rounded-full font-medium"
        >
          Try again
        </button>
        <Link
          href="/all-find-care"
          className="border border-gray-300 px-6 py-2 rounded-full font-medium"
        >
          Back to search
        </Link>
      </div>
    </div>
  );
}
