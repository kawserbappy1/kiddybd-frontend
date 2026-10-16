"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { TopAnnouncementBar } from "@/components/layout/top-announcement-bar";
import { MainHeader } from "@/components/layout/main-header";
import { CategoryNavigationBar } from "@/components/layout/category-navigation-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { MainFooter } from "@/components/layout/main-footer";
import { MobileNavigationBar } from "@/components/layout/mobile-navigation-bar";
import { AuthModal } from "@/components/auth/auth-modal";

interface StorefrontShellProps {
  children: React.ReactNode;
}

function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen w-full flex-1">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden">
      <TopAnnouncementBar />
      <MainHeader />
      <Suspense fallback={null}>
        <CategoryNavigationBar />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">{children}</main>
      <MainFooter />
      <Suspense fallback={null}>
        <MobileNavigationBar />
      </Suspense>
      <CartDrawer />
      <AuthModal />
    </div>
  );
}

export function StorefrontShell({ children }: StorefrontShellProps) {
  return (
    <Suspense fallback={<main className="min-h-screen w-full flex-1">{children}</main>}>
      <StorefrontChrome>{children}</StorefrontChrome>
    </Suspense>
  );
}
