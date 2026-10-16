import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Briefcase,
  Users,
  Sparkles,
  Rocket,
  Mail,
  ChevronRight,
  Home,
  CheckCircle2,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ক্যারিয়ার ও সুযোগ | KiddyBD",
  description: "KiddyBD-এর সাথে ভবিষ্যৎ প্রজন্ম গড়ার টিমে যোগ দিন। বর্তমান চাকরির সুযোগ ও আবেদন পদ্ধতি।",
};

export default function CareersPage() {
  const OPEN_ROLES = [
    {
      title: "কাস্টমার সাপোর্ট ও এক্সপেরিয়েন্স এক্সিকিউটিভ",
      type: "ফুল-টাইম (Full-Time)",
      location: "ঢাকা, বাংলাদেশ",
      desc: "অভিভাবকদের সাথে আন্তরিক যোগাযোগ, অর্ডার কনফার্মেশন ও বিক্রয়োত্তর সেবা নিশ্চিত করা।",
    },
    {
      title: "চাইল্ডহুড প্রোডাক্ট কিউরেটর ও কনটেন্ট ক্রিয়েটর",
      type: "ফুল-টাইম / পার্ট-টাইম",
      location: "ঢাকা, বাংলাদেশ (হাইব্রিড)",
      desc: "নতুন খেলনার ডেভেলপমেন্টাল ভ্যালু রিভিউ করা, প্যারেন্টিং ব্লগ লেখা ও সোশ্যাল মিডিয়া কনটেন্ট তৈরি।",
    },
    {
      title: "লজিস্টিকস ও ইনভেন্টরি কো-অর্ডিনেটর",
      type: "ফুল-টাইম",
      location: "মিরপুর, ঢাকা",
      desc: "ওয়্যারহাউস ম্যানেজমেন্ট, নির্ভুল প্যাকেজিং এবং কুরিয়ার হ্যান্ডওভার তদারকি।",
    },
  ];

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
            ক্যারিয়ার
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-amber-500 via-rose-500 to-indigo-600 p-8 sm:p-12 text-white shadow-xl shadow-rose-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Briefcase className="w-3.5 h-3.5" /> Work With Us
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-bengali tracking-tight leading-tight">
              শিশুদের হাসিমুখের পেছনে কাজ করতে চান?
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-pink-50 leading-relaxed font-medium">
              KiddyBD-তে আমরা এমন একদল উদ্যমী তরুণ-তরুণী কাজ করি যারা শিশুদের সুস্থ বিকাশ ও পারিবারিক আনন্দ নিয়ে কাজ করতে ভালোবাসে।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-52 h-52 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Culture highlights */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-black font-bengali text-slate-900 dark:text-white">
            💼 আমাদের টিমের কর্মপরিবেশ:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                সৃজনশীল স্বাধীনতা
              </h3>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                নতুন আইডিয়া বাস্তবায়ন ও ক্যারিয়ারে দ্রুত বৃদ্ধির পূর্ণ সুযোগ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                পারিবারিক সংস্কৃতি
              </h3>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                আন্তরিক টিম মেম্বার, সহযোগিতাপূর্ণ পরিবেশ ও কাজের স্বাধীনতা।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
              <Rocket className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                আকর্ষণীয় সুযোগ-সুবিধা
              </h3>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                প্রতিযোগিতামূলক বেতন, বাৎসরিক বোনাস ও পারফরম্যান্স ইনসেন্টিভ।
              </p>
            </div>
          </div>
        </div>

        {/* Open roles list */}
        <div className="space-y-4">
          <h2 className="text-base font-black font-bengali text-slate-900 dark:text-white">
            📢 বর্তমান চাকরির সুযোগসমূহ (Open Positions):
          </h2>

          <div className="space-y-3">
            {OPEN_ROLES.map((role, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-bengali font-bold text-sm text-slate-900 dark:text-white">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {role.type}
                    </span>
                    <span>•</span>
                    <span>{role.location}</span>
                  </div>
                  <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 pt-1">
                    {role.desc}
                  </p>
                </div>

                <a
                  href="mailto:careers@kiddybd.com?subject=Job Application"
                  className="px-5 py-2.5 rounded-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs font-bold shrink-0 shadow-sm transition-all font-bengali inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  আবেদন করুন
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-sky-100 dark:border-slate-700 text-center space-y-2">
          <h3 className="font-bengali font-bold text-sm text-slate-900 dark:text-white">
            আপনার পছন্দের পদ না থাকলে সরাসরি সিভি পাঠান
          </h3>
          <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            আপনার জীবনবৃত্তান্ত (CV) ইমেইল করুন <strong className="text-primary">careers@kiddybd.com</strong> ঠিকানায়। যোগ্য পদের সুযোগ আসলে আমরা আপনার সাথে যোগাযোগ করব।
          </p>
        </div>
      </div>
    </div>
  );
}
