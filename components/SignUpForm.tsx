"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error: any) {
      console.error("Sign-up error:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-up. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setVerificationError(
          "Verification could not be completed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationError(
        error.errors?.[0]?.message || "An error occurred during verification."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center items-center h-screen"
      >
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter the code sent to your email"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isSubmitting}
              />
              {verificationError && (
                <p className="text-sm text-red-600">{verificationError}</p>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center items-center h-screen"
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="text"
              placeholder="Your Good Name"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            <Input
              type="password"
              placeholder="Confirm Password"
              {...register("passwordConfirmation")}
              disabled={isSubmitting}
            />
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation.message}
              </p>
            )}

            {authError && <p className="text-sm text-red-600">{authError}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
