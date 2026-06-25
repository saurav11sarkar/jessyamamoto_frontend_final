"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";

const formSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
});

type FormType = z.infer<typeof formSchema>;

const OtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async (payload: FormType) => {
      const requestBody = email ? { ...payload, email } : payload;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      return data;
    },

    onSuccess: async (data) => {
      toast.success(data?.message);

      if (email) {
        const encodedEmail = encodeURIComponent(email);
        router.push(`/reset-password?email=${encodedEmail}`);
      } else {
        router.push("/reset-password");
      }
    },

    onError: async (error) => {
      toast.error(error?.message);
      form.setValue("otp", "");
    },
  });

  async function onSubmit(payload: FormType) {
    try {
      await mutateAsync(payload);
    } catch (error) {
      console.error(`OTP verification error: ${error}`);
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please go back to forgot password page.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully!");
      form.setValue("otp", "");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to resend OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {email && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            OTP sent to: <span className="font-medium">{email}</span>
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* OTP Field */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    onComplete={(value) => {
                      if (value.length === 6) {
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  >
                    <InputOTPGroup className="gap-2 sm:gap-5">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-12 w-12 sm:h-16 sm:w-16 rounded-md border border-black text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 6-digit OTP sent to your email
                </p>
              </FormItem>
            )}
          />

          <Loader isPending={isPending} title="Verify OTP" />
        </form>
      </Form>

      <div className="mt-5 space-y-3">
        <div className="text-center flex items-center justify-center gap-2">
          <p className="text-sm text-gray-600">Didn&apos;t receive OTP?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            className="font-semibold hover:underline text-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!email}
          >
            {loading ? "Resend OTP..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
