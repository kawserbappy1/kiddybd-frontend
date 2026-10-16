"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Copy, Check, PhoneCall } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { couponService, type BannerCoupon } from "@/services/coupon.service";
import { settingsService } from "@/services/settings.service";
import { toast } from "sonner";

export function TopAnnouncementBar() {
  const [currency, setCurrency] = useState("BDT ৳");
  const [bannerCoupon, setBannerCoupon] = useState<BannerCoupon | null>(null);
  const [contactPhone, setContactPhone] = useState("+880 1893-590140");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBanner() {
      const data = await couponService.getBannerCoupon();
      if (isMounted && data) {
        setBannerCoupon(data);
      }
    }
    loadBanner();

    settingsService.getSettings().then((res) => {
      if (isMounted && res.data?.contactPhone) {
        setContactPhone(res.data.contactPhone);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`কুপন কোড "${code}" কপি করা হয়েছে! 🎉`, {
        description: "চেকআউটে কুপন বক্সে ব্যবহার করে ছাড় উপভোগ করুন।",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside
      aria-label="Top Announcement"
      className="bg-[#FFB703] text-slate-900 text-xs py-1.5 px-3 sm:px-8 font-medium transition-colors border-b border-amber-400/40 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left/Center Text matching KiddoJoy & Live DB Coupon */}
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <span className="text-sm select-none shrink-0">🎁</span>
          <p className="truncate text-[11px] sm:text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <span className="truncate">Happy Kids, Happier Days!</span>{" "}
            <span className="hidden sm:inline font-normal text-slate-800 shrink-0">
              | Free shipping on orders over ৳1,500
            </span>
            {bannerCoupon ? (
              <span className="hidden sm:inline-flex items-center gap-1 font-normal text-slate-900 pl-1 border-l border-amber-600/40 shrink-0">
                <span>
                  {bannerCoupon.type === "PERCENTAGE"
                    ? `Extra ${bannerCoupon.value}% OFF code:`
                    : bannerCoupon.type === "FIXED"
                    ? `Flat ৳${bannerCoupon.value} OFF code:`
                    : "Free Delivery code:"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(bannerCoupon.code)}
                  title="Click to copy coupon code"
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 text-white font-black text-[11px] hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>{bannerCoupon.code}</span>
                  {copied ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-70" />
                  )}
                </button>
              </span>
            ) : (
              <span className="hidden sm:inline font-normal text-slate-800 shrink-0">
                | Extra 10% OFF code: <strong className="font-bold text-slate-950">KIDDY10</strong>
              </span>
            )}
          </p>
        </div>

        {/* Right Links & Selectors */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 text-slate-900 text-xs font-medium">
          {/* Customer Support Hotline */}
          <a
            href={`tel:${contactPhone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-1.5 font-bold hover:text-slate-950 transition-colors py-0.5 text-[11px] sm:text-xs"
            title="Call KiddyBD Helpline"
          >
            <PhoneCall className="w-3 h-3 text-slate-900" />
            <span className="font-semibold text-slate-950">{contactPhone}</span>
          </a>
          <span className="hidden sm:inline text-slate-700/60">|</span>

          <Link
            href="/track-order"
            className="hidden sm:inline hover:underline transition-all"
          >
            Track Order
          </Link>
          <span className="hidden sm:inline text-slate-700/60">|</span>
          <Link
            href="/faq"
            className="hidden sm:inline hover:underline transition-all"
          >
            Help
          </Link>
          <span className="hidden sm:inline text-slate-700/60">|</span>

          {/* Currency dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 font-semibold hover:opacity-80 focus:outline-hidden py-0.5">
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs min-w-[7rem]">
              <DropdownMenuItem
                className="cursor-pointer font-semibold"
                onClick={() => setCurrency("BDT ৳")}
              >
                BDT ৳
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer font-semibold"
                onClick={() => setCurrency("USD $")}
              >
                USD $
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
