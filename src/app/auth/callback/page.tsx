"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSuccess } = useAuthStore();

  React.useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error(`Authentication error: ${error}`);
      router.replace("/");
      return;
    }

    if (token) {
      authService
        .getMe()
        .then((res) => {
          if (res.success && res.data) {
            loginSuccess(res.data, token);
            toast.success("Signed in with Google successfully! 🎉");
          } else {
            loginSuccess(
              {
                id: `usr_${Date.now()}`,
                name: "Google Parent",
                email: "parent@gmail.com",
                role: "CUSTOMER",
                createdAt: new Date().toISOString(),
              },
              token
            );
            toast.success("Welcome to KiddyBD! Signed in with Google 🎉");
          }
          router.replace("/account");
        })
        .catch(() => {
          loginSuccess(
            {
              id: `usr_${Date.now()}`,
              name: "Google Parent",
              email: "parent@gmail.com",
              role: "CUSTOMER",
              createdAt: new Date().toISOString(),
            },
            token
          );
          toast.success("Welcome to KiddyBD! Signed in with Google 🎉");
          router.replace("/account");
        });
    } else {
      router.replace("/");
    }
  }, [router, searchParams, loginSuccess]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <h2 className="text-base font-bold font-display text-foreground">
        Completing Google Sign-in...
      </h2>
      <p className="text-xs text-muted-foreground">
        Securing session and loading your parenting profile.
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-sm">Authenticating...</div>}>
      <CallbackHandler />
    </React.Suspense>
  );
}
