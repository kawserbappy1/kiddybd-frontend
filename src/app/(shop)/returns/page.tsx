"use client";

import * as React from "react";
import Link from "next/link";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  ChevronRight,
  Home,
  HelpCircle,
} from "lucide-react";

export default function ReturnsRefundsPage() {
  const [phones, setPhones] = React.useState({
    primary: "+880 1893-590140",
    secondary: "+880 1729-993873",
  });

  React.useEffect(() => {
    import("@/services/settings.service").then(({ settingsService }) => {
      settingsService.getSettings().then((res) => {
        if (res.data) {
          setPhones({
            primary: res.data.contactPhone || "+880 1893-590140",
            secondary: res.data.contactPhoneSecondary || "+880 1729-993873",
          });
        }
      });
    });
  }, []);
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
            রিটার্ন ও রিফান্ড
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 p-8 sm:p-10 text-white shadow-xl shadow-rose-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <RotateCcw className="w-3.5 h-3.5" /> 7-Day Hassle-Free Returns
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight">
              ৭ দিনের সহজ রিটার্ন ও রিফান্ড পলিসি
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-rose-50 leading-relaxed font-medium">
              আপনার সন্তুষ্টিই আমাদের প্রথম অগ্রাধিকার। পণ্য পাওয়ার পর কোনো সমস্যা হলে আমরা বিনা ঝামেলায় রিপ্লেসমেন্ট অথবা রিফান্ড নিশ্চিত করি।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* 1. Return eligibility */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#FF3E78]">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-lg font-black font-bengali text-slate-900 dark:text-white">
                কোন কোন ক্ষেত্রে পণ্য রিটার্ন বা পরিবর্তনযোগ্য?
              </h2>
            </div>
            <ul className="space-y-3 font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>ভাঙা বা ক্ষতিগ্রস্ত পণ্য:</strong> ডেলিভারির সময় পণ্য ক্ষতিগ্রস্ত থাকলে রাইডারের উপস্থিতিতে বা আনবক্সিং ভিডিওসহ জানালে সাথে সাথে পরিবর্তন করে দেওয়া হবে।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>ভুল পণ্য প্রাপ্তি:</strong> অর্ডারের সাথে প্রাপ্ত সাইজ, কালার বা মডেল অমিল হলে ফ্রিতে সঠিক পণ্য দেওয়া হবে।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>পার্টস মিসিং:</strong> কোনো খেলনা বা সেটের প্রয়োজনীয় পার্টস মিসিং থাকলে বিনামূল্যে তা সরবরাহ করা হবে।</span>
              </li>
            </ul>
          </div>

          {/* 2. Steps to return */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-black font-bengali text-slate-900 dark:text-white">
              🔄 কীভাবে রিটার্ন রিকোয়েস্ট করবেন? (৩টি সহজ ধাপ)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                <div className="w-7 h-7 rounded-full bg-[#FF3E78] text-white flex items-center justify-center font-bold text-xs">
                  ১
                </div>
                <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                  ছবি বা ভিডিও তুলুন
                </h3>
                <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  প্যাকেট খোলার ভিডিও বা সমস্যাযুক্ত অংশের স্পষ্ট ছবি তুলে রাখুন।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                <div className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-xs">
                  ২
                </div>
                <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                  সাপোর্টে জানান
                </h3>
                <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  আমাদের হটলাইন ({phones.primary}) বা হোয়াটসঅ্যাপে ({phones.secondary}) অর্ডার আইডিসহ মেসেজ দিন।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ৩
                </div>
                <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                  রিপ্লেসমেন্ট / রিফান্ড
                </h3>
                <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  আমাদের প্রতিনিধি ২-৩ কার্যদিবসের মধ্যে রিপ্লেসমেন্ট পৌঁছে দেবে।
                </p>
              </div>
            </div>
          </div>

          {/* 3. Refund Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="w-5 h-5" />
              <h2 className="text-lg font-black font-bengali text-slate-900 dark:text-white">
                টাকা ফেরত বা রিফান্ডের সময়সীমা
              </h2>
            </div>
            <p className="font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              অনলাইন পেমেন্ট বা বিকাশের ক্ষেত্রে পণ্যটি আমাদের ওয়্যারহাউসে ফেরত পৌঁছানোর ২৪ থেকে ৪৮ ঘণ্টার মধ্যে রিফান্ড সম্পূর্ণ করা হয়। ব্যাংকিং কার্ডের ক্ষেত্রে ব্যাংক অনুসারে ৩-৫ কার্যদিবস সময় লাগতে পারে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
