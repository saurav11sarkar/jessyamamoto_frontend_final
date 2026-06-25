"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password should be 6 character." }),
});

type FormType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (payload: FormType) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
        window.location.href = res?.url || callbackUrl;
      }
    } catch (error) {
      console.log(`login error : ${error}`);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(payload: FormType) {
    await handleSignIn(payload);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 px-4 text-slate-900 placeholder:text-slate-400 focus:border-[#3ee0cf] focus-visible:ring-[#3ee0cf]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-[#3ee0cf] focus-visible:ring-[#3ee0cf]"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Secure sign in for JetSet Cares accounts
            </p>
            <Link href={"/forgot-password"}>
              <h4 className="text-sm font-medium text-[#1b9f92] underline underline-offset-4">
                Forgot Password?
              </h4>
            </Link>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="h-12 w-full rounded-full bg-[#3ee0cf] text-slate-950 shadow-lg transition hover:bg-[#2bcfbe] disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Log In</span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-2">
                Log In
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 text-center">
        <h3 className="text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#1b9f92] hover:underline"
          >
            Sign Up
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default LoginForm;
