"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState<string | null>(null);
  // Add resend functionality
  const [isResending, setIsResending] = useState(false);

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    setIsResending(true);
    setVerificationError(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // Clear the current code
      setVerificationCode("");
      // Show success message temporarily
      setVerificationError("New verification code sent to your email!");
      setTimeout(() => setVerificationError(null), 3000);
    } catch (error: any) {
      console.error("Resend error:", error);
      setVerificationError(
        error.errors?.[0]?.message || "Failed to resend code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  // Add loading guard AFTER all hooks are declared
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Password confirmation validation
    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name,
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

    // Basic validation
    if (!verificationCode.trim()) {
      setVerificationError("Please enter the verification code");
      return;
    }

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      console.log("Verification result:", result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // More detailed error based on status
        console.log("Verification status:", result.status);
        if (result.status === "missing_requirements") {
          setVerificationError("Additional verification steps required. Please contact support.");
        } else {
          setVerificationError(
            `Verification incomplete. Status: ${result.status}. Please try again or contact support.`
          );
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      
      // More specific error handling
      if (error.errors && error.errors.length > 0) {
        const errorCode = error.errors[0].code;
        const errorMessage = error.errors[0].message;
        
        console.log("Error code:", errorCode);
        console.log("Error message:", errorMessage);
        
        if (errorCode === "verification_expired") {
          setVerificationError("Verification code has expired. Please request a new one.");
        } else if (errorCode === "verification_failed") {
          setVerificationError("Invalid verification code. Please check and try again.");
        } else {
          setVerificationError(errorMessage || "An error occurred during verification.");
        }
      } else {
        setVerificationError("An unexpected error occurred. Please try again.");
      }
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
                maxLength={6}
              />
              {verificationError && (
                <p className={`text-sm ${verificationError.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                  {verificationError}
                </p>
              )}
              <Button type="submit" disabled={isSubmitting || !verificationCode.trim()} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Verify Email"
                )}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || isSubmitting}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Didn't receive the code? Resend"}
                </button>
              </div>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Your Good Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
            
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}

            <Input
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation}
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