import ForgotPasswordForm from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-[#ffffff7e] p-5 rounded-lg w-[400px] lg:w-[600px] border shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-medium">Forgot Password</h1>
        <p className="text-sm text-gray-700">
          Enter your email to recover your password
        </p>
      </div>

      <div className="mt-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
