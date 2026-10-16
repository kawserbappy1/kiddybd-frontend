"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { useAuthStore } from "@/stores/use-auth-store";

export function MobileNavigationBar() {
  const pathname = usePathname();
  const { getTotalCount: getCartCount, toggleCart } = useCartStore();
  const { getCount: getWishlistCount } = useWishlistStore();
  const { isAuthenticated, setAuthModalOpen } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl px-2 py-1.5 transition-colors"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            isActive("/") && pathname === "/"
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            isActive("/products") || isActive("/shop")
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Shop</span>
        </Link>

        {/* 3. Wishlist (badge) */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            isActive("/wishlist")
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Wishlist</span>
        </Link>

        {/* 4. Cart (badge, opens slide-over drawer) */}
        <button
          onClick={toggleCart}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-muted-foreground hover:text-foreground transition-colors focus:outline-hidden"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-primary tracking-tight">Cart</span>
        </button>

        {/* 5. My Profile */}
        {mounted && isAuthenticated ? (
          <Link
            href="/account/profile"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
              isActive("/account")
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Profile</span>
          </Link>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-muted-foreground hover:text-foreground transition-colors focus:outline-hidden"
            aria-label="Sign In"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
