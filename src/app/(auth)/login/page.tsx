import LoginForm from "./_components/login-form";

export default function Login() {
  return (
    <div className="bg-card p-6 rounded-xl w-[400px] lg:w-[600px] border border-border shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-primary">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your JetSet Cares account
        </p>
      </div>

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
