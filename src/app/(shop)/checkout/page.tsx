"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/use-cart-store";
import { AddressSelector, AddressData } from "@/components/checkout/address-selector";
import {
  PaymentMethodSelector,
  PaymentMethodType,
} from "@/components/checkout/payment-method-selector";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Lock,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

// Robust UUIDv4 generator for Idempotency-Key
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getSubtotal } = useCartStore();

  // 1. Delivery Address State (Starts blank for new customer, auto-loaded for repeat customer)
  const [address, setAddress] = React.useState<AddressData>({
    fullName: "",
    phone: "",
    division: "Dhaka",
    district: "Dhaka",
    thana: "Uttara",
    streetAddress: "",
  });
  const [isAddressValid, setIsAddressValid] = React.useState(false);

  // 2. Payment Method State
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodType>("COD");

  // 3. Coupon State
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");

  // Delivery Notes
  const [deliveryNotes, setDeliveryNotes] = React.useState("");

  // Submitting state & Idempotency Key
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [idempotencyKey, setIdempotencyKey] = React.useState<string>("");

  React.useEffect(() => {
    setIdempotencyKey(generateUUID());
  }, []);

  // Price calculations
  const subtotal = getSubtotal();
  const isInsideDhaka =
    address.division.toLowerCase() === "dhaka" &&
    address.district.toLowerCase() === "dhaka";

  const freeShippingThreshold = 1500;
  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const baseDeliveryFee = isInsideDhaka ? 60 : 120;
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Apply Coupon with backend verification
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await orderService.applyCoupon(couponCode, subtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        setCouponCode("");
        toast.success(res.message);
      } else {
        setCouponError(res.message);
        toast.error(res.message);
      }
    } catch {
      setCouponError("Could not verify promo code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Order Submission with Idempotency Key
  const handlePlaceOrder = async () => {
    if (!isAddressValid) {
      toast.error("Please fill in a valid recipient name, phone number, and address.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty. Please add toys to checkout.");
      router.push("/products");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        recipientName: address.fullName.trim(),
        phone: address.phone.trim(),
        division: address.division,
        district: address.district,
        thana: address.thana,
        streetAddress: address.streetAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          slug: i.slug,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        subtotal,
        deliveryFee,
        couponCode: appliedCoupon?.code,
        discountAmount,
        total: grandTotal,
      };

      const activeKey = idempotencyKey || generateUUID();
      const result = await orderService.createOrder(payload, activeKey);

      // Save Address to LocalStorage for Repeat Customer Identification
      try {
        const savedKey = "kiddybd_customer_saved_addresses";
        const newSavedAddr: AddressData = {
          id: `addr-${Date.now()}`,
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          division: address.division,
          district: address.district,
          thana: address.thana,
          streetAddress: address.streetAddress.trim(),
          isDefault: true,
        };
        const existingRaw = localStorage.getItem(savedKey);
        let existingList: AddressData[] = existingRaw ? JSON.parse(existingRaw) : [];
        // Filter out duplicate phone + street
        existingList = existingList.filter(
          (a) => a.phone !== newSavedAddr.phone || a.streetAddress !== newSavedAddr.streetAddress
        );
        existingList.unshift(newSavedAddr);
        localStorage.setItem(savedKey, JSON.stringify(existingList.slice(0, 5)));

        // Also save this exact order snapshot in localStorage for instant tracking display
        const fullDeliveryAddress = `${address.streetAddress.trim()}, ${address.thana}, ${address.district}`;
        const orderSnapshot = {
          id: result.id,
          orderNumber: result.orderNumber,
          createdAt: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          estimatedDeliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          status: "CONFIRMED",
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
          recipientName: address.fullName.trim(),
          phone: address.phone.trim(),
          deliveryAddress: fullDeliveryAddress,
          deliveryNotes: deliveryNotes.trim() || undefined,
          courierPartner: {
            name: "Steadfast",
            trackingCode: `STF-${result.orderNumber.replace(/\D/g, "") || "882910"}`,
            trackingUrl: `https://steadfast.com.bd/t/STF-${result.orderNumber.replace(/\D/g, "") || "882910"}`,
          },
          items: items.map((i) => ({
            id: `item-${i.productId}`,
            productId: i.productId,
            title: i.title,
            slug: i.slug,
            price: i.price,
            quantity: i.quantity,
            imageUrl: i.imageUrl,
          })),
          subtotal,
          deliveryFee,
          discountAmount,
          total: grandTotal,
        };
        localStorage.setItem(`kiddybd_order_${result.orderNumber}`, JSON.stringify(orderSnapshot));
      } catch {
        // Ignored
      }

      // Clear active cart & notify user
      clearCart();
      toast.success(`Order #${result.orderNumber} placed successfully! 🎉`);

      // If online payment (SSLCommerz / bKash), redirect to Gateway URL
      if (result.gatewayUrl) {
        toast.loading("Redirecting to secure payment gateway...", { duration: 2500 });
        window.location.href = result.gatewayUrl;
        return;
      }

      // Redirect to Order Confirmation Tracking Page for COD
      router.push(`/orders/${result.orderNumber}`);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to place order. Please try again.";
      toast.error(errMsg);
      // Renew Idempotency-Key on explicit failure to allow fresh retry
      setIdempotencyKey(generateUUID());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-4xl shadow-inner mb-4">
          🧸
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Please add educational toys or baby essentials to your cart before proceeding to checkout.
        </p>
        <Button asChild className="rounded-full px-6 font-bold text-xs shadow-md mt-6">
          <Link href="/products">Explore Product Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Checkout Header */}
        <div className="border-b border-border/70 pb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <span>/</span>
            <span className="font-semibold text-primary">Secure Checkout</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight flex items-center gap-3">
                Secure Checkout
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Complete your child&apos;s order with verified delivery and safe payment.
              </p>
            </div>

            <div className="text-xs font-semibold text-muted-foreground bg-muted/40 px-3.5 py-1.5 rounded-2xl border border-border/60 self-start sm:self-auto">
              Idempotency: <span className="font-mono text-[10px] text-foreground">{idempotencyKey ? `${idempotencyKey.slice(0, 8)}...` : "active"}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left Forms (65%) & Right Order Summary (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Step 1 Address & Step 2 Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Delivery Address */}
            <AddressSelector
              selectedAddress={address}
              onChangeAddress={setAddress}
              onValidationChange={setIsAddressValid}
            />

            {/* Step 2: Payment Method */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onChangeMethod={setPaymentMethod}
              orderTotal={grandTotal}
              isFirstTimeArea={address.division !== "Dhaka"}
            />

            {/* Delivery Instructions (Optional) */}
            <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-xs space-y-2">
              <label className="text-xs font-bold text-foreground">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Call before delivery / Please leave at security desk / Ring doorbell"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Right Column: Step 3 Order Summary & Coupon Engine */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Order Items Breakdown */}
            <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="font-bold font-display text-base text-foreground">
                  Order Summary ({items.length} items)
                </h3>
                <Link
                  href="/cart"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/20 border border-border/50"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/60">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🧸
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {item.title}
                      </h4>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Qty: <strong className="text-foreground">{item.quantity}</strong> × ৳{item.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-xs font-black text-foreground shrink-0 text-right">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Engine */}
              <div className="pt-3 border-t border-border/60 space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-black text-emerald-700 dark:text-emerald-300">
                          {appliedCoupon.code}
                        </span>{" "}
                        <span className="text-muted-foreground">({appliedCoupon.discountPercent}% OFF)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon: KIDDY10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 h-10 px-3.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground uppercase placeholder:normal-case font-bold focus:outline-hidden focus:border-primary transition-colors"
                      />
                      <Button
                        type="submit"
                        disabled={couponLoading || !couponCode.trim()}
                        className="rounded-xl h-10 px-4 font-bold text-xs"
                      >
                        {couponLoading ? "Validating..." : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown Calculation */}
              <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">৳{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Delivery ({isInsideDhaka ? "Inside Dhaka" : "Outside Dhaka"})
                  </span>
                  <span className={`font-bold ${deliveryFee === 0 ? "text-emerald-600" : "text-foreground"}`}>
                    {deliveryFee === 0 ? "FREE (Orders > ৳1,500)" : `৳${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-black text-foreground pt-3 border-t border-border/60">
                  <span>Grand Total</span>
                  <span className="text-[#FF3E78] font-display text-2xl">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Placement CTA */}
              <div className="pt-2 space-y-2.5">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !isAddressValid}
                  className="w-full h-12 rounded-2xl font-black text-sm bg-[#FF3E78] hover:bg-[#e62e66] text-white shadow-xl shadow-[#FF3E78]/30 gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Placing Safe Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Place Order (৳{grandTotal.toLocaleString()})
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Doorstep Inspection · 7 Days Easy Returns Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
