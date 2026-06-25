"use client";

import Loader from "@/components/loader/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

type FormType = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (payload: FormType) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      return await data;
    },

    onSuccess: async (data, variables) => {
      toast.success(data?.message);
      const encodedEmail = encodeURIComponent(variables.email);
      router.push(`/otp?email=${encodedEmail}`);
    },

    onError: async (error) => {
      toast.error(error?.message);
    },
  });

  async function onSubmit(payload: FormType) {
    try {
      await mutateAsync(payload);
    } catch {
      // handled by mutation error callback
    }
  }

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

          <Loader isPending={isPending} title="Send OTP" />
        </form>
      </Form>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 text-center">
        <h3 className="text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link href={"/signup"}>
            <span className="font-semibold text-[#1b9f92] hover:underline">
              Sign Up
            </span>
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
