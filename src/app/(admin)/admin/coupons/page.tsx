"use client";

import * as React from "react";
import {
  Ticket,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Eye,
  Sparkles,
  Calendar,
  Percent,
  Banknote,
  Truck,
} from "lucide-react";
import { couponService, type CouponItem, type CreateCouponPayload } from "@/services/coupon.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modals state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<CouponItem | null>(null);
  const [deletingCoupon, setDeletingCoupon] = React.useState<CouponItem | null>(null);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Form inputs
  const [formData, setFormData] = React.useState<CreateCouponPayload>({
    code: "",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 1500,
    maximumDiscount: null,
    usageLimit: null,
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const loadCoupons = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await couponService.listAdminCoupons();
      setCoupons(items);
    } catch {
      toast.error("Failed to load coupons from database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      type: "PERCENTAGE",
      value: 10,
      minimumOrderAmount: 1500,
      maximumDiscount: null,
      usageLimit: null,
      isActive: true,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      minimumOrderAmount: coupon.minimumOrderAmount ? Number(coupon.minimumOrderAmount) : null,
      maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null,
      usageLimit: coupon.usageLimit || null,
      isActive: coupon.isActive,
      startDate: new Date(coupon.startDate).toISOString().split("T")[0],
      endDate: new Date(coupon.endDate).toISOString().split("T")[0],
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, formData);
        toast.success(`Coupon ${formData.code.toUpperCase()} updated successfully`);
      } else {
        await couponService.createCoupon(formData);
        toast.success(`Coupon ${formData.code.toUpperCase()} created successfully`);
      }
      setIsFormOpen(false);
      loadCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon: CouponItem) => {
    try {
      const nextStatus = !coupon.isActive;
      await couponService.updateCoupon(coupon.id, { isActive: nextStatus });
      toast.success(
        `Coupon ${coupon.code} is now ${nextStatus ? "Active (Showing on Store)" : "Inactive"}`
      );
      loadCoupons();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deletingCoupon) return;
    setIsSubmitting(true);
    try {
      await couponService.deleteCoupon(deletingCoupon.id);
      toast.success(`Coupon ${deletingCoupon.code} deleted`);
      setIsDeletingOpen(false);
      loadCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === "ACTIVE") return c.isActive;
    if (statusFilter === "INACTIVE") return !c.isActive;
    return true;
  });

  // Active topbar banner coupon (first active, unexpired)
  const activeBannerCoupon = coupons.find((c) => {
    const now = new Date();
    return c.isActive && new Date(c.startDate) <= now && new Date(c.endDate) >= now;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-foreground flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" />
            Coupons &amp; Topbar Discounts
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create coupon codes stored in the database. Active coupons display live in the storefront Top Announcement Bar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCoupons}
            className="rounded-xl h-9 text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="rounded-xl h-9 text-xs font-bold gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Live Topbar Preview Card */}
      <Card className="rounded-3xl border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📢</span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Live Topbar Announcement Preview
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              {activeBannerCoupon
                ? "Active & Displaying on Storefront"
                : "No active coupon (showing default text)"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="bg-[#FFB703] text-slate-900 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-4 text-xs font-semibold shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <span>🎁</span>
              <span>Happy Kids, Happier Days! | Free shipping on orders over ৳1,500</span>
              {activeBannerCoupon && (
                <span className="font-normal pl-2 border-l border-amber-600/40 flex items-center gap-1.5">
                  <span>
                    {activeBannerCoupon.type === "PERCENTAGE"
                      ? `Extra ${Number(activeBannerCoupon.value)}% OFF code:`
                      : activeBannerCoupon.type === "FIXED"
                      ? `Flat ৳${Number(activeBannerCoupon.value)} OFF code:`
                      : "Free Delivery code:"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-white font-black text-xs">
                    {activeBannerCoupon.code}
                  </span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-800 font-bold uppercase tracking-wider shrink-0 bg-amber-400/60 px-2 py-0.5 rounded-full">
              Live Store Banner
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-3xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-semibold">Total Coupons</p>
            <h3 className="text-xl font-black text-foreground">{coupons.length}</h3>
          </div>
        </Card>

        <Card className="rounded-3xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-semibold">Active Codes</p>
            <h3 className="text-xl font-black text-foreground">
              {coupons.filter((c) => c.isActive).length}
            </h3>
          </div>
        </Card>

        <Card className="rounded-3xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0EA5E9] flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-semibold">Current Topbar Code</p>
            <h3 className="text-sm font-black text-foreground font-mono">
              {activeBannerCoupon ? activeBannerCoupon.code : "None"}
            </h3>
          </div>
        </Card>

        <Card className="rounded-3xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-semibold">Total Times Used</p>
            <h3 className="text-xl font-black text-foreground">
              {coupons.reduce((acc, c) => acc + (c._count?.usages || 0), 0)}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search coupon code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-muted/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ALL")}
            className="rounded-xl h-8 text-xs font-bold"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "ACTIVE" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ACTIVE")}
            className="rounded-xl h-8 text-xs font-bold"
          >
            Active Only
          </Button>
          <Button
            variant={statusFilter === "INACTIVE" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("INACTIVE")}
            className="rounded-xl h-8 text-xs font-bold"
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Coupons Table Card */}
      <Card className="rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4">Validity Period</th>
                <th className="py-3 px-4 text-center">Usage</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading coupons from database...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No coupons found. Click &quot;Create Coupon&quot; to add one.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const now = new Date();
                  const isExpired = new Date(coupon.endDate) < now;
                  const isBanner = activeBannerCoupon?.id === coupon.id;

                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(coupon.code)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold text-xs hover:opacity-85 transition-opacity"
                            title="Click to copy code"
                          >
                            <span>{coupon.code}</span>
                            {copiedCode === coupon.code ? (
                              <Check className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60" />
                            )}
                          </button>

                          {isBanner && (
                            <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px] rounded-full border-none px-2 py-0.5">
                              ⭐ Topbar
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="rounded-lg text-[11px] font-bold">
                          {coupon.type === "PERCENTAGE" && "% Percentage"}
                          {coupon.type === "FIXED" && "৳ Fixed Amount"}
                          {coupon.type === "FREE_DELIVERY" && "🚚 Free Delivery"}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-black text-foreground">
                        {coupon.type === "PERCENTAGE"
                          ? `${Number(coupon.value)}% OFF`
                          : coupon.type === "FIXED"
                          ? `৳${Number(coupon.value)} OFF`
                          : "Free Shipping"}
                      </td>

                      <td className="py-3 px-4 text-muted-foreground">
                        {coupon.minimumOrderAmount
                          ? `৳${Number(coupon.minimumOrderAmount)}`
                          : "No minimum"}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                            {new Date(coupon.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        {isExpired && (
                          <span className="text-rose-500 font-bold block text-[10px]">
                            Expired
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center font-bold">
                        {coupon._count?.usages || 0}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(coupon)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            coupon.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:opacity-80"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:opacity-80"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(coupon)}
                            className="h-7 w-7 rounded-lg text-slate-600 hover:text-foreground"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingCoupon(coupon);
                              setIsDeletingOpen(true);
                            }}
                            className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Coupon Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-lg">
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure discount rules. Active coupons automatically appear on the storefront banner and checkouts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Coupon Code *
              </label>
              <Input
                required
                placeholder="e.g. SUMMER20 or EID15"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="h-10 rounded-xl font-mono uppercase font-bold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Discount Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount (৳)</SelectItem>
                    <SelectItem value="FREE_DELIVERY">Free Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Discount Value *
                </label>
                <Input
                  type="number"
                  required
                  min={1}
                  placeholder={formData.type === "PERCENTAGE" ? "10 (%)" : "150 (৳)"}
                  value={formData.value || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, value: Number(e.target.value) })
                  }
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Minimum Order (৳)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1500 (optional)"
                  value={formData.minimumOrderAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderAmount: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Usage Limit
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 500 (optional)"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Expiry Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActiveCheckbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="isActiveCheckbox" className="text-xs font-bold text-foreground cursor-pointer">
                Active immediately (Display on Topbar Banner)
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl h-10 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl h-10 text-xs font-bold gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingCoupon ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeletingOpen} onOpenChange={setIsDeletingOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 font-display font-black text-lg">
              <AlertTriangle className="w-5 h-5" />
              Delete Coupon
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Are you sure you want to delete coupon code{" "}
              <strong className="font-mono text-foreground">
                {deletingCoupon?.code}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeletingOpen(false)}
              className="rounded-xl h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleDelete}
              className="rounded-xl h-9 text-xs font-bold gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
