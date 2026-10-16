"use client";

import { motion } from "motion/react";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  PhoneCall,
} from "lucide-react";

const badges = [
  {
    icon: Truck,
    color: "text-[#0EA5E9]",
    bg: "bg-sky-50 dark:bg-sky-950/60",
    title: "Free Delivery",
    sub: "On orders over ৳1,500",
  },
  {
    icon: RotateCcw,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    title: "Easy 7-Day Returns",
    sub: "Hassle-free guarantee",
  },
  {
    icon: ShieldCheck,
    color: "text-[#0EA5E9]",
    bg: "bg-blue-50 dark:bg-blue-950/60",
    title: "100% Safe & Secure",
    sub: "Non-toxic certified toys",
  },
  {
    icon: Heart,
    color: "text-[#FF3E78]",
    bg: "bg-pink-50 dark:bg-pink-950/60",
    title: "Kids First",
    sub: "Curated by specialists",
    isHeart: true,
  },
  {
    icon: PhoneCall,
    color: "text-[#FFB703]",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    title: "24/7 Friendly Support",
    sub: "We're here for parents",
  },
];

export function TrustBadgesSection() {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-3">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs py-3.5 px-4 sm:px-6 transition-colors"
      >
        <div className="flex items-center justify-between gap-5 overflow-x-auto no-scrollbar text-xs">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${badge.bg} flex items-center justify-center ${badge.color} transition-transform`}
                >
                  <Icon
                    className={`w-5 h-5 ${badge.isHeart ? "fill-current" : ""}`}
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {badge.title}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {badge.sub}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
