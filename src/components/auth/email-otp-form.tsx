"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

interface EmailOtpFormProps {
  onSuccess?: () => void;
}

export function EmailOtpForm({ onSuccess }: EmailOtpFormProps) {
  const { loginSuccess } = useAuthStore();

  const [step, setStep] = React.useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [resendSeconds, setResendSeconds] = React.useState(60);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const isEmailValid = React.useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  // Resend Countdown Timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "OTP" && resendSeconds > 0) {
      interval = setInterval(() => {
        setResendSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendSeconds]);

  // Handle Step 1: Send OTP to Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isEmailValid) {
      toast.error("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendEmailOtp({ email: email.trim().toLowerCase() });
      setStep("OTP");
      setResendSeconds(60);
      toast.success(`Verification code sent to ${email.trim()}! 📩`);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to send email verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Input Changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyEmailOtp({
        email: email.trim().toLowerCase(),
        otp: otpCode,
      });

      if (res?.data?.user && res?.data?.accessToken) {
        loginSuccess(res.data.user, res.data.accessToken);
        toast.success(`Welcome to KiddyBD! Signed in successfully 🎉`);
        onSuccess?.();
      } else {
        toast.error("Verification response was invalid. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === "EMAIL" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure OTP Verification
              </span>
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary shadow-2xs font-medium"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              We&apos;ll send a 6-digit code to this email to sign in or register instantly.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isEmailValid}
            className="w-full h-11 rounded-2xl font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2 cursor-pointer"
          >
            {isLoading ? "Sending Code..." : "Send Verification Code"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <strong className="text-foreground">{email}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setStep("EMAIL");
                setOtp(["", "", "", "", "", ""]);
              }}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              Change Email
            </button>
          </div>

          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 sm:w-12 h-12 text-center text-lg font-black rounded-xl bg-muted/40 border border-border focus:border-primary focus:bg-background focus:outline-hidden shadow-2xs transition-all"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full h-11 rounded-2xl font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2 cursor-pointer"
          >
            {isLoading ? "Verifying..." : "Verify & Sign In"}
            <CheckCircle2 className="w-4 h-4" />
          </Button>

          {/* Resend Timer */}
          <div className="text-center pt-1">
            {resendSeconds > 0 ? (
              <span className="text-xs text-muted-foreground">
                Resend code in <strong className="text-foreground">{resendSeconds}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Resend Code
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
