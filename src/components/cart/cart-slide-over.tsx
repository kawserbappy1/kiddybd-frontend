"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/use-cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
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
  Truck,
  ArrowLeft,
} from "lucide-react";

export function CartSlideOver() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const freeShippingThreshold = 1500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex flex-col h-full w-full sm:max-w-md p-0 overflow-hidden bg-card"
      >
        {/* Top Header */}
        <SheetHeader className="p-5 border-b border-border/80 bg-card/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-display font-black tracking-tight">
                Shopping Cart
              </SheetTitle>
              <SheetDescription className="text-xs font-semibold">
                {items.length === 0
                  ? "Your cart is currently empty"
                  : `${items.length} unique item${
                      items.length > 1 ? "s" : ""
                    } in your bag`}
              </SheetDescription>
            </div>
          </div>

          {/* Dynamic Free Shipping Progress Bar */}
          <div className="mt-3.5 bg-muted/60 dark:bg-muted/40 rounded-2xl p-3 text-xs border border-border/60">
            {remainingForFreeShipping === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>🎉 You&apos;ve unlocked FREE Standard Delivery! 🚚</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Add{" "}
                  <strong className="text-primary font-black">
                    ৳{remainingForFreeShipping.toLocaleString()}
                  </strong>{" "}
                  more to unlock{" "}
                  <strong className="text-foreground font-bold">FREE Delivery!</strong> 🚚
                </span>
              </div>
            )}

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-[#FF3E78] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Item List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-4xl shadow-inner">
                🧸
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-black text-xl text-foreground">
                  Your cart is empty!
                </h4>
                <p className="text-xs max-w-xs text-muted-foreground leading-relaxed">
                  Discover age-matched educational toys, STEM kits, and baby essentials for your little one.
                </p>
              </div>
              <Button
                onClick={closeCart}
                asChild
                className="mt-2 rounded-full px-6 font-bold text-xs"
              >
                <Link href="/products">Explore All Toys</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="group flex gap-3.5 p-3.5 rounded-2xl bg-muted/30 border border-border/70 hover:border-primary/40 transition-all shadow-2xs"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/60">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🧸
                    </div>
                  )}
                </div>

                {/* Details & Controls */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.ageGroup && (
                      <span className="inline-block text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1">
                        {item.ageGroup}
                      </span>
                    )}
                  </div>

                  {/* Pricing and Stepper */}
                  <div className="flex items-center justify-between pt-2 mt-1">
                    <div>
                      <div className="text-xs font-black text-foreground">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium">
                        ৳{item.price.toLocaleString()} each
                      </div>
                    </div>

                    <div className="flex items-center bg-card border border-border/80 rounded-xl p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-black text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary Footer */}
        {items.length > 0 && (
          <SheetFooter className="p-5 border-t border-border/80 bg-card/95 backdrop-blur-md flex-col sm:flex-col gap-3">
            <div className="space-y-2 w-full text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Delivery</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border/60">
                <span>Total Amount</span>
                <span className="text-primary text-xl font-display">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full pt-1">
              <Button
                asChild
                size="lg"
                onClick={closeCart}
                className="w-full h-12 rounded-2xl justify-center gap-2 font-black bg-[#FF3E78] hover:bg-[#e62e66] text-white shadow-lg shadow-[#FF3E78]/25 text-sm active:scale-98 transition-all"
              >
                <Link href="/checkout">
                  <Lock className="w-4 h-4" /> Proceed to 100% Safe Checkout
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  onClick={closeCart}
                  className="flex-1 rounded-xl h-9 text-xs font-bold"
                >
                  <Link href="/cart">View Full Cart Page</Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCart}
                  className="flex-1 rounded-xl h-9 text-xs text-muted-foreground hover:text-foreground"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Certified 100% Non-Toxic · Cash on Delivery Available</span>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
