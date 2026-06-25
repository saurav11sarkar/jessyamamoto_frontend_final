import LoginForm from "./_components/login-form";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_30px_90px_rgba(25,55,70,0.10)] backdrop-blur md:p-8 lg:p-10">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-[#dffbf8] px-4 py-2 text-sm font-semibold text-[#1b9f92]">
              Account Access
            </span>
            <h2 className="mt-5 text-3xl font-semibold text-[#16324f] md:text-4xl">
              Log in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Continue to the page you wanted to open.
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
