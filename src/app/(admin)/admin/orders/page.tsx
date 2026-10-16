"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Printer,
  ChevronDown,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { adminService } from "@/services/admin.service";
import type { AdminOrder, AdminOrderStatus, CourierProvider } from "@/types/admin.types";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  // Load orders
  const loadOrders = React.useCallback(async () => {
    setIsLoading(true);
    const res = await adminService.getOrders({
      status: filterStatus === "ALL" ? undefined : filterStatus,
      search: searchTerm || undefined,
    });
    if (res.data) setOrders(res.data);
    setIsLoading(false);
  }, [filterStatus, searchTerm]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Quick courier assignment
  const handleAssignCourier = async (orderId: string, courier: CourierProvider) => {
    const tracking = `${courier.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const res = await adminService.assignCourier(orderId, courier, tracking);
    if (res.success) {
      toast.success(`Dispatched via ${courier} (${tracking})`);
      loadOrders();
    }
  };

  // State machine transition
  const handleUpdateStatus = async (orderId: string, status: AdminOrderStatus) => {
    const res = await adminService.updateOrderStatus(orderId, status);
    if (res.success) {
      toast.success(`Order updated to ${status}`);
      loadOrders();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Order Pipeline & Courier Dispatch"
        subtitle="Process incoming orders, review fraud risks, assign Bangladesh logistics partners, and generate invoices."
        actions={
          <button
            onClick={() => loadOrders()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  filterStatus === s
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {s === "ALL" ? "All Orders" : s}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Order #, name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Risk & Fraud Intel</th>
                  <th className="py-3 px-4">Status & Pipeline</th>
                  <th className="py-3 px-4">Courier Partner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-black text-amber-600 dark:text-amber-400 hover:underline block"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {order.customerPhone}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {order.deliveryAddress?.thana || (order.deliveryAddress as any)?.district || "Dhaka"}
                          {order.deliveryAddress?.district ? `, ${order.deliveryAddress.district}` : ""}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} Items
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {order.items[0]?.title}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900 dark:text-white">
                          ৳{Number(order.totalAmount ?? (order as any).total ?? 0).toLocaleString()}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </td>

                      {/* Risk & Fraud Intel */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                              order.riskScore === "HIGH"
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {order.riskScore === "HIGH" && <AlertTriangle className="h-3 w-3" />}
                            {order.riskScore} RISK
                          </span>
                          {order.pastRtoCount > 0 && (
                            <span className="text-[10px] font-semibold text-rose-500">
                              ⚠️ {order.pastRtoCount} Past Courier RTOs
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Transition dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as AdminOrderStatus)
                          }
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Courier Partner */}
                      <td className="py-4 px-4">
                        {order.courierProvider ? (
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <Truck className="h-3.5 w-3.5 text-amber-500" />
                              {order.courierProvider}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {order.courierTrackingCode}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAssignCourier(order.id, "Pathao")}
                              className="px-2 py-1 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-200 dark:border-red-900 hover:bg-red-100 transition-colors"
                              title="Assign Pathao Courier"
                            >
                              Pathao
                            </button>
                            <button
                              onClick={() => handleAssignCourier(order.id, "Steadfast")}
                              className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
                              title="Assign Steadfast Courier"
                            >
                              Steadfast
                            </button>
                            <button
                              onClick={() => handleAssignCourier(order.id, "RedX")}
                              className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition-colors"
                              title="Assign REDX Courier"
                            >
                              REDX
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                            title="View Full Order Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
