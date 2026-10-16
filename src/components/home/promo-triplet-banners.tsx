"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function PromoTripletBanners() {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Pink Box: Special Offers UP TO 50% OFF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <Link
            href="/products?deals=true"
            className="group rounded-3xl bg-[#FFE4E8] dark:bg-rose-950/40 p-6 flex items-center justify-between overflow-hidden relative border border-rose-200/50 dark:border-rose-900/40 shadow-xs hover:shadow-lg transition-all h-full"
          >
            <div className="space-y-1.5 z-10 max-w-[58%]">
              <span className="text-[11px] font-bold text-[#FF3E78] uppercase tracking-wider block">
                Special Offers
              </span>
              <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white leading-none">
                UP TO 50% OFF
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pb-2">
                Toys, Fashion &amp; More
              </p>
              <div className="inline-flex items-center gap-1.5 bg-[#FF3E78] group-hover:bg-[#e62e66] text-white text-xs font-bold px-4 py-2 rounded-full transition-transform active:scale-95 shadow-sm shadow-pink-500/20">
                <span>Shop Now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
            <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-white/80 dark:border-slate-800 shadow-md group-hover:scale-110 transition-transform duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&auto=format&fit=crop&q=80"
                alt="Special Offers Kid"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </motion.div>

        {/* 2. Sky Blue Box: Little Explorers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <Link
            href="/products?category=Outdoor%20%26%20Sports"
            className="group rounded-3xl bg-[#E0F2FE] dark:bg-sky-950/40 p-6 flex items-center justify-between overflow-hidden relative border border-sky-200/50 dark:border-sky-900/40 shadow-xs hover:shadow-lg transition-all h-full"
          >
            <div className="space-y-1.5 z-10 max-w-[58%]">
              <h3 className="text-xl font-black font-display text-[#0284C7] dark:text-sky-300 leading-tight">
                Little Explorers
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pb-2">
                Outdoor fun for growing adventurers
              </p>
              <div className="inline-flex items-center gap-1.5 bg-[#0284C7] group-hover:bg-[#0369a1] text-white text-xs font-bold px-4 py-2 rounded-full transition-transform active:scale-95 shadow-sm shadow-sky-500/20">
                <span>Shop Outdoor</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
            <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-white/80 dark:border-slate-800 shadow-md group-hover:scale-110 transition-transform duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&auto=format&fit=crop&q=80"
                alt="Outdoor Explorer"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </motion.div>

        {/* 3. Mint Green Box: Eco-Friendly Choices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <Link
            href="/products?eco=true"
            className="group rounded-3xl bg-[#DCFCE7] dark:bg-emerald-950/40 p-6 flex items-center justify-between overflow-hidden relative border border-emerald-200/50 dark:border-emerald-900/40 shadow-xs hover:shadow-lg transition-all h-full"
          >
            <div className="space-y-1.5 z-10 max-w-[58%]">
              <h3 className="text-xl font-black font-display text-[#15803D] dark:text-emerald-300 leading-tight">
                Eco-Friendly Choices
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pb-2">
                Sustainable toys for a greener tomorrow
              </p>
              <div className="inline-flex items-center gap-1.5 bg-[#15803D] group-hover:bg-[#166534] text-white text-xs font-bold px-4 py-2 rounded-full transition-transform active:scale-95 shadow-sm shadow-emerald-500/20">
                <span>Shop Green</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
            <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-white/80 dark:border-slate-800 shadow-md group-hover:scale-110 transition-transform duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&auto=format&fit=crop&q=80"
                alt="Eco-Friendly Toy"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
