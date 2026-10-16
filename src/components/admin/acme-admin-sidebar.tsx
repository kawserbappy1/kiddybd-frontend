"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  RotateCcw,
  Users,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronsUpDown,
  LogOut,
  Building2,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus,
  FolderTree,
  Award,
  BookOpen,
  Ticket,
  Shield,
  KeyRound,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useAdminNotificationStore } from "@/stores/use-admin-notification-store";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles?: string[];
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    // Accessible to all admin staff
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"],
  },
  {
    title: "Products Catalog",
    href: "/admin/products",
    icon: Package,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "CONTENT_MANAGER"],
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "CONTENT_MANAGER"],
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: Award,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "CONTENT_MANAGER"],
  },
  {
    title: "Articles & Blog",
    href: "/admin/articles",
    icon: BookOpen,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  },
  {
    title: "Coupons & Discounts",
    href: "/admin/coupons",
    icon: Ticket,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "FINANCE_MANAGER"],
  },
  {
    title: "Inventory & SKUs",
    href: "/admin/inventory",
    icon: LayoutDashboard,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
  },
  {
    title: "Returns & RTO",
    href: "/admin/returns",
    icon: RotateCcw,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER", "CUSTOMER_SUPPORT"],
  },
  {
    title: "Admin Management",
    href: "/admin/staff",
    icon: KeyRound,
    allowedRoles: ["SUPER_ADMIN"],
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/admin#settings",
    icon: Settings,
  },
  {
    title: "Help & Docs",
    href: "/admin#help",
    icon: HelpCircle,
  },
];

interface AcmeAdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AcmeAdminSidebar({ mobileOpen = false, onCloseMobile }: AcmeAdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { metrics, fetchMetrics } = useAdminNotificationStore();

  React.useEffect(() => {
    fetchMetrics();
    const interval = setInterval(() => {
      fetchMetrics();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* KiddyBD Brand Header */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 group focus:outline-hidden"
            aria-label="KiddyBD Admin Dashboard"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-amber-200/50 dark:border-amber-500/20 bg-white shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/logo-bd.png"
                alt="KiddyBD Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-black text-lg tracking-tight leading-none text-[#0EA5E9]">
                Kiddy<span className="text-[#FF3E78]">BD</span>
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-tight mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Platform
            </div>
            {mainNavItems
              .filter((item) => {
                if (!item.allowedRoles) return true;
                const role = user?.role || "ADMIN";
                return item.allowedRoles.includes(role);
              })
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
              const dynamicBadge =
                item.href === "/admin/orders"
                  ? (metrics.pendingOrdersCount > 0 ? String(metrics.pendingOrdersCount) : null)
                  : item.href === "/admin/returns"
                  ? (metrics.pendingReturnsCount > 0 ? String(metrics.pendingReturnsCount) : null)
                  : item.badge;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{item.title}</span>
                  </div>
                  {dynamicBadge && (
                    <span
                      className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-background text-foreground shadow-2xs"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                      }`}
                    >
                      {dynamicBadge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 space-y-1">
            <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Preferences
            </div>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onCloseMobile}
                  className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              target="_blank"
              className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                <span>Storefront</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            </Link>
          </div>
        </div>

        {/* User Account Footer (Acme Inc. NavUser Profile) */}
        <div className="border-t border-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left text-sm transition-colors hover:bg-accent/50 focus:outline-hidden">
                <Avatar className="h-8 w-8 rounded-lg border border-border">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col truncate leading-tight">
                  <span className="truncate font-semibold text-foreground">
                    {user?.name || "Shafiqur Rahman"}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {user?.email || "admin@kiddojoy.com"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="top">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user?.name || "Admin User"}</p>
                  <p className="text-xs leading-none text-muted-foreground font-mono">
                    {user?.role || "SUPER_ADMIN"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="gap-2 cursor-pointer"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" /> Dark Mode
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" target="_blank" className="gap-2 cursor-pointer">
                  <ExternalLink className="h-4 w-4" /> View Storefront
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
