"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/use-cart-store";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Tag,
  CheckCircle2,
  Truck,
  RotateCcw,
  ArrowLeft,
  Info,
} from "lucide-react";

const VALID_COUPONS: Record<string, { discountPercent: number; label: string }> = {
  KIDDY10: { discountPercent: 10, label: "10% Welcome Discount" },
  TOYFEST: { discountPercent: 15, label: "15% Toy Fest Savings" },
  PLAY20: { discountPercent: 20, label: "20% Super Parent Discount" },
};

export default function FullCartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();

  const [couponInput, setCouponInput] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    discountPercent: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = React.useState("");

  // Delivery destination selection for estimated delivery calculator
  const [destination, setDestination] = React.useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");

  const subtotal = getSubtotal();
  const freeShippingThreshold = 1500;
  const isFreeDeliveryUnlocked = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const baseDeliveryFee = destination === "inside_dhaka" ? 60 : 120;
  const deliveryFee = isFreeDeliveryUnlocked ? 0 : baseDeliveryFee;

  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    if (VALID_COUPONS[code]) {
      setAppliedCoupon({
        code,
        discountPercent: VALID_COUPONS[code].discountPercent,
        label: VALID_COUPONS[code].label,
      });
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try 'KIDDY10' or 'TOYFEST'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-4xl shadow-inner mb-4">
          🧸
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          Looks like you haven&apos;t added any toys or kits yet. Explore our curated collections for infants, toddlers, and school-age explorers!
        </p>
        <div className="flex gap-3 mt-6">
          <Button asChild className="rounded-full px-6 font-bold text-xs shadow-md">
            <Link href="/products">Browse All Toys</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6 font-bold text-xs">
            <Link href="/wishlist">View Wishlist</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-border/70 pb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-primary">Shopping Cart</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight flex items-center gap-3">
                Shopping Cart
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Review your items, apply savings coupons, and calculate doorstep delivery across Bangladesh.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full h-8 px-3 font-semibold self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Cart
            </Button>
          </div>
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="p-4 sm:p-5 rounded-3xl bg-muted/40 border border-border/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              {isFreeDeliveryUnlocked ? (
                <div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 block text-sm">
                    🎉 Free Nationwide Delivery Unlocked!
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Your order qualifies for ৳0 delivery anywhere in Bangladesh.
                  </span>
                </div>
              ) : (
                <div>
                  <span className="font-bold text-foreground block">
                    Add <strong className="text-primary font-black">৳{remainingForFreeShipping.toLocaleString()}</strong> more for FREE Delivery!
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Free delivery threshold: ৳1,500
                  </span>
                </div>
              )}
            </div>
            <span className="font-black text-foreground sm:text-right">
              {progressPercent}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-[#FF3E78] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Content: Left Detailed Table (65%) & Right Order Summary (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed Cart Items Table */}
          <div className="lg:col-span-8 bg-card border border-border/70 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 sm:p-6 border-b border-border/60">
              <h2 className="font-bold font-display text-lg text-foreground">
                Cart Items ({items.length})
              </h2>
            </div>

            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:bg-muted/10 transition-colors"
                >
                  {/* Left: Thumbnail & Name */}
                  <div className="flex gap-4 items-center min-w-0 flex-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted/40 shrink-0 border border-border/60">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🧸
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>

                      {item.ageGroup && (
                        <span className="inline-block text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                          {item.ageGroup}
                        </span>
                      )}

                      <div className="text-xs font-semibold text-muted-foreground">
                        Unit Price: <span className="text-foreground font-bold">৳{item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="line-through ml-2 text-muted-foreground/75">
                            ৳{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Item Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    {/* Stepper */}
                    <div className="flex items-center bg-muted/60 border border-border/80 rounded-2xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-foreground hover:bg-card disabled:opacity-30 transition-all cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-foreground hover:bg-card transition-all cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for Item */}
                    <div className="text-right min-w-[90px]">
                      <div className="text-base sm:text-lg font-black text-foreground">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.quantity} × ৳{item.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-rose-500 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Remove product"
                      aria-label="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-5 border-t border-border/60 flex items-center justify-between flex-wrap gap-4 bg-muted/20">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-xl text-xs font-bold gap-1.5"
              >
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
              </Button>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>All toys guaranteed 100% non-toxic & child-safe</span>
              </div>
            </div>
          </div>

          {/* Right Order Summary & Calculators (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Coupon Code Box */}
            <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Apply Promo Code</h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-black text-emerald-700 dark:text-emerald-300">
                        {appliedCoupon.code}
                      </span>{" "}
                      <span className="text-muted-foreground">({appliedCoupon.label})</span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-500 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. KIDDY10 or TOYFEST"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 h-11 px-3.5 rounded-2xl bg-muted/60 border border-border text-xs text-foreground uppercase placeholder:normal-case font-bold focus:outline-hidden focus:border-primary transition-colors"
                    />
                    <Button
                      type="submit"
                      className="rounded-2xl h-11 px-4 font-bold text-xs"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] font-semibold text-rose-500">{couponError}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Try <strong className="text-foreground">KIDDY10</strong> for 10% off or <strong className="text-foreground">TOYFEST</strong> for 15% off.
                  </p>
                </form>
              )}
            </div>

            {/* 2. Estimated Delivery Calculator */}
            <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-500" />
                <h3 className="font-bold text-sm text-foreground">Estimate Delivery</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Select Shipping Destination:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDestination("inside_dhaka")}
                    className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                      destination === "inside_dhaka"
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border/70 bg-muted/30 text-foreground hover:border-primary/40"
                    }`}
                  >
                    <div className="font-bold text-xs">Inside Dhaka</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      24-48 Hours (৳60)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDestination("outside_dhaka")}
                    className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                      destination === "outside_dhaka"
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border/70 bg-muted/30 text-foreground hover:border-primary/40"
                    }`}
                  >
                    <div className="font-bold text-xs">Outside Dhaka</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      3-4 Days (৳120)
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Order Summary & Savings Breakdown */}
            <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-bold font-display text-base text-foreground pb-2 border-b border-border/60">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">৳{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Estimated Delivery ({destination === "inside_dhaka" ? "Dhaka" : "All BD"})
                  </span>
                  <span className={`font-bold ${deliveryFee === 0 ? "text-emerald-600" : "text-foreground"}`}>
                    {deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-black text-foreground pt-3 border-t border-border/60">
                  <span>Total Payable</span>
                  <span className="text-[#FF3E78] font-display text-2xl">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <div className="pt-2 space-y-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full h-12 rounded-2xl font-black text-sm bg-[#FF3E78] hover:bg-[#e62e66] text-white shadow-lg shadow-[#FF3E78]/30 gap-2 transition-all active:scale-98"
                >
                  <Link href="/checkout">
                    <Lock className="w-4 h-4" /> Proceed to Safe Checkout
                  </Link>
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Cash on Delivery & Instant Mobile Banking Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
