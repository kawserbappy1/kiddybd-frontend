"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { HeaderSearchBar } from "@/components/layout/header-search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ShoppingBag, User as UserIcon, LogOut, Package, Settings, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainHeader() {
  const { user, isAuthenticated, logout, setAuthModalOpen } = useAuthStore();
  const { getTotalCount: getCartCount, toggleCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand Logo matching KiddoJoy */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus:outline-hidden"
          aria-label="KiddyBD Home"
        >
          {/* Circular Brand Logo */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-xs border border-amber-200/50 dark:border-amber-500/20 bg-white">
            <Image
              src="/logo-bd.png"
              alt="KiddyBD Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div className="font-display font-black text-xl sm:text-2xl lg:text-[27px] tracking-tight leading-none text-[#0EA5E9]">
              Kiddy<span className="text-[#FF3E78]">BD</span>
            </div>
            <span className="hidden sm:inline text-[10px] font-semibold text-slate-400 tracking-tight font-display mt-0.5">
              Small Steps · Big Dreams
            </span>
          </div>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <HeaderSearchBar />
        </div>

        {/* Header Right Actions: Theme Toggle -> Account Sign In -> Cart */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          {/* Theme Selector (Light, Dark, System) placed right beside search bar & account */}
          <div className="flex items-center border-r border-slate-200 dark:border-slate-800 pr-1.5 sm:pr-4">
            <ThemeToggle />
          </div>

          {/* Account / Sign In */}
          {mounted && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity focus:outline-hidden cursor-pointer">
                <Avatar className="w-7 h-7 border border-slate-200">
                  <AvatarImage src={user.avatarUrl || ""} alt={user.name || "User"} />
                  <AvatarFallback className="bg-pink-100 text-[#FF3E78] font-bold text-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "KJ"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Account
                  </span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[80px]">
                    {user.name || "Hi, Parent"}
                  </span>
                </div>
                <ChevronDown className="hidden sm:block w-3 h-3 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5 text-xs">
                <DropdownMenuLabel className="font-bold">
                  {user.name || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/profile" className="flex items-center gap-2 cursor-pointer">
                    <UserIcon className="w-3.5 h-3.5" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders" className="flex items-center gap-2 cursor-pointer">
                    <Package className="w-3.5 h-3.5" /> Orders
                  </Link>
                </DropdownMenuItem>
                {user?.role && user.role !== "CUSTOMER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-amber-600 font-bold">
                      <Settings className="w-3.5 h-3.5" /> Ops & Admin Hub
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-500 focus:text-red-500 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-200 hover:text-[#FF3E78] transition-colors focus:outline-hidden text-left cursor-pointer"
              aria-label="Account Sign In"
            >
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-bold">Account</span>
                <span className="text-[11px] text-slate-500">Sign In</span>
              </div>
            </button>
          )}

          {/* Cart with count badge & label matching KiddoJoy */}
          <button
            onClick={toggleCart}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-200 hover:text-[#FF3E78] transition-colors focus:outline-hidden text-left cursor-pointer"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#FF3E78] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-bold">Cart</span>
              <span className="text-[11px] text-slate-500">{cartCount}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-3 pb-2.5">
        <HeaderSearchBar />
      </div>
    </header>
  );
}
