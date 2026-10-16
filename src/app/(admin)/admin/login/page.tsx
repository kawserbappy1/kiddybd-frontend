"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, Shield } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/use-auth-store";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, loginSuccess } = useAuthStore();
  const [email, setEmail] = React.useState("admin@kiddojoy.com");
  const [password, setPassword] = React.useState("Admin@12345");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      const allowedRoles = [
        "SUPER_ADMIN",
        "ADMIN",
        "ORDER_MANAGER",
        "INVENTORY_MANAGER",
        "CUSTOMER_SUPPORT",
        "FINANCE_MANAGER",
      ];
      if (allowedRoles.includes(user.role)) {
        router.replace("/admin");
      }
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your admin email or User ID and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.adminLogin({ email: email.trim(), password });
      if (res.success && res.data?.accessToken) {
        let user = res.data.user;
        if (!user) {
          const meRes = await authService.getMe();
          if (meRes.success && meRes.data) {
            user = meRes.data;
          }
        }

        if (user) {
          loginSuccess(user, res.data.accessToken);
          toast.success(`Welcome to Ops Hub, ${user.name || user.email}!`);
          router.push("/admin");
        } else {
          toast.error("Could not load admin account profile");
        }
      } else {
        toast.error(res.message || "Invalid credentials. Please verify your credentials.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        "Invalid credentials or unauthorized account. Please check your user ID and password.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-2xl shadow-lg shadow-amber-500/20 mb-4">
            K
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            KiddoJoy Ops Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise Fulfillment & Inventory Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email or User ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kiddojoy.com or User ID"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            ← Return to KiddoJoy Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
