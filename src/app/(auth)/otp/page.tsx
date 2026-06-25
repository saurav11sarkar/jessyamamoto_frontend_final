import { Suspense } from "react";
import OtpForm from "./_components/otp-form";

export default function OtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_30px_90px_rgba(25,55,70,0.10)] backdrop-blur md:p-8 lg:p-10">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-[#dffbf8] px-4 py-2 text-sm font-semibold text-[#1b9f92]">
              Email Verification
            </span>
            <h1 className="mt-5 text-3xl font-semibold text-[#16324f] md:text-4xl">
              Verify your email
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Enter the 6-digit code we sent to continue resetting your
              password.
            </p>
          </div>

          <div className="mt-8">
            <Suspense fallback={<div>loading...</div>}>
              <OtpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
