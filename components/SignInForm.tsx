"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during sign-in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle =
    "backdrop-blur-md bg-white/10 border border-white/20 shadow-xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className={`rounded-xl px-6 py-6 ${cardStyle}`}>
        <CardHeader className="text-center p-0 pb-2">
          <CardTitle className="text-2xl font-bold text-white">
            Sign In to Assetory
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="text"
              placeholder="Email or Username"
              {...register("identifier")}
              disabled={isSubmitting}
            />
            {errors.identifier && (
              <p className="text-sm text-red-400">
                {errors.identifier.message}
              </p>
            )}

            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}

            {authError && <p className="text-sm text-red-500">{authError}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </div>
    </motion.div>
  );
}
