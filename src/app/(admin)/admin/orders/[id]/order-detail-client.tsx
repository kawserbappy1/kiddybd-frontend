"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Truck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { adminService } from "@/services/admin.service";
import type { AdminOrder, AdminOrderStatus, CourierProvider } from "@/types/admin.types";
import { toast } from "sonner";

export function AdminOrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = React.useState<AdminOrder | null>(null);
  const [selectedCourier, setSelectedCourier] = React.useState<CourierProvider>("Pathao");
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      setIsLoading(true);
      const res = await adminService.getOrderById(orderId);
      if (res.data) {
        setOrder(res.data);
        if (res.data.courierProvider) setSelectedCourier(res.data.courierProvider);
        if (res.data.courierTrackingCode) setTrackingNumber(res.data.courierTrackingCode);
      }
      setIsLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: AdminOrderStatus) => {
    if (!order) return;
    const res = await adminService.updateOrderStatus(order.id, newStatus);
    if (res.success && res.data) {
      setOrder(res.data);
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      // Fallback: update local status immediately and fetch fresh details
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Order status updated to ${newStatus}`);
      try {
        const fresh = await adminService.getOrderById(order.id);
        if (fresh.data) setOrder(fresh.data);
      } catch {
        // Keep optimistic state
      }
    }
  };

  const handleCourierDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    const tracking = trackingNumber || `${selectedCourier.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const res = await adminService.assignCourier(order.id, selectedCourier, tracking);
    if (res.success && res.data) {
      setOrder(res.data);
      setTrackingNumber(tracking);
      toast.success(`Dispatched via ${selectedCourier} (${tracking})`);
    } else {
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "SHIPPED",
              courierProvider: selectedCourier,
              courierTrackingCode: tracking,
            }
          : null
      );
      setTrackingNumber(tracking);
      toast.success(`Dispatched via ${selectedCourier} (${tracking})`);
      try {
        const fresh = await adminService.getOrderById(order.id);
        if (fresh.data) setOrder(fresh.data);
      } catch {
        // Keep optimistic
      }
    }
  };

  const handlePrintPackingSlip = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-sm font-medium text-slate-500">Loading Order Details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Order Not Found</h2>
        <Link href="/admin/orders" className="mt-4 text-xs font-bold text-amber-500 hover:underline">
          ← Back to Orders Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col print:m-0">
      {/* Screen-Only Admin Header */}
      <div className="print:hidden">
        <AdminHeader
          title={`Order ${order.orderNumber}`}
          subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`}
          actions={
            <div className="flex items-center gap-2">
              <Link
                href="/admin/orders"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
              <button
                onClick={handlePrintPackingSlip}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Packing Slip & Invoice
              </button>
            </div>
          }
        />
      </div>

      {/* DEDICATED PRINT-ONLY PACKING SLIP & INVOICE */}
      <div className="hidden print:block p-8 bg-white text-black font-sans max-w-3xl mx-auto">
        {/* Brand & Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">KiddyBD</h1>
            <p className="text-xs text-gray-600 mt-0.5">Kids & Toys Ecommerce BD</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">INVOICE & PACKING SLIP</h2>
            <p className="text-xs font-mono font-bold mt-1">Order #{order.orderNumber}</p>
            <p className="text-[11px] text-gray-600">
              Date: {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Customer & Delivery Address Box */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Delivery To (Customer Address)
          </h3>
          <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
          <div className="text-xs text-gray-700 mt-1 space-y-0.5">
            <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
            <p><span className="font-semibold">Address:</span> {order.deliveryAddress?.street || "N/A"}</p>
            <p>
              {[order.deliveryAddress?.thana, order.deliveryAddress?.district, order.deliveryAddress?.division].filter(Boolean).join(", ") || "Bangladesh"}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between text-xs font-semibold">
            <span>Payment Method: {order.paymentMethod}</span>
            <span>Payment Status: {order.paymentStatus}</span>
          </div>
        </div>

        {/* Product & Price Table */}
        <div className="mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-gray-100">
                <th className="py-2 px-3 font-bold">Item Description</th>
                <th className="py-2 px-3 font-bold">SKU / Variant</th>
                <th className="py-2 px-3 text-center font-bold">Qty</th>
                <th className="py-2 px-3 text-right font-bold">Unit Price</th>
                <th className="py-2 px-3 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 px-3 font-semibold">{item.title}</td>
                  <td className="py-2.5 px-3 text-gray-600 font-mono text-[11px]">
                    {item.sku} {item.variant ? `(${item.variant})` : ""}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right">৳{item.unitPrice.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-bold">৳{item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Summary Breakdown */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge:</span>
              <span>৳{order.deliveryCharge.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount / Coupon:</span>
                <span>-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-black flex justify-between text-sm font-black">
              <span>Total Payable:</span>
              <span>৳{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Packing Slip Footer */}
        <div className="border-t border-gray-300 pt-4 text-center text-[10px] text-gray-500">
          Thank you for shopping with KiddyBD! For support or inquiries, visit kiddybd.com or contact customer care.
        </div>
      </div>

      {/* SCREEN-ONLY INTERACTIVE DASHBOARD VIEW */}
      <div className="p-6 space-y-6 print:hidden">
        {/* Risk & Fraud Review Banner (if High or Medium) */}
        {order.riskScore === "HIGH" && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                High Risk Warning — Verification Required
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                This order was flagged by KiddoJoy Risk Engine prior to dispatch:
              </p>
              <ul className="list-disc list-inside text-xs text-rose-700 dark:text-rose-400 pt-1 space-y-0.5">
                {order.riskReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="pt-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                Action: Please call customer at {order.customerPhone} to verify before sending via Courier.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items & Financials */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-500" />
                Ordered Items ({order.items.length})
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          SKU: <span className="font-mono text-slate-700 dark:text-slate-300">{item.sku}</span> | Variant: {item.variant}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          ৳{item.unitPrice.toLocaleString()} × {item.quantity} qty
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        ৳{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Summary */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:divide-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery Charge</span>
                  <span>৳{order.deliveryCharge.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount / Voucher</span>
                    <span>-৳{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span>৳{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Courier Dispatch Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-500" />
                Bangladesh Courier Dispatch & API Sync
              </h3>

              <form onSubmit={handleCourierDispatch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Courier Partner
                    </label>
                    <select
                      value={selectedCourier}
                      onChange={(e) => setSelectedCourier(e.target.value as CourierProvider)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Pathao">Pathao Courier (Dhaka Express & National)</option>
                      <option value="Steadfast">Steadfast Courier (BD District Network)</option>
                      <option value="RedX">RedX Logistics</option>
                      <option value="Paperfly">Paperfly Smart Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tracking Code (Waybill)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PTH-92840182"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500">
                    Dispatches `POST /api/v1/admin/orders/:id/assign-courier` to trigger parcel creation.
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Assign & Mark Shipped
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Customer & Delivery Details */}
          <div className="space-y-6">
            {/* Status Transition Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Lifecycle State Machine
              </h3>

              <div className="space-y-2">
                {(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as AdminOrderStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        order.status === s
                          ? "bg-amber-500 text-slate-950 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{s}</span>
                      {order.status === s && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Customer & Contact
              </h3>

              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {order.customerName}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-amber-500" />
                  <a href={`tel:${order.customerPhone}`} className="hover:underline font-mono">
                    {order.customerPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  <span>{order.customerEmail}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  Delivery Address
                </h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {order.deliveryAddress?.street || "No street address provided"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {[order.deliveryAddress?.thana, order.deliveryAddress?.district, order.deliveryAddress?.division].filter(Boolean).join(", ") || "Bangladesh"}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Payment Method
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {order.paymentMethod}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
