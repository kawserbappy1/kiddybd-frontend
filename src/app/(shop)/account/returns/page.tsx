"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ReturnRequest,
  ReturnStatus,
  OrderDetail,
} from "@/lib/order-tracking-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  UploadCloud,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowLeft,
  Check,
} from "lucide-react";

const RETURN_STATUS_STEPS: {
  status: ReturnStatus;
  label: string;
  desc: string;
}[] = [
  { status: "REQUESTED", label: "Requested", desc: "Return form submitted" },
  { status: "UNDER_REVIEW", label: "Under Review", desc: "Quality inspection team checking proof" },
  { status: "APPROVED", label: "Approved", desc: "Return request accepted" },
  { status: "PICKUP_SCHEDULED", label: "Pickup Scheduled", desc: "Steadfast rider assigned for doorstep pickup" },
  { status: "REFUND_COMPLETED", label: "Refund Completed", desc: "Disbursed to bKash / bank account" },
];

const RETURN_STATUS_ORDER: Record<ReturnStatus, number> = {
  REQUESTED: 0,
  UNDER_REVIEW: 1,
  APPROVED: 2,
  PICKUP_SCHEDULED: 3,
  REFUND_COMPLETED: 4,
};

function ReturnsContent() {
  const searchParams = useSearchParams();
  const preselectedOrderNum = searchParams.get("order") || "";

  const [targetOrder, setTargetOrder] = React.useState<OrderDetail | null>(null);
  const [returnsList, setReturnsList] = React.useState<ReturnRequest[]>([]);
  const [isLoadingOrder, setIsLoadingOrder] = React.useState(true);

  // Form State
  const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);
  const [reason, setReason] = React.useState<"DAMAGED" | "DEFECTIVE" | "WRONG_PRODUCT" | "SIZE_ISSUE">("DEFECTIVE");
  const [description, setDescription] = React.useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = React.useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load Order and its Returns from API
  const loadOrderAndReturns = React.useCallback(async () => {
    setIsLoadingOrder(true);
    let orderNum = preselectedOrderNum;
    if (!orderNum && typeof window !== "undefined") {
      // Check localStorage for the user's latest placed order
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("kiddybd_order_")) {
          orderNum = key.replace("kiddybd_order_", "");
          break;
        }
      }
    }

    if (!orderNum) {
      setIsLoadingOrder(false);
      return;
    }

    try {
      // 1. Fetch live order details from backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";
      const res = await fetch(`${backendUrl}/orders/track/${orderNum}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTargetOrder(json.data);
          if (json.data.items?.length > 0) {
            setSelectedItemIds([json.data.items[0].id]);
          }
        }
      }

      // 2. Fetch existing returns for this order
      const retRes = await fetch(`${backendUrl}/returns/order/${orderNum}`);
      if (retRes.ok) {
        const retJson = await retRes.json();
        if (retJson.success && Array.isArray(retJson.data)) {
          const mapped: ReturnRequest[] = retJson.data.map((r: any) => ({
            id: r.id,
            returnNumber: `RET-${r.id.slice(0, 6).toUpperCase()}`,
            orderNumber: orderNum,
            status: r.status === "REQUESTED" ? "REQUESTED" : r.status,
            createdAt: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            refundAmount: r.items?.reduce((sum: number, it: any) => sum + Number(it.orderItem?.unitPrice || 0) * it.quantity, 0) || 0,
            notes: r.description || "Under review by inspection team.",
            items: (r.items || []).map((it: any) => ({
              orderItemId: it.orderItemId,
              title: it.orderItem?.productNameSnapshot || "Product",
              reason: it.reason,
              quantity: it.quantity,
              comment: r.description || "",
              photoUrls: r.evidence?.map((e: any) => e.url),
            })),
          }));
          setReturnsList(mapped);
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsLoadingOrder(false);
    }
  }, [preselectedOrderNum]);

  React.useEffect(() => {
    loadOrderAndReturns();
  }, [loadOrderAndReturns]);

  const toggleItemSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrder) {
      toast.error("No valid order found to return.");
      return;
    }
    if (selectedItemIds.length === 0) {
      toast.error("Please select at least 1 item to return.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedItems = targetOrder.items.filter((i) =>
        selectedItemIds.includes(i.id)
      );

      const payload = {
        orderId: targetOrder.orderNumber,
        reason,
        description: description.trim() || "Item defect or mismatch",
        items: selectedItems.map((item) => ({
          orderItemId: item.id,
          quantity: item.quantity,
          reason,
        })),
        evidence: uploadedImageUrls.length > 0
          ? uploadedImageUrls.map((url) => ({
              type: "IMAGE",
              url,
            }))
          : undefined,
      };

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";
      const res = await fetch(`${backendUrl}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        toast.success("Return request submitted to database successfully! 🎉");
        setDescription("");
        loadOrderAndReturns();
      } else {
        toast.error(resJson.message || "Failed to submit return request");
      }
    } catch {
      toast.error("Network error while submitting return");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-primary transition-colors">My Account</Link>
          <span>/</span>
          <span className="font-semibold text-primary">Return & Refund Request</span>
        </div>

        {/* Header */}
        <div className="border-b border-border/70 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight flex items-center gap-3">
              7 Days Easy Returns Guarantee
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Hassle-Free
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Select delivered items within 7 days of arrival for doorstep replacement or instant bKash/Bank refund.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-2xl h-10 px-4 text-xs font-bold">
            <Link href="/account">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Account
            </Link>
          </Button>
        </div>

        {/* Real-Time Return Status Trackers */}
        {returnsList.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black font-display text-foreground">
              Active Return Requests ({returnsList.length})
            </h2>

            {returnsList.map((ret) => {
              const currentStep = RETURN_STATUS_ORDER[ret.status] ?? 0;

              return (
                <div
                  key={ret.id}
                  className="bg-card border border-border/70 rounded-3xl p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base text-foreground">
                          Request #{ret.returnNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (For Order #{ret.orderNumber})
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Refund Amount:{" "}
                        <strong className="text-primary font-bold">
                          ৳{ret.refundAmount.toLocaleString()}
                        </strong>{" "}
                        • Status:{" "}
                        <span className="font-black text-foreground">
                          {ret.status.replace(/_/g, " ")}
                        </span>
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 self-start sm:self-auto">
                      Doorstep Pickup Guaranteed
                    </span>
                  </div>

                  {/* Visual Stepper */}
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-5 gap-2">
                    {RETURN_STATUS_STEPS.map((step, sIdx) => {
                      const isPassed = sIdx <= currentStep;
                      const isCurrent = sIdx === currentStep;

                      return (
                        <div
                          key={step.status}
                          className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              isPassed
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                : "bg-muted text-muted-foreground border-2 border-border"
                            } ${isCurrent ? "ring-4 ring-emerald-500/20 scale-110" : ""}`}
                          >
                            {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : sIdx + 1}
                          </div>

                          <div>
                            <div
                              className={`text-xs font-bold ${
                                isCurrent ? "text-emerald-600 font-black" : isPassed ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-tight max-w-[120px] sm:mx-auto">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Return Submission Form */}
        {isLoadingOrder ? (
          <div className="bg-card border border-border/70 rounded-3xl p-12 text-center text-muted-foreground text-sm">
            Loading order details from database...
          </div>
        ) : !targetOrder ? (
          <div className="bg-card border border-border/70 rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <RotateCcw className="w-10 h-10 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-bold text-foreground">No Order Selected</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please choose an order from your account dashboard or enter your order number in the URL to request a return or replacement.
            </p>
            <Button asChild className="rounded-2xl px-6">
              <Link href="/account">View My Orders</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-xl font-black font-display text-foreground tracking-tight">
                Create New Return Request
              </h2>
              <p className="text-xs text-muted-foreground">
                Select items from order #{targetOrder.orderNumber}
              </p>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-6">
              {/* 1. Item Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  1. Select Item(s) to Return *
                </label>

                <div className="space-y-2.5">
                  {targetOrder.items.map((item) => {
                    const isChecked = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItemSelect(item.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        isChecked
                          ? "border-primary bg-primary/5 shadow-2xs ring-2 ring-primary/20"
                          : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItemSelect(item.id)}
                          className="w-4 h-4 text-primary rounded-md focus:ring-primary cursor-pointer shrink-0"
                        />
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">🧸</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-muted-foreground">
                            Qty: {item.quantity} • ৳{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-black text-foreground shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                2. Reason for Return *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "DEFECTIVE", label: "Defective / Not Working" },
                  { id: "DAMAGED", label: "Damaged in Transit" },
                  { id: "WRONG_PRODUCT", label: "Wrong Product / Color" },
                  { id: "SIZE_ISSUE", label: "Size / Age Not Suitable" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setReason(r.id as typeof reason)}
                    className={`p-3 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer text-center ${
                      reason === r.id
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border/60 bg-muted/30 text-foreground hover:border-primary/40"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Text Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                3. Describe the Problem in Detail *
              </label>
              <textarea
                rows={3}
                placeholder="Explain the reason for return (e.g. piece missing from box, incorrect color, damage during delivery)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3.5 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs resize-none"
              />
            </div>

            {/* 4. Photo Proof Attachment with File Upload */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                4. Photo Proof of Toy / Box (Recommended)
              </label>

              {/* Upload Input & Previews */}
              <div className="flex flex-wrap items-center gap-3">
                {uploadedImageUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-border shadow-xs group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Proof" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-[10px] transition-colors"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-28 h-20 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors p-2 text-center">
                  <UploadCloud className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground leading-tight">
                    {isUploadingPhoto ? "Uploading..." : "+ Add Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingPhoto}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingPhoto(true);
                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("image", file);

                        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";
                        const res = await fetch(`${backendUrl}/upload?folder=returns`, {
                          method: "POST",
                          body: formData,
                        });
                        const data = await res.json();
                        if (res.ok && (data.success || data.status === "success") && (data.data?.url || data.url)) {
                          const imageUrl = data.data?.url || data.url;
                          setUploadedImageUrls((prev) => [...prev, imageUrl]);
                          toast.success("Photo proof uploaded successfully!");
                        } else {
                          toast.error(data.message || "Failed to upload image");
                        }
                      } catch {
                        toast.error("Network error while uploading photo");
                      } finally {
                        setIsUploadingPhoto(false);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Upload clear photos of the defective toy, unboxing damage, or box label. Max 5MB per image.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || selectedItemIds.length === 0}
              className="w-full sm:w-auto rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25"
            >
              {isSubmitting ? "Submitting Request..." : "Submit Return Request"}
            </Button>
          </form>
        </div>
      )}
    </div>
  </div>
);
}

export default function ReturnsPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-sm">Loading Returns...</div>}>
      <ReturnsContent />
    </React.Suspense>
  );
}
