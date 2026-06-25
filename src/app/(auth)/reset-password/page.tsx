import { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#ffffff7e] p-5 rounded-lg w-[400px] lg:w-[600px] border shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <p className="text-sm text-gray-700">
          Enter new password to recover your password
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div>loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
