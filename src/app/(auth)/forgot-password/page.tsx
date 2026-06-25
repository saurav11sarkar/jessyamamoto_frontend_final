import ForgotPasswordForm from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_30px_90px_rgba(25,55,70,0.10)] backdrop-blur md:p-8 lg:p-10">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-[#dffbf8] px-4 py-2 text-sm font-semibold text-[#1b9f92]">
              Password Recovery
            </span>
            <h1 className="mt-5 text-3xl font-semibold text-[#16324f] md:text-4xl">
              Forgot your password?
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Enter your email and we&apos;ll send a verification code to help
              you reset it.
            </p>
          </div>

          <div className="mt-10">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
