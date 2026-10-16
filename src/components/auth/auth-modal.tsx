"use client";

import * as React from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/use-auth-store";
import { PhoneOtpForm } from "@/components/auth/phone-otp-form";
import { EmailOtpForm } from "@/components/auth/email-otp-form";
import { authService } from "@/services/auth.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<"PHONE" | "EMAIL">("PHONE");

  const handleClose = () => {
    setAuthModalOpen(false);
  };

  const handleGoogleSignIn = () => {
    try {
      const googleUrl = authService.getGoogleAuthUrl();
      window.location.href = googleUrl;
    } catch {
      toast.info("Connecting to Google OAuth...");
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border border-border/80 shadow-2xl">
        {/* Playful Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-primary/15 via-pink-500/10 to-amber-500/10 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black text-2xl shadow-md">
              🧸
            </div>
            <div>
              <DialogTitle className="font-display font-black text-xl text-foreground tracking-tight">
                Welcome to KiddyBD
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Sign in to save favorite toys, track orders & unlock parenting perks.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Tabs Switcher: Phone Fast OTP vs Email / Google */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border/60">
            <button
              type="button"
              onClick={() => setActiveTab("PHONE")}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "PHONE"
                  ? "bg-card text-primary shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Phone Number (Fast OTP)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("EMAIL")}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "EMAIL"
                  ? "bg-card text-primary shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email / Google
            </button>
          </div>

          {/* Tab 1: Phone Fast OTP Flow */}
          {activeTab === "PHONE" ? (
            <PhoneOtpForm onSuccess={handleClose} />
          ) : (
            /* Tab 2: Email & Google Flow */
            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-11 rounded-2xl border-2 border-border/80 hover:border-border bg-card hover:bg-muted/30 text-xs sm:text-sm font-bold text-foreground flex items-center justify-center gap-3 shadow-2xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span>Or with Email OTP</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email OTP Sign-In */}
              <EmailOtpForm onSuccess={handleClose} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
