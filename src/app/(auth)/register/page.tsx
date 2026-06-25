import { Suspense } from "react";
import RegisterForm from "./_components/register-form";

export default function Register() {
  return (
    <div className="bg-card p-6 rounded-xl w-[400px] lg:w-[600px] border border-border shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-primary">Create Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Join JetSet Cares today
        </p>
      </div>

      <div className="mt-6">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
