"use client";

import * as React from "react";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { adminService } from "@/services/admin.service";
import type { AdminCustomer } from "@/types/admin.types";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<AdminCustomer[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadCustomers = React.useCallback(async () => {
    setIsLoading(true);
    const res = await adminService.getCustomers();
    if (res.data) setCustomers(res.data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleToggleBlock = async (customer: AdminCustomer) => {
    const newStatus = customer.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const res = await adminService.updateCustomerStatus(customer.id, newStatus);
    if (res.success) {
      toast.success(
        `Customer ${customer.name} status updated to ${newStatus}`
      );
      loadCustomers();
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Intelligence & Fraud Blacklist"
        subtitle="Analyze customer lifetime value, courier refusal history (RTO), risk ratings, and blacklist fraudulent numbers."
        actions={
          <button
            onClick={() => loadCustomers()}
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
              placeholder="Search by customer name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Customer Intelligence Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4 text-center">Orders Placed</th>
                  <th className="py-3 px-4 text-center">Delivered Orders</th>
                  <th className="py-3 px-4 text-center">RTO Returns</th>
                  <th className="py-3 px-4">Total Spent (BDT)</th>
                  <th className="py-3 px-4">Risk Rating</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
                        <span>Loading customers from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-slate-400" />
                        <span className="font-medium text-sm">No customers found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                            {cust.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={cust.avatarUrl} alt={cust.name} className="h-full w-full object-cover" />
                            ) : (
                              cust.name?.[0] || "C"
                            )}
                          </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{cust.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Member since {cust.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{cust.phone}</div>
                      <div className="text-[11px] text-slate-500">{cust.email}</div>
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      {cust.totalOrders}
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {cust.completedOrders}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-black ${
                          cust.rtoCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400"
                        }`}
                      >
                        {cust.rtoCount}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ৳{cust.totalSpentBDT.toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.riskRating === "LOW"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : cust.riskRating === "MEDIUM"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {cust.riskRating === "LOW" && <ShieldCheck className="h-3 w-3" />}
                        {cust.riskRating === "HIGH" && <AlertTriangle className="h-3 w-3" />}
                        {cust.riskRating} RISK
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          cust.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleBlock(cust)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          cust.status === "BLOCKED"
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        }`}
                      >
                        {cust.status === "BLOCKED" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" />
                            Blacklist / Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
