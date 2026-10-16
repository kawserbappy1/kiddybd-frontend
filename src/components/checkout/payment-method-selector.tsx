"use client";

import * as React from "react";
import {
  CreditCard,
  Banknote,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Zap,
} from "lucide-react";

export type PaymentMethodType = "COD" | "SSLCOMMERZ";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onChangeMethod: (method: PaymentMethodType) => void;
  orderTotal: number;
  isFirstTimeArea?: boolean;
}

export function PaymentMethodSelector({
  selectedMethod,
  onChangeMethod,
  orderTotal,
  isFirstTimeArea = false,
}: PaymentMethodSelectorProps) {
  const codLimit = 5000;
  const isHighValue = orderTotal > codLimit;
  const showCodRiskAlert = isHighValue || isFirstTimeArea;

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-display text-foreground tracking-tight">
              2. Payment Method
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose your preferred payment method
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Secure</span>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="space-y-3.5">
        {/* 1. Cash on Delivery (COD) */}
        <label
          onClick={() => onChangeMethod("COD")}
          className={`block p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedMethod === "COD"
              ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
              : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/20"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-foreground">
                    Cash on Delivery (ক্যাশ অন ডেলিভারি)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600">
                    Most Popular
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pay when you receive the product at your doorstep. Inspect your parcel before paying.
                </p>
              </div>
            </div>

            <input
              type="radio"
              name="payment_method"
              checked={selectedMethod === "COD"}
              onChange={() => onChangeMethod("COD")}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary cursor-pointer"
            />
          </div>

          {showCodRiskAlert && selectedMethod === "COD" && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium space-y-1 animate-in fade-in-50">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Verification & Advance Delivery Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                For high-value orders (over ৳{codLimit.toLocaleString()}) or first-time orders in this area, an advance delivery fee (৳100) or phone OTP verification is required to confirm shipping dispatch.
              </p>
            </div>
          )}
        </label>

        {/* 2. SSLCOMMERZ (bKash, Nagad, Rocket, Cards & Net Banking) */}
        <label
          onClick={() => onChangeMethod("SSLCOMMERZ")}
          className={`block p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedMethod === "SSLCOMMERZ"
              ? "border-blue-600 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/20"
              : "border-border/70 bg-card hover:border-blue-500/40 hover:bg-muted/20"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-foreground">
                    Online Payment (SSLCOMMERZ)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Instant Confirmation
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pay securely with bKash, Nagad, Rocket, Upay, Visa, Mastercard & Internet Banking via SSLCOMMERZ Gateway.
                </p>

                {/* Badges for bKash, Nagad, Visa, Mastercard */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#E2136E] text-white">
                    bKash
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#F7941D] text-white">
                    Nagad
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                    Visa
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EB001B] text-white">
                    Mastercard
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-700 text-white">
                    Rocket
                  </span>
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="payment_method"
              checked={selectedMethod === "SSLCOMMERZ"}
              onChange={() => onChangeMethod("SSLCOMMERZ")}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
            />
          </div>
        </label>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-2xl border border-border/50">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>All transactions are encrypted with 256-bit SSL certificate and PCI-DSS compliance.</span>
      </div>
    </div>
  );
}
