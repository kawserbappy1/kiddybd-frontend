"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  OrderDetail,
  OrderTimelineStatus,
} from "@/lib/order-tracking-data";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  Download,
  ExternalLink,
  MapPin,
  Calendar,
  CreditCard,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Phone,
} from "lucide-react";

interface OrderTrackingClientProps {
  order: OrderDetail;
}

const TIMELINE_STEPS: {
  status: OrderTimelineStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "PENDING",
    title: "Order Placed",
    description: "We have received your order and sent SMS confirmation.",
  },
  {
    status: "CONFIRMED",
    title: "Order Confirmed",
    description: "Verified by KiddyBD team and queued for packaging.",
  },
  {
    status: "PROCESSING",
    title: "Quality Check & Packaged",
    description: "Sanitized and boxed with non-toxic safety seals.",
  },
  {
    status: "SHIPPED",
    title: "Handed to Courier",
    description: "Dispatched from central Dhaka fulfillment center.",
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Courier rider is on the way to your delivery address.",
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Package received & inspected at doorstep.",
  },
];

const STATUS_ORDER: Record<OrderTimelineStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
};

export function OrderTrackingClient({ order: initialOrder }: OrderTrackingClientProps) {
  const [order, setOrder] = React.useState<OrderDetail>(initialOrder);

  // 1. Initial hydration from localStorage (if exists) so page renders instantly
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(`kiddybd_order_${initialOrder.orderNumber}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.orderNumber === initialOrder.orderNumber) {
          setOrder(parsed);
        }
      }
    } catch {
      // Ignored
    }
  }, [initialOrder.orderNumber]);

  // 2. Live sync from backend API (and auto-poll every 5 seconds so status updates instantly when admin changes it)
  React.useEffect(() => {
    async function syncLiveOrderStatus() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";
        const res = await fetch(`${backendUrl}/orders/track/${initialOrder.orderNumber}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setOrder((prev) => {
              const updated: OrderDetail = {
                ...prev,
                ...json.data,
                // Preserve items if backend items array is present
                items: json.data.items?.length > 0 ? json.data.items : prev.items,
              };
              // Keep localStorage updated with latest status
              try {
                localStorage.setItem(`kiddybd_order_${initialOrder.orderNumber}`, JSON.stringify(updated));
              } catch {
                // Ignored
              }
              return updated;
            });
          }
        }
      } catch {
        // Fallback
      }
    }

    // Initial fetch
    syncLiveOrderStatus();

    // Poll every 5 seconds to catch live status updates from admin dashboard
    const interval = setInterval(syncLiveOrderStatus, 5000);
    return () => clearInterval(interval);
  }, [initialOrder.orderNumber]);

  const currentStepIndex = STATUS_ORDER[order.status] ?? 1;

  const handleDownloadInvoice = () => {
    // Generate printable receipt / invoice window
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderNumber} - KiddyBD</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 900; color: #FF3E78; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { text-align: left; padding: 12px; border-bottom: 1px solid #f1f5f9; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">KiddyBD</div>
              <p>Invoice for Order: <strong>${order.orderNumber}</strong></p>
              <p>Date: ${order.createdAt}</p>
            </div>
            <div style="text-align: right;">
              <p>Recipient: <strong>${order.recipientName}</strong></p>
              <p>Phone: ${order.phone}</p>
              <p>${order.deliveryAddress}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (i) => `
                <tr>
                  <td>${i.title}</td>
                  <td>${i.quantity}</td>
                  <td>৳${i.price.toLocaleString()}</td>
                  <td>৳${(i.price * i.quantity).toLocaleString()}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: ৳${order.subtotal.toLocaleString()}</p>
            <p>Delivery: ৳${order.deliveryFee.toLocaleString()}</p>
            <p style="color: #FF3E78; font-size: 22px;">Grand Total: ৳${order.total.toLocaleString()}</p>
          </div>
          <p style="margin-top: 40px; font-size: 12px; color: #64748b; text-align: center;">
            Thank you for shopping with KiddyBD! Non-Toxic · Child-Safe · 7 Days Returns Guarantee
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-primary transition-colors">My Account</Link>
          <span>/</span>
          <span className="font-semibold text-primary">Order #{order.orderNumber}</span>
        </div>

        {/* Confirmation Header Banner */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Order Placed Successfully
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-foreground tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span>Placed on {order.createdAt}</span>
                <span>•</span>
                <span className="text-foreground font-semibold">
                  Estimated Delivery:{" "}
                  <strong className="text-primary">{order.estimatedDeliveryDate}</strong>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
                className="rounded-2xl h-10 px-4 font-bold text-xs gap-2"
              >
                <Download className="w-4 h-4" /> Download Invoice (PDF)
              </Button>

              {order.status === "DELIVERED" && (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="rounded-2xl h-10 px-4 font-bold text-xs gap-1.5"
                >
                  <Link href={`/account/returns?order=${order.orderNumber}`}>
                    <RotateCcw className="w-3.5 h-3.5" /> Request Return
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Visual Stepper / Progress Timeline */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-black font-display text-foreground tracking-tight">
                Delivery Timeline Tracker
              </h2>
              <p className="text-xs text-muted-foreground">
                Live package progression through our fulfillment network
              </p>
            </div>

            {/* Courier Partner Badge with direct link */}
            <div className="flex items-center gap-2 bg-muted/60 p-2.5 rounded-2xl border border-border/60">
              <Truck className="w-4 h-4 text-primary" />
              <div className="text-xs">
                <span className="text-muted-foreground">Courier: </span>
                <span className="font-bold text-foreground">
                  {order.courierPartner.name}
                </span>{" "}
                <span className="text-muted-foreground font-mono">
                  ({order.courierPartner.trackingCode})
                </span>
              </div>
              <a
                href={order.courierPartner.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 ml-1"
              >
                Track Live <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Stepper Steps Desktop & Mobile */}
          <div className="relative pt-2">
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-6 gap-2 relative">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2 relative"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all z-10 ${
                        isPassed
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "bg-muted text-muted-foreground border-2 border-border/80"
                      } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-primary font-black"
                            : isPassed
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[140px] leading-tight sm:mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Left Items Breakdown & Right Delivery Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items In This Order (7 Cols) */}
          <div className="lg:col-span-7 bg-card border border-border/70 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold font-display text-base text-foreground pb-2 border-b border-border/60">
              Items In This Package ({order.items.length})
            </h3>

            <div className="divide-y divide-border/60">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex gap-4 items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex gap-3.5 items-center min-w-0">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted/60 shrink-0 border border-border/60">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🧸
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Qty: <strong className="text-foreground">{item.quantity}</strong> × ৳{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-black text-foreground shrink-0 text-right">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-border/60 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-৳{order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Doorstep Delivery</span>
                <span className="font-bold text-foreground">
                  {order.deliveryFee === 0 ? "FREE" : `৳${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border/60">
                <span>Grand Total</span>
                <span className="text-primary text-xl font-display">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Recipient & Shipping Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold font-display text-base text-foreground pb-2 border-b border-border/60">
                Delivery Details
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Shipping Destination</span>
                    <strong className="text-foreground text-sm block">{order.recipientName}</strong>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">{order.deliveryAddress}</p>
                    <span className="text-primary font-bold block mt-1">📞 {order.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-border/50">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Payment Method</span>
                    <strong className="text-foreground text-sm block">
                      {order.paymentMethod === "COD"
                        ? "Cash on Delivery (COD)"
                        : order.paymentMethod}
                    </strong>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="p-5 rounded-3xl bg-muted/40 border border-border/70 text-xs space-y-2">
              <div className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Questions about this package?
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Contact our friendly parenting care helpline at <strong>+880 1800-KIDDY</strong> or message us on WhatsApp for live rider coordination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
