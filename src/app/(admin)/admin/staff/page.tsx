"use client";

import * as React from "react";
import {
  Shield,
  KeyRound,
  UserPlus,
  Users,
  Search,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  Ban,
  UserCheck,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { adminStaffService } from "@/services/admin-staff.service";
import { useAuthStore } from "@/stores/use-auth-store";
import type { AdminStaffUser, AdminAuditLog, AdminRole } from "@/types/admin.types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ROLE_INFO: Record<
  AdminRole,
  { label: string; description: string; color: string }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    description: "Full master access to all modules, staff assignment, and audit logs.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  ADMIN: {
    label: "Admin",
    description: "High-level administrative control over day-to-day operations.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  ORDER_MANAGER: {
    label: "Order Manager",
    description: "Manages orders, status updates, courier dispatch, and returns only.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  INVENTORY_MANAGER: {
    label: "Inventory & Products",
    description: "Creates and updates products, variants, brands, and stock counts.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  CONTENT_MANAGER: {
    label: "Content & Blog",
    description: "Manages articles, blogs, banner coupons, and categories.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CUSTOMER_SUPPORT: {
    label: "Customer Support",
    description: "Views customers, handles return requests, and contact inquiries.",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  FINANCE_MANAGER: {
    label: "Finance Manager",
    description: "Accesses payments, refunds, vouchers, and financial analytics.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
};

export default function AdminStaffManagementPage() {
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<"staff" | "audit">("staff");
  const [staffUsers, setStaffUsers] = React.useState<AdminStaffUser[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // New admin user modal state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "Admin@12345",
    role: "ORDER_MANAGER" as AdminRole,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Password reset dialog state
  const [resetTargetUser, setResetTargetUser] = React.useState<AdminStaffUser | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [isResetting, setIsResetting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [staffRes, auditRes] = await Promise.all([
        adminStaffService.getStaffUsers(),
        adminStaffService.getAuditLogs({ limit: 50 }),
      ]);
      if (staffRes.data) setStaffUsers(staffRes.data);
      if (auditRes.data) setAuditLogs(auditRes.data);
    } catch {
      toast.error("Failed to load staff or audit logs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please enter a name and email/user ID");
      return;
    }

    setIsSubmitting(true);
    const res = await adminStaffService.createStaffUser(formData);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(
        `Admin account created: ${formData.name} as ${ROLE_INFO[formData.role]?.label}. They can log in with their email/ID & password.`
      );
      setIsCreateOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "Admin@12345",
        role: "ORDER_MANAGER",
      });
      loadData();
    } else {
      toast.error(res.message || "Failed to assign admin");
    }
  };

  const handleRoleChange = async (userId: string, newRole: AdminRole) => {
    const res = await adminStaffService.updateStaffRole(userId, newRole);
    if (res.success) {
      toast.success(`Role updated to ${ROLE_INFO[newRole]?.label}`);
      loadData();
    } else {
      toast.error(res.message || "Failed to update role");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    setIsResetting(true);
    const res = await adminStaffService.updateStaffRole(
      resetTargetUser.id,
      resetTargetUser.role,
      resetTargetUser.status as any,
      newPassword
    );
    setIsResetting(false);
    if (res.success) {
      toast.success(`Password successfully changed for ${resetTargetUser.name}`);
      setResetTargetUser(null);
      setNewPassword("");
    } else {
      toast.error(res.message || "Failed to update password");
    }
  };

  const handleToggleStatus = async (user: AdminStaffUser) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const res = await adminStaffService.updateStaffRole(user.id, user.role, newStatus);
    if (res.success) {
      toast.success(`User status changed to ${newStatus}`);
      loadData();
    } else {
      toast.error(res.message || "Failed to update status");
    }
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-md">
          Only the <strong>Super Admin</strong> has permission to assign administrative roles and inspect live audit activity logs.
        </p>
      </div>
    );
  }

  const filteredStaff = staffUsers.filter((u) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const filteredLogs = auditLogs.filter((l) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.entity.toLowerCase().includes(q) ||
      (l.user?.name && l.user.name.toLowerCase().includes(q)) ||
      (l.user?.email && l.user.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <AdminHeader
        title="Admin Staff & RBAC Management"
        subtitle="Super Admin Master Control: Create admin accounts with User ID and Password, assign their specific work role, and monitor audit logs."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign New Admin
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-5 w-5 text-primary" />
                    Create New Admin Account
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Set up credentials and assigned role. The admin will log in at /admin/login using these credentials. No simulate role dropdown is needed.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateStaff} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:ring-2 focus:ring-primary outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-foreground">
                        User ID / Email Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="admin@kiddybd.com or staff01"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:ring-2 focus:ring-primary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-foreground">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="017xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:ring-2 focus:ring-primary outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-foreground">
                      Login Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Admin@12345"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:ring-2 focus:ring-primary outline-hidden font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Default: <code className="bg-muted px-1 py-0.5 rounded">Admin@12345</code>. This password will be encrypted & saved to their account.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-foreground">
                      Assigned Topic & Permitted Role (RBAC) *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as AdminRole,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs font-medium focus:ring-2 focus:ring-primary outline-hidden"
                    >
                      {Object.entries(ROLE_INFO).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.label} ({info.description})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-xl bg-muted/30 p-3 text-[11px] text-muted-foreground border">
                    <p className="font-semibold text-foreground mb-0.5">
                      Scope Preview:
                    </p>
                    <p>{ROLE_INFO[formData.role]?.description}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating..." : "Create Admin Account"}
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Admin Staff
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-black">{staffUsers.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Active department leads & managers
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Audit Logs
            </span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black">{auditLogs.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Recorded admin actions & changes
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Master Access
            </span>
            <Shield className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black">
            {staffUsers.filter((s) => s.role === "SUPER_ADMIN").length} Super Admin
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Role hierarchy active
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border w-fit">
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "staff"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin Staff ({staffUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "audit"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Audit History ({auditLogs.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              activeTab === "staff"
                ? "Search staff by name, email, or role..."
                : "Search audit logs by action or user..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs focus:ring-2 focus:ring-primary outline-hidden"
          />
        </div>
      </div>

      {/* TAB 1: STAFF MANAGEMENT */}
      {activeTab === "staff" && (
        <div className="rounded-2xl border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Admin Member</th>
                  <th className="py-3 px-4">Assigned Topic & Role</th>
                  <th className="py-3 px-4">Permission Scope</th>
                  <th className="py-3 px-4">Assigned On</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading admin staff...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No admin members found.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => {
                    const roleMeta = ROLE_INFO[staff.role] || {
                      label: staff.role,
                      description: "Custom role",
                      color: "bg-muted text-muted-foreground",
                    };

                    return (
                      <tr key={staff.id} className="hover:bg-muted/30 transition-colors">
                        {/* Member Name & Email */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-foreground">{staff.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {staff.email || "No email"}
                          </div>
                          {staff.phone && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {staff.phone}
                            </div>
                          )}
                        </td>

                        {/* Role Selector */}
                        <td className="py-3 px-4">
                          <select
                            value={staff.role}
                            disabled={staff.id === currentUser?.id}
                            onChange={(e) =>
                              handleRoleChange(staff.id, e.target.value as AdminRole)
                            }
                            className={`rounded-lg px-2 py-1 text-xs font-bold border ${roleMeta.color} cursor-pointer disabled:cursor-not-allowed`}
                          >
                            {Object.entries(ROLE_INFO).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Permission Description */}
                        <td className="py-3 px-4 max-w-xs text-muted-foreground text-[11px]">
                          {roleMeta.description}
                        </td>

                        {/* Date Assigned */}
                        <td className="py-3 px-4 text-muted-foreground text-[11px]">
                          {new Date(staff.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              staff.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                staff.status === "ACTIVE"
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {staff.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setResetTargetUser(staff);
                                setNewPassword("");
                              }}
                              title="Reset or Change Password"
                              className="px-2 py-1 rounded-lg text-xs font-semibold border border-border hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <KeyRound className="h-3 w-3 text-muted-foreground" />
                              <span>Password</span>
                            </button>

                            {staff.id !== currentUser?.id && (
                              <button
                                onClick={() => handleToggleStatus(staff)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                                  staff.status === "ACTIVE"
                                    ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
                                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/40"
                                }`}
                              >
                                {staff.status === "ACTIVE" ? "Suspend" : "Activate"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Performer</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">IP / User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading audit activity logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No admin actions recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      {/* User */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">
                          {log.user?.name || "System/Admin"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {log.user?.role || "UNKNOWN"}
                        </div>
                      </td>

                      {/* Entity */}
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-bold text-[11px]">
                          {log.entity}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 font-mono text-primary font-bold">
                        {log.action}
                      </td>

                      {/* Entity ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                        {log.entityId}
                      </td>

                      {/* IP */}
                      <td className="py-3 px-4 text-muted-foreground text-[10px] truncate max-w-[120px]">
                        {log.ip}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      <Dialog
        open={!!resetTargetUser}
        onOpenChange={(open) => {
          if (!open) {
            setResetTargetUser(null);
            setNewPassword("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-5 w-5 text-primary" />
              Change Admin Password
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update login password for{" "}
              <strong className="text-foreground">{resetTargetUser?.name}</strong> (
              {resetTargetUser?.email || resetTargetUser?.phone}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                New Password *
              </label>
              <input
                type="text"
                required
                placeholder="Enter new password (e.g. Admin@12345)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:ring-2 focus:ring-primary outline-hidden font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Once saved, the admin must use this new password to sign in to the Ops Hub.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                className="px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50"
              >
                {isResetting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
