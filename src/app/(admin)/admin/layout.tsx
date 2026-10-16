"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AcmeAdminSidebar } from "@/components/admin/acme-admin-sidebar";
import { AcmeAdminNavbar } from "@/components/admin/acme-admin-navbar";
import { useAuthStore } from "@/stores/use-auth-store";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // If accessing /admin/login, bypass guard
    if (pathname === "/admin/login") {
      setIsReady(true);
      return;
    }

    // CRITICAL: Wait until Zustand has finished hydrating from localStorage
    if (!isHydrated) {
      return;
    }

    // RBAC validation
    const allowedRoles = [
      "SUPER_ADMIN",
      "ADMIN",
      "ORDER_MANAGER",
      "INVENTORY_MANAGER",
      "CUSTOMER_SUPPORT",
      "FINANCE_MANAGER",
    ];

    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
      router.replace("/admin/login");
      return;
    }

    setIsReady(true);
  }, [pathname, user, isAuthenticated, isHydrated, router]);

  // If on login route, render standalone clean login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-medium">Verifying Permissions...</p>
        </div>
        <div className="hidden" aria-hidden="true">
          <React.Suspense fallback={null}>{children}</React.Suspense>
        </div>
      </div>
    );
  }

  // Derive breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    if (pathname === "/admin") return [{ title: "Dashboard", href: "/admin" }];
    if (pathname?.startsWith("/admin/products")) return [{ title: "Products Catalog", href: "/admin/products" }];
    if (pathname?.startsWith("/admin/categories")) return [{ title: "Categories", href: "/admin/categories" }];
    if (pathname?.startsWith("/admin/brands")) return [{ title: "Brands", href: "/admin/brands" }];
    if (pathname?.startsWith("/admin/articles")) return [{ title: "Articles & Blog", href: "/admin/articles" }];
    if (pathname?.startsWith("/admin/coupons")) return [{ title: "Coupons & Discounts", href: "/admin/coupons" }];
    if (pathname?.startsWith("/admin/orders")) return [{ title: "Orders", href: "/admin/orders" }];
    if (pathname?.startsWith("/admin/inventory")) return [{ title: "Inventory & SKUs", href: "/admin/inventory" }];
    if (pathname?.startsWith("/admin/customers")) return [{ title: "Customers", href: "/admin/customers" }];
    if (pathname?.startsWith("/admin/returns")) return [{ title: "Returns & RTO", href: "/admin/returns" }];
    if (pathname?.startsWith("/admin/staff")) return [{ title: "Admin Management & Audit Logs", href: "/admin/staff" }];
    return [{ title: "Overview", href: "/admin" }];
  };

  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans flex antialiased">
      {/* Acme Inc. Inspired Sidebar */}
      <div className="print:hidden">
        <AcmeAdminSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 print:pl-0 print:m-0 print:p-0">
        {/* Top Header / Breadcrumb Bar */}
        <div className="print:hidden">
          <AcmeAdminNavbar
            onOpenMobile={() => setMobileMenuOpen(true)}
            breadcrumbs={getBreadcrumbs()}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0">
          <React.Suspense
            fallback={
              <div className="p-8 text-sm text-muted-foreground">Loading workspace module...</div>
            }
          >
            {children}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
