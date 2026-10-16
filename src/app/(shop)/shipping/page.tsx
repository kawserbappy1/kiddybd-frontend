import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Truck,
  MapPin,
  Clock,
  Banknote,
  CheckCircle2,
  Package,
  ChevronRight,
  Home,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "শিপিং ও ডেলিভারি পলিসি | KiddyBD",
  description: "KiddyBD-এর ডেলিভারি চার্জ, সময়সীমা এবং দেশব্যাপী হোম ডেলিভারি পলিসি সম্পর্কে জানুন।",
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            শিপিং ও ডেলিভারি
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-500 via-teal-600 to-sky-600 p-8 sm:p-10 text-white shadow-xl shadow-teal-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Truck className="w-3.5 h-3.5" /> Fast Nationwide Delivery
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight">
              সারা বাংলাদেশে দ্রুত ও নিরাপদ হোম ডেলিভারি
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-teal-100 leading-relaxed font-medium">
              আপনার সোনামণির পছন্দের খেলনা সুরক্ষিত প্যাকেজিংয়ে নিরাপদে আপনার দরজায় পৌঁছে দেয় KiddyBD।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Shipping Rates Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inside Dhaka */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0EA5E9] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bengali font-bold text-base text-slate-900 dark:text-white">
                  ঢাকা সিটির ভেতরে ডেলিভারি
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inside Dhaka Metro</span>
              </div>
            </div>

            <div className="pt-2 space-y-3 font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span>ডেলিভারি চার্জ:</span>
                <strong className="text-slate-900 dark:text-white text-base">৳৭০</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span>ডেলিভারি সময়সীমা:</span>
                <strong className="text-slate-900 dark:text-white">২৪ থেকে ৪৮ ঘণ্টা</strong>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>পেমেন্ট মাধ্যম:</span>
                <span className="text-emerald-600 font-bold">ক্যাশ অন ডেলিভারি / বিকাশ</span>
              </div>
            </div>
          </div>

          {/* Outside Dhaka */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bengali font-bold text-base text-slate-900 dark:text-white">
                  ঢাকার বাইরে ও সমগ্র বাংলাদেশ
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">All Over Bangladesh (Steadfast)</span>
              </div>
            </div>

            <div className="pt-2 space-y-3 font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span>ডেলিভারি চার্জ:</span>
                <strong className="text-slate-900 dark:text-white text-base">৳১৩০</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span>ডেলিভারি সময়সীমা:</span>
                <strong className="text-slate-900 dark:text-white">২ থেকে ৩ কার্যদিবস</strong>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>হোম ডেলিভারি:</span>
                <span className="text-emerald-600 font-bold">সরাসরি ঘরের দরজায়</span>
              </div>
            </div>
          </div>
        </div>

        {/* Free Shipping Highlight Banner */}
        <div className="rounded-3xl bg-[#FEF3C7] dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-6 flex items-center gap-4">
          <div className="text-3xl shrink-0">🎁</div>
          <div className="space-y-1">
            <h4 className="font-bengali font-black text-sm text-amber-950 dark:text-amber-200">
              ১৫০০ টাকার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!
            </h4>
            <p className="font-bengali text-xs text-amber-900/80 dark:text-amber-300">
              আপনার কার্ট ভ্যালু ১৫০০ টাকা অতিক্রম করলেই চেকআউটে স্বয়ংক্রিয়ভাবে ফ্রি ডেলিভারি যুক্ত হবে।
            </p>
          </div>
        </div>

        {/* Packing & Security Points */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bengali font-black text-base text-slate-900 dark:text-white">
            🛡️ ডেলিভারি নেওয়ার সময় কিছু গুরুত্বপূর্ণ তথ্য:
          </h3>
          <ul className="space-y-3 font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>ডেলিভারি রাইডারের উপস্থিতিতে পার্সেল চেক করে গ্রহণ করুন।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>ক্যাশ অন ডেলিভারিতে কোনো প্রকার অগ্রিম পেমেন্ট ছাড়াই সারা বাংলাদেশে অর্ডার করা সম্ভব।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>ডেলিভারি স্ট্যাটাস ট্র্যাকিং এসএমএস-এর মাধ্যমে নিয়মিত আপডেট পাঠানো হয়।</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
