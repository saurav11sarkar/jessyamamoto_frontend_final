import { Suspense } from "react";
import OtpForm from "./_components/otp-form";

export default function OtpPage() {
  return (
    <div className="bg-[#ffffff7e] p-5 rounded-lg w-[400px] lg:w-[600px] border shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-medium">Verify Email</h1>
        <p className="text-sm text-gray-700">
          Enter OTP to verify your email address
        </p>
      </div>

      <div className="mt-5">
      <Suspense fallback={<div>loading...</div>}>
          <OtpForm />
      </Suspense>
      </div>
    </div>
  );
}
