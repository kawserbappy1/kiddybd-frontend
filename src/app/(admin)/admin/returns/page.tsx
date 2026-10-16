"use client";

import * as React from "react";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { adminService } from "@/services/admin.service";
import type { AdminReturnRequest } from "@/types/admin.types";
import { toast } from "sonner";

export default function AdminReturnsPage() {
  const [returns, setReturns] = React.useState<AdminReturnRequest[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rejectModalId, setRejectModalId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("Item shows signs of usage or outside 7-day policy");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadReturns = React.useCallback(async () => {
    setIsLoading(true);
    const res = await adminService.getReturns();
    if (res.data) setReturns(res.data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const handleApprove = async (id: string) => {
    const res = await adminService.approveReturn(id, "bKash");
    if (res.success) {
      toast.success("Return approved and refund issued via bKash");
      loadReturns();
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalId) return;
    const res = await adminService.rejectReturn(rejectModalId, rejectReason);
    if (res.success) {
      toast.success("Return rejected");
      setRejectModalId(null);
      loadReturns();
    }
  };

  const filteredReturns = returns.filter((r) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.returnNumber.toLowerCase().includes(q) ||
      r.orderNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Returns & Refund Dispatches"
        subtitle="Review 7-day customer return requests, inspect photo evidence, approve bKash refunds, or reject with audit notes."
        actions={
          <button
            onClick={() => loadReturns()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Return #, Order #, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Returns Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Return ID & Date</th>
                  <th className="py-3 px-4">Customer & Order</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Reason & Details</th>
                  <th className="py-3 px-4">Photo Evidence</th>
                  <th className="py-3 px-4">Refund Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
                        <span>Loading return requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RotateCcw className="h-8 w-8 text-slate-400" />
                        <span className="font-medium text-sm">No return requests found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map((ret) => (
                    <tr key={ret.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{ret.returnNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ret.requestedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{ret.customerName}</div>
                      <div className="text-[11px] text-slate-500">{ret.customerPhone}</div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                        Order #{ret.orderNumber}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ret.productImage}
                            alt={ret.productTitle}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[160px]">
                            {ret.productTitle}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">SKU: {ret.productSku}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block">
                        {ret.reason}
                      </span>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 max-w-[180px] line-clamp-2">
                        {ret.reasonDetails}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {ret.evidenceImages.map((img, i) => (
                          <a
                            key={i}
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="Evidence" className="h-full w-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ৳{ret.priceBDT.toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ret.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : ret.status === "PENDING_REVIEW"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {ret.status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
                        {ret.status === "PENDING_REVIEW" && <AlertTriangle className="h-3 w-3" />}
                        {ret.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                        {ret.status}
                      </span>
                      {ret.adminNote && (
                        <div className="text-[10px] text-slate-500 mt-1 max-w-[140px] truncate">
                          {ret.adminNote}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {ret.status === "PENDING_REVIEW" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(ret.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            title="Approve & Initiate Refund"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModalId(ret.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 hover:bg-rose-200 text-xs font-bold transition-colors cursor-pointer"
                            title="Reject Return"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Reject Modal */}
        {rejectModalId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Reject Return Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Please specify a reason note. This will be visible on the customer's dashboard.
              </p>

              <form onSubmit={handleReject} className="space-y-4">
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  required
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalId(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
