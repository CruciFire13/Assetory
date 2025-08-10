"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, setActive } = useSignUp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [isResending, setIsResending] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password required";
    else if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters";

    if (formData.password !== formData.passwordConfirmation)
      newErrors.passwordConfirmation = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await signUp?.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name,
      });

      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "errors" in err) {
        const errorObject = err as { errors: { message: string }[] };
        setAuthError(errorObject.errors?.[0]?.message || "Sign-up failed");
      } else {
        setAuthError("Sign-up failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await signUp?.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (res?.status === "complete") {
        if (setActive) {
          await setActive({ session: res.createdSessionId });
          router.push("/dashboard");
        }
      }
    } catch {
      setVerificationError("Invalid or expired code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificationError("Verification code resent.");
    } catch {
      setVerificationError("Failed to resend.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md p-6">
        <CardHeader className="text-center px-0 py-2">
          <CardTitle className="text-xl font-semibold text-white">
            {verifying ? "Verify Your Email" : "Sign Up"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 px-0 py-0">
          {verifying ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                disabled={isSubmitting}
              />
              {verificationError && (
                <p className="text-sm text-red-400">{verificationError}</p>
              )}
              <Button type="submit" className="w-full">
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-sm text-blue-400 hover:text-blue-200"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}

              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}

              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}

              <Input
                name="passwordConfirmation"
                type="password"
                placeholder="Confirm Password"
                value={formData.passwordConfirmation}
                onChange={handleChange}
              />
              {errors.passwordConfirmation && (
                <p className="text-sm text-red-400">
                  {errors.passwordConfirmation}
                </p>
              )}

              {authError && <p className="text-sm text-red-500">{authError}</p>}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </div>
    </motion.div>
  );
}
