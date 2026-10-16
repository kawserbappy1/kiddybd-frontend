"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Sparkles } from "lucide-react";
import { VerticalCategoryMenu } from "@/components/layout/vertical-category-menu";

interface CategoryNavProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  showAllCategoriesButton?: boolean;
}

// Essential horizontal links without duplicate category clutter, preventing horizontal overflow/scroll
const HORIZONTAL_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=rating_desc" },
  { label: "Special Offers", href: "/products?deals=true" },
];

export function CategoryNavigationBar({
  isMenuOpen = true,
  onToggleMenu,
  showAllCategoriesButton = true,
}: CategoryNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  React.useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hidden md:block w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 h-12">
        {/* Left: Cyan Pill "All Categories" Button */}
        <div ref={containerRef} className="relative w-64 shrink-0 self-end">
          {showAllCategoriesButton && (
            <button
              onClick={() => {
                if (onToggleMenu) {
                  onToggleMenu();
                } else {
                  setDropdownOpen((prev) => !prev);
                }
              }}
              type="button"
              className={`w-full h-11 px-4 ${
                !isHomePage && dropdownOpen ? "rounded-t-xl" : "rounded-t-xl"
              } bg-[#0EA5E9] hover:bg-[#0284c7] text-white flex items-center justify-between font-bold text-xs tracking-wide transition-colors focus:outline-hidden cursor-pointer shadow-xs`}
              aria-label="Toggle All Categories menu"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 stroke-[2.5]" />
                <span className="font-display text-[13px]">All Categories</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  (isHomePage ? isMenuOpen : dropdownOpen) ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {/* Floating Category Dropdown on non-home pages */}
          {!isHomePage && dropdownOpen && (
            <div className="absolute top-full left-0 w-64 z-50 shadow-2xl rounded-b-xl animate-in fade-in-0 slide-in-from-top-1 duration-150">
              <VerticalCategoryMenu onSelectCategory={() => setDropdownOpen(false)} />
            </div>
          )}
        </div>

        {/* Center: Clean Horizontal Navigation Links (No scrollbar, concise) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-start pl-2"
        >
          {HORIZONTAL_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href === "/products"
                ? pathname === "/products"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs lg:text-[13px] font-semibold transition-colors shrink-0 ${
                  active
                    ? "text-[#FF3E78] font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:text-[#0EA5E9]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Highlight Pill Button: "✨ Little Moments Blog" */}
        <div className="shrink-0">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] dark:bg-sky-950 dark:text-sky-300 text-xs font-bold font-display transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Little Moments Blog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
