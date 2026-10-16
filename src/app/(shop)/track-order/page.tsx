"use client";

import * as React from "react";
import Link from "next/link";

import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Home,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackOrderPage() {
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
            অর্ডার ট্র্যাকিং
          </span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-linear-to-r from-[#0EA5E9] via-sky-600 to-indigo-600 p-8 sm:p-10 text-white shadow-xl shadow-sky-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Truck className="w-3.5 h-3.5" /> Live Parcel Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight">
              আপনার অর্ডারের বর্তমান অবস্থা জানুন
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
              অর্ডার কনফার্মেশনের সময় প্রাপ্ত Order ID (যেমন: KBD-1234) অথবা আপনার মোবাইল নম্বর দিয়ে পার্সেল ট্র্যাক করুন।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 font-bengali">
                  অর্ডার আইডি (Order ID)
                </label>
                <Input
                  placeholder="যেমন: KBD-10084"
                  className="h-11 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 font-bengali">
                  মোবাইল নম্বর (Phone Number)
                </label>
                <Input
                  placeholder="যেমন: 017XXXXXXXX"
                  className="h-11 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto h-11 px-8 rounded-full bg-[#0EA5E9] hover:bg-[#0284c7] font-bold text-sm shadow-md gap-2 cursor-pointer font-bengali"
            >
              <Search className="w-4 h-4" />
              ট্র্যাক করুন
            </Button>
          </form>

          {/* Delivery Process Timeline */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black font-bengali text-slate-900 dark:text-white mb-6">
              📦 ডেলিভারি প্রক্রিয়া ও ধাপসমূহ:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-xs">
                  ১
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">
                  অর্ডার প্লেসড
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali leading-relaxed">
                  অর্ডার নিশ্চিত হওয়ার পর কনফার্মেশন এসএমএস পাঠানো হয়।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-xs">
                  ২
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">
                  কোয়ালিটি চেক ও প্যাকিং
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali leading-relaxed">
                  নিখুঁত কোয়ালিটি টেস্টের পর বাবল র‍্যাপে নিরাপদ প্যাকেজিং করা হয়।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-xs">
                  ৩
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">
                  কুরিয়ারে হস্তান্তর
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali leading-relaxed">
                  Steadfast Courier সার্ভিসে আপনার পার্সেল হস্তান্তর করা হয়।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ৪
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">
                  সফল ডেলিভারি
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali leading-relaxed">
                  রাইডার আপনার ঠিকানায় সরাসরি পণ্য পৌঁছে দিয়ে ক্যাশ গ্রহণ করে।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Assistance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-[#FF3E78] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white font-bengali">
                জরুরি প্রয়োজনে কল করুন
              </h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                +880 1700-000001 (সকাল ৯টা - রাত ১০টা)
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white font-bengali">
                হোয়াটসঅ্যাপ সাপোর্ট
              </h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                +880 1700-000001 (২৪/৭ চ্যাট সাপোর্ট)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
