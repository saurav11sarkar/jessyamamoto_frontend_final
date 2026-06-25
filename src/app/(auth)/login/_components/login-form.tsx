"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password should be 6 character." }),
});

type FormType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
        window.location.href = "/";
      }
    } catch (error) {
      void error;
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-[45px] border border-black"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-[45px] border border-black pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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

          <div className="flex items-center justify-end">
            <Link href={"/forgot-password"}>
              <h4 className="underline text-sm">Forgot Password?</h4>
            </Link>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="h-[45px] w-full text-white disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Spinner />
                <span>Log In</span>
              </div>
            ) : (
              `Log In`
            )}
          </Button>
        </form>
      </Form>

      {/* Sign Up Section with Role Selection */}
      <div className="text-center mt-5">
        <h3 className="text-sm">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="font-semibold hover:underline text-primary"
          >
            Sign Up
          </button>
        </h3>
      </div>

      {/* Role Selection Modal for Registration */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Create Account
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Choose how you want to use JetSet Cares
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-4 py-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                router.push("/find-care/1?role=find care");
              }}
              className="flex-1 bg-white border-2 border-gray-200 hover:border-primary p-5 rounded-xl transition-all duration-200 hover:shadow-lg text-left group"
            >
              <h3 className="text-lg font-semibold text-[#0A0A23] mb-2">
                I&apos;m looking for a caregiver
              </h3>
              <p className="text-sm text-[#3B3B4F] mb-3">
                Find trusted care providers in your area.
              </p>
              <div className="w-full py-2 px-4 text-white text-sm rounded-full font-bold bg-primary group-hover:bg-primary/90 text-center">
                Parent &rarr;
              </div>
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                router.push("/find-job/1?role=find job");
              }}
              className="flex-1 bg-white border-2 border-gray-200 hover:border-primary p-5 rounded-xl transition-all duration-200 hover:shadow-lg text-left group"
            >
              <h3 className="text-lg font-semibold text-[#0A0A23] mb-2">
                I&apos;m looking for a caregiving job
              </h3>
              <p className="text-sm text-[#3B3B4F] mb-3">
                Create a profile and find caregiving jobs.
              </p>
              <div className="w-full py-2 px-4 text-white text-sm rounded-full font-bold bg-primary group-hover:bg-primary/90 text-center">
                Find Trusted Care &rarr;
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;
