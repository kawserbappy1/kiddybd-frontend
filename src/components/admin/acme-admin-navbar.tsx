"use client";

import * as React from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { useAdminNotificationStore } from "@/stores/use-admin-notification-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingBag,
  RotateCcw,
  Check,
  ExternalLink,
  Truck,
  XCircle,
  AlertCircle,
  Inbox,
} from "lucide-react";

interface AcmeAdminNavbarProps {
  onOpenMobile?: () => void;
  breadcrumbs?: { title: string; href?: string }[];
}

function formatNotificationTime(isoString?: string) {
  if (!isoString) return "";
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function getNotificationBadge(type: string) {
  const upper = (type || "").toUpperCase();
  if (upper.includes("DELIVERED")) {
    return {
      Icon: CheckCircle2,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10 border-emerald-500/20",
      badgeText: "Delivered",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (upper.includes("SHIPPED") || upper.includes("DISPATCH")) {
    return {
      Icon: Truck,
      iconClass: "text-blue-500",
      bgClass: "bg-blue-500/10 border-blue-500/20",
      badgeText: "Shipped",
      badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    };
  }
  if (upper.includes("RETURN")) {
    return {
      Icon: RotateCcw,
      iconClass: "text-rose-500",
      bgClass: "bg-rose-500/10 border-rose-500/20",
      badgeText: "Return",
      badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    };
  }
  if (upper.includes("CANCEL")) {
    return {
      Icon: XCircle,
      iconClass: "text-rose-500",
      bgClass: "bg-rose-500/10 border-rose-500/20",
      badgeText: "Cancelled",
      badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    };
  }
  if (upper.includes("NEW_ORDER") || upper.includes("PENDING")) {
    return {
      Icon: ShoppingBag,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      badgeText: "Order",
      badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    Icon: Bell,
    iconClass: "text-primary",
    bgClass: "bg-primary/10 border-primary/20",
    badgeText: "Alert",
    badgeClass: "bg-primary/15 text-primary",
  };
}

export function AcmeAdminNavbar({
  onOpenMobile,
  breadcrumbs = [{ title: "Dashboard", href: "/admin" }],
}: AcmeAdminNavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const {
    metrics,
    hasUnreadNotifications,
    markAllAsRead,
    markItemAsRead,
    fetchMetrics,
  } = useAdminNotificationStore();

  const hasUnread = hasUnreadNotifications();
  const unreadItemsCount =
    metrics.notifications?.filter((n) => n.status === "UNREAD").length || 0;
  const totalNotifications =
    unreadItemsCount > 0
      ? unreadItemsCount
      : metrics.pendingOrdersCount + metrics.pendingReturnsCount;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobile}
          className="h-8 w-8 lg:hidden"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Shadcn-like Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm font-medium">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground font-medium">
            KiddyBD
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-foreground truncate max-w-[120px] sm:max-w-none"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {crumb.title}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search, Status, Notifications, Theme */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search orders, SKUs..."
            className="h-8 pl-8 text-xs bg-muted/40 border-border"
          />
        </div>

        {/* Live System Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Fulfillment Live</span>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Notifications</span>
                {totalNotifications > 0 && (
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                    {totalNotifications} new
                  </span>
                )}
              </div>
              {hasUnread && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer font-medium"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Quick summaries if pending orders/returns exist */}
            {(metrics.pendingOrdersCount > 0 || metrics.pendingReturnsCount > 0) && (
              <div className="p-2.5 bg-muted/30 grid grid-cols-2 gap-2 text-xs border-b">
                {metrics.pendingOrdersCount > 0 && (
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-md bg-background p-2 border hover:border-primary transition-colors shadow-xs"
                  >
                    <ShoppingBag className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {metrics.pendingOrdersCount} Pending
                      </p>
                      <p className="text-[10px] text-muted-foreground">Orders awaiting review</p>
                    </div>
                  </Link>
                )}
                {metrics.pendingReturnsCount > 0 && (
                  <Link
                    href="/admin/returns"
                    className="flex items-center gap-2 rounded-md bg-background p-2 border hover:border-primary transition-colors shadow-xs"
                  >
                    <RotateCcw className="h-4 w-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {metrics.pendingReturnsCount} Pending
                      </p>
                      <p className="text-[10px] text-muted-foreground">Return requests</p>
                    </div>
                  </Link>
                )}
              </div>
            )}

            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {metrics.notifications && metrics.notifications.length > 0 ? (
                metrics.notifications.slice(0, 15).map((n) => {
                  const isUnread = n.status === "UNREAD";
                  const badge = getNotificationBadge(n.type);
                  const Icon = badge.Icon;
                  const linkHref = n.metadata?.orderId
                    ? `/admin/orders/${n.metadata.orderId}`
                    : n.type.includes("RETURN")
                    ? "/admin/returns"
                    : "/admin/orders";

                  return (
                    <Link
                      key={n.id}
                      href={linkHref}
                      onClick={() => markItemAsRead(n.id)}
                      className={`flex items-start gap-3 p-3 text-xs transition-colors hover:bg-muted/60 relative ${
                        isUnread ? "bg-primary/5 dark:bg-primary/10" : ""
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${badge.bgClass} ${badge.iconClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <p
                            className={`truncate ${
                              isUnread
                                ? "font-bold text-foreground"
                                : "font-medium text-foreground/90"
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatNotificationTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground text-[11px] line-clamp-2">
                          {n.body}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                          <span
                            className={`inline-block rounded px-1.5 py-0.2 font-semibold ${badge.badgeClass}`}
                          >
                            {badge.badgeText}
                          </span>
                          {isUnread && (
                            <span className="inline-flex items-center gap-1 font-semibold text-rose-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : metrics.recentOrders.length > 0 ? (
                metrics.recentOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-start gap-3 p-3 text-xs hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-foreground truncate">
                          Order #{order.orderNumber}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          ৳{Number(order.total).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate">{order.customerName}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="inline-block rounded bg-muted px-1.5 py-0.5 font-medium">
                          {order.status}
                        </span>
                        <span>{formatNotificationTime(order.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-muted-foreground/40" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                    No active notifications or pending tasks
                  </p>
                </div>
              )}
            </div>

            <div className="border-t p-2 bg-muted/20 text-center flex items-center justify-between px-3">
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                Orders Dashboard
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="/admin/returns"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Returns
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </div>
    </header>
  );
}
