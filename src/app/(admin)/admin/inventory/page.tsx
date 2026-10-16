"use client";

import * as React from "react";
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  X,
  History,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { adminService } from "@/services/admin.service";
import type { AdminInventoryItem } from "@/types/admin.types";
import { toast } from "sonner";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = React.useState<AdminInventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<AdminInventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = React.useState<number>(0);
  const [auditReason, setAuditReason] = React.useState<string>("NEW_STOCK_ARRIVAL");
  const [customNote, setCustomNote] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadInventory = React.useCallback(async () => {
    setIsLoading(true);
    const res = await adminService.getInventory();
    if (res.data) setInventory(res.data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleOpenModal = (item: AdminInventoryItem) => {
    setSelectedItem(item);
    setAdjustQty(10);
    setAuditReason("RESTOCK_PURCHASE");
    setCustomNote("");
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (adjustQty === 0) {
      toast.error("Adjustment quantity cannot be 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullReason = `${auditReason}${customNote ? `: ${customNote}` : ""}`;
      const res = await adminService.adjustStock(selectedItem.id, adjustQty, fullReason);
      if (res.success) {
        toast.success(`Updated stock for ${selectedItem.sku} (${adjustQty > 0 ? "+" : ""}${adjustQty})`);
        setSelectedItem(null);
        loadInventory();
      }
    } catch {
      toast.error("Failed to adjust inventory");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = inventory.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.productTitle.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Inventory & Real-Time Stock Control"
        subtitle="Track SKU warehouse counts, reserve pools for active checkouts, and execute audited stock adjustments."
        actions={
          <button
            onClick={() => loadInventory()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Stock
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU, Product Name, Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> In Stock
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Low Stock
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Out of Stock
            </span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (BDT)</th>
                  <th className="py-3 px-4 text-center">Base Stock</th>
                  <th className="py-3 px-4 text-center">Reserved (In Cart/Order)</th>
                  <th className="py-3 px-4 text-center">Available to Buy</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Product & SKU */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.productTitle}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[240px]">
                            {item.productTitle}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            SKU: {item.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {item.category}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      ৳{item.priceBDT.toLocaleString()}
                    </td>

                    {/* Base Stock */}
                    <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {item.baseStock}
                    </td>

                    {/* Reserved Stock */}
                    <td className="py-4 px-4 text-center text-amber-600 dark:text-amber-400 font-semibold">
                      {item.reservedStock}
                    </td>

                    {/* Available Stock */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {item.availableStock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "IN_STOCK"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : item.status === "LOW_STOCK"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {item.status === "IN_STOCK" && <CheckCircle2 className="h-3 w-3" />}
                        {item.status === "LOW_STOCK" && <AlertTriangle className="h-3 w-3" />}
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Stock Adjustment */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Stock Audit & Adjustment
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdjustStock} className="mt-4 space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedItem.productTitle}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    SKU: {selectedItem.sku} | Current Base: {selectedItem.baseStock} | Available: {selectedItem.availableStock}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Adjustment Quantity (Use negative for damage/loss)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjustQty((prev) => prev - 1)}
                      className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 font-black"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                      className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAdjustQty((prev) => prev + 1)}
                      className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 font-black"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    New Base Stock will be:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {Math.max(0, selectedItem.baseStock + adjustQty)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Audit Reason (Required for Compliance)
                  </label>
                  <select
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="RESTOCK_PURCHASE">Purchase Order Shipment Received</option>
                    <option value="CUSTOMER_RETURN_RESTOCK">Customer Return Inspected & Restocked</option>
                    <option value="DAMAGE_WRITE_OFF">Transit or Warehouse Damage Write-off</option>
                    <option value="INVENTORY_RECONCILIATION">Physical Count Audit Discrepancy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Internal Note / PO Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PO-8491 from Supplier BD Toys"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Confirm Audit Adjustment"}
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
