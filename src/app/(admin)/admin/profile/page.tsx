"use client";

import * as React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Camera,
  CheckCircle2,
  Clock,
  KeyRound,
  Loader2,
  Lock,
  Activity,
  Layers,
  ShoppingBag,
  RotateCcw,
  Package,
  FolderTree,
  Award,
  Users,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { adminStaffService } from "@/services/admin-staff.service";
import { toast } from "sonner";
import { AdminRole } from "@/types/admin.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RoleActivityDetails {
  title: string;
  badgeColor: string;
  summary: string;
  permissions: string[];
  moduleAccess: string[];
}

const ROLE_ACTIVITY_MAP: Record<AdminRole, RoleActivityDetails> = {
  SUPER_ADMIN: {
    title: "Super Admin (Full Master Access)",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    summary:
      "Has unhindered master access across all system operations, security, staff management, financial reports, risk engine and audit trails.",
    permissions: [
      "Create, edit, suspend and reset password for all admin members",
      "Full access to edit customer orders, bypass risk, and override cancellations",
      "Product catalog creation, pricing changes and category/brand governance",
      "Warehouse inventory adjustments and safety stock rules",
      "Access to full audit log trail and financial reconciliations",
    ],
    moduleAccess: [
      "Dashboard & Analytics",
      "Orders & Dispatch",
      "Products & SKUs",
      "Categories & Brands",
      "Coupons & Discounts",
      "Customers CRM",
      "Returns & RTO",
      "Staff & Security",
      "Audit Log Stream",
    ],
  },
  ADMIN: {
    title: "General Admin",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    summary:
      "General operational oversight across order fulfillment, product catalogs, customer service, and inventory sync.",
    permissions: [
      "View and edit product inventory, prices, and categories",
      "Review and verify customer orders, courier consignment generation",
      "Process return and exchange requests",
      "Manage customer accounts and loyalty tags",
    ],
    moduleAccess: [
      "Dashboard & Analytics",
      "Orders & Dispatch",
      "Products & SKUs",
      "Categories & Brands",
      "Customers CRM",
      "Returns & RTO",
    ],
  },
  ORDER_MANAGER: {
    title: "Order Fulfillment Manager",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    summary:
      "Manages customer orders pipeline, phone verification calls, Steadfast/Pathao courier shipping, and returns handling.",
    permissions: [
      "Update order status from PENDING to CONFIRMED, PROCESSING, SHIPPED",
      "Assign and dispatch orders to Steadfast, Pathao & RedX with automatic tracking code",
      "Print invoices and packing slips with customer address labels",
      "Inspect and approve customer return & exchange requests",
    ],
    moduleAccess: [
      "Dashboard",
      "Orders Management",
      "Order Tracking & Dispatch",
      "Returns & RTO",
    ],
  },
  INVENTORY_MANAGER: {
    title: "Inventory & Catalog Manager",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    summary:
      "Oversees warehouse product stock levels, SKU variants, product photography, categories, and brand additions.",
    permissions: [
      "Create and edit products with multi-image Cloudinary uploads",
      "Configure product variants (sizes, colors, age groups, skills)",
      "Monitor low stock alerts and execute manual stock adjustments",
      "Manage toy categories and manufacturer brand profiles",
    ],
    moduleAccess: [
      "Dashboard",
      "Products Catalog",
      "Categories",
      "Brands",
      "Inventory & SKUs",
    ],
  },
  CONTENT_MANAGER: {
    title: "Content & Blog Manager",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    summary:
      "Responsible for parenting blog articles, educational guides, homepage hero promotional banners, and discount coupon campaigns.",
    permissions: [
      "Write, publish, and edit parenting advice and educational toy articles",
      "Generate promotional coupon codes (% or fixed discounts with max caps)",
      "Manage public category tags and SEO descriptions",
    ],
    moduleAccess: [
      "Dashboard",
      "Articles & Blog",
      "Coupons & Discounts",
      "Categories",
    ],
  },
  CUSTOMER_SUPPORT: {
    title: "Customer Support Specialist",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    summary:
      "Focuses on customer satisfaction, order status inquiries, dispute resolution, address verification, and return requests.",
    permissions: [
      "View customer purchase history, reputation score, and delivery success rate",
      "Log return and exchange tickets on behalf of customers",
      "View orders and live shipment courier tracking links",
    ],
    moduleAccess: [
      "Dashboard",
      "Customers List",
      "Orders Tracking",
      "Returns Management",
    ],
  },
  FINANCE_MANAGER: {
    title: "Finance & Accounts Manager",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    summary:
      "Audits online payments (bKash/Nagad/SSLCommerz), COD cash collections from couriers, and refunds disbursement.",
    permissions: [
      "View payment transactions and webhook reconciliation logs",
      "Approve customer refund transactions",
      "Monitor sales revenue metrics and coupon discount expenses",
    ],
    moduleAccess: [
      "Dashboard & Analytics",
      "Payments",
      "Refunds",
      "Coupons & Discounts",
    ],
  },
};

export default function AdminProfilePage() {
  const { user, loginSuccess } = useAuthStore();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Editable Form State
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");
  const [newPassword, setNewPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const currentRole = (user?.role || "SUPER_ADMIN") as AdminRole;
  const roleInfo = ROLE_ACTIVITY_MAP[currentRole] || ROLE_ACTIVITY_MAP.SUPER_ADMIN;

  const getInitials = (n?: string | null) => {
    if (!n) return "AD";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading picture to Cloudinary...");
    try {
      const uploadedUrl = await adminStaffService.uploadAvatar(file);
      setAvatarUrl(uploadedUrl);

      // Auto save avatar for quick feedback
      if (user?.id) {
        if (isSuperAdmin) {
          await adminStaffService.updateStaffProfile(user.id, { avatarUrl: uploadedUrl });
        } else {
          await adminStaffService.updateMyProfile({ avatarUrl: uploadedUrl });
        }
        // Update local auth store
        loginSuccess({ ...user, avatarUrl: uploadedUrl } as any, localStorage.getItem("kiddy_access_token") || "");
      }

      toast.success("Profile picture updated on Cloudinary!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      if (isSuperAdmin) {
        // Super Admin can edit Name, Email, Phone, Password, and Avatar
        const payload: any = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          avatarUrl: avatarUrl || undefined,
        };
        if (newPassword.trim()) {
          if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            setIsSaving(false);
            return;
          }
          payload.password = newPassword.trim();
        }

        const res = await adminStaffService.updateStaffProfile(user.id, payload);
        if (res.success && res.data) {
          loginSuccess({ ...user, ...res.data } as any, localStorage.getItem("kiddy_access_token") || "");
          toast.success("Super Admin profile and credentials successfully updated!");
          setNewPassword("");
        } else {
          toast.error(res.message || "Failed to update profile");
        }
      } else {
        // Normal Admin: Can only update profile picture / name (Email, phone, and role are restricted by Super Admin)
        const res = await adminStaffService.updateMyProfile({
          name: name.trim(),
          avatarUrl: avatarUrl || undefined,
        });
        if (res.success) {
          loginSuccess({ ...user, name: name.trim(), avatarUrl } as any, localStorage.getItem("kiddy_access_token") || "");
          toast.success("Profile updated successfully!");
        } else {
          toast.error(res.message || "Failed to update profile");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const joiningDateFormatted = React.useMemo(() => {
    if (!user?.createdAt) return "October 2026";
    try {
      return new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "October 2026";
    }
  }, [user?.createdAt]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Title & Breadcrumb header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <span>Admin Profile & Account</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${roleInfo.badgeColor}`}
            >
              {user?.role || "ADMIN"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal profile, credentials, and review department activity permissions.
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Master Super Admin Privilege Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Profile Card & Picture Upload */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-center relative overflow-hidden">
            {/* Ambient subtle top gradient banner */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-sky-500/10 via-primary/10 to-rose-500/10 border-b border-border/50" />

            {/* Avatar with Cloudinary Upload Trigger */}
            <div className="relative inline-block mt-4 mb-3">
              <Avatar className="h-28 w-28 rounded-2xl border-4 border-card shadow-lg bg-card">
                <AvatarImage src={avatarUrl || ""} alt={user?.name || "Admin"} className="object-cover" />
                <AvatarFallback className="rounded-2xl text-2xl font-black bg-primary/10 text-primary">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Change Profile Picture (Upload to Cloudinary)"
                className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <h2 className="text-xl font-bold text-foreground">{user?.name || "Shafiqur Rahman"}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.email || "admin@kiddojoy.com"}</p>

            <div className="mt-3 flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.badgeColor}`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>{roleInfo.title}</span>
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-border/80 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joining Date
                </span>
                <span className="font-semibold text-foreground">{joiningDateFormatted}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone Contact
                </span>
                <span className="font-semibold text-foreground">{user?.phone || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Account Status
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {user?.status || "ACTIVE"}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground text-left leading-relaxed">
              💡 <strong>Avatar Cloudinary Storage:</strong> All admins and super admins can freely update their profile image anytime.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Edit Form & Role Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isSuperAdmin
                    ? "As Super Admin, you can edit your name, email, phone number, and password directly."
                    : "Regular admins can update their profile picture. Contact the Super Admin to modify name, phone, or assigned role."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Full Name {isSuperAdmin ? "" : "(Read Only for Staff)"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isSuperAdmin}
                      required
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/40 transition-all"
                    />
                  </div>
                </div>

                {/* Email / User ID */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Email / Admin User ID {isSuperAdmin ? "(Super Admin Editable)" : "(Fixed by Super Admin)"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isSuperAdmin}
                      required
                      placeholder="admin@kiddybd.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/40 transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Phone Number {isSuperAdmin ? "(Super Admin Editable)" : "(Fixed by Super Admin)"}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isSuperAdmin}
                      placeholder="+8801700000001"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/40 transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Joining Date (System Timestamp)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={joiningDateFormatted}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Password update (Super Admin Only) */}
              {isSuperAdmin && (
                <div className="pt-3 border-t border-border/80">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Change Password (Leave blank to keep current)
                  </label>
                  <div className="relative max-w-md">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary transition-all font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {isSuperAdmin
                    ? "All changes take effect immediately across all active sessions."
                    : "You can change your avatar directly via Cloudinary."}
                </span>

                {isSuperAdmin && (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Save Profile Changes
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Role & Role Activity Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Role & Operational Activity</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detailed capabilities and operational boundaries assigned to your role.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.badgeColor}`}>
                {roleInfo.title}
              </span>
            </div>

            <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border/60">
              {roleInfo.summary}
            </p>

            {/* Allowed Core Permissions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Permitted Role Actions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roleInfo.permissions.map((perm, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-background border border-border/80 text-xs text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Access */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Authorized Admin Modules
              </h4>
              <div className="flex flex-wrap gap-2">
                {roleInfo.moduleAccess.map((mod, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-accent/60 border border-border text-xs font-medium text-foreground"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
