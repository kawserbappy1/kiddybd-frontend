import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Baby,
  Sparkles,
  ChevronRight,
  Home,
} from "lucide-react";

export const metadata: Metadata = {
  title: "শিশুর নিরাপত্তা ও কোয়ালিটি মানদণ্ড | KiddyBD",
  description: "KiddyBD-এর প্রতিটি খেলনার নিরাপত্তা গ্যারান্টি, ল্যাব টেস্টিং এবং আন্তর্জাতিক কোয়ালিটি মানদণ্ড।",
};

export default function SafetyStandardsPage() {
  const SAFETY_POINTS = [
    {
      title: "মসৃণ গোলাকার কোণা (Rounded & Polished Edges)",
      desc: "প্রতিটি কাঠের খেলনা বিশেষ রোবোটিক ও হ্যান্ড পলিশিংয়ের মাধ্যমে সম্পূর্ণ মসৃণ করা হয়। এতে শিশুর নরম হাতে কোনো আঁচড় লাগার বা আঘাত পাওয়ার ঝুঁকি থাকে না।",
    },
    {
      title: "১০০% নন-টক্সিক ওয়াটার কালার (Non-Toxic Safe Paint)",
      desc: "বাচ্চাদের খেলনা মুখে দেওয়ার স্বভাব স্বাভাবিক। তাই আমাদের প্রতিটি রঙ ফুড-গ্রেড ওয়াটার-বেজড এবং ক্ষতিকর সীসা (Lead) ও টক্সিন সম্পূর্ণ মুক্ত।",
    },
    {
      title: "চক-হ্যাজার্ড প্রটেকশন (Choking Hazard Prevention)",
      desc: "৩ বছরের নিচের শিশুদের খেলনাগুলোর উপাদান আন্তর্জাতিক নিরাপত্তা প্রবিধান অনুযায়ী এমন সাইজে তৈরি করা হয় যাতে শিশু কোনো অংশ গিলে ফেলতে না পারে।",
    },
    {
      title: "মজবুত ও টেকসই গঠন (Drop & Pressure Tested)",
      desc: "শিশুর হাত থেকে বারবার মেঝেতে পড়লেও খেলনা সহজে ভেঙে টুকরো হয় না এবং কোনো বিপজ্জনক ভাঙা অংশ তৈরি করে না।",
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
            নিরাপত্তা মানদণ্ড
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-blue-600 via-sky-600 to-indigo-600 p-8 sm:p-12 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> Safety First Philosophy
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-bengali tracking-tight leading-tight">
              শিশুর সুরক্ষাই আমাদের সর্বোচ্চ প্রতিশ্রুতি
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
              একটি শিশুর হাতে একটি খেলনা তুলে দেওয়ার আগে আমরা সর্বোচ্চ সতর্কতা অবলম্বন করি। প্রতিটি খেলনাই কঠোর কোয়ালিটি পরীক্ষার মধ্য দিয়ে যায়।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-52 h-52 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Safety Certifications and Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAFETY_POINTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <h2 className="text-sm font-black font-bengali text-slate-900 dark:text-white">
                  {item.title}
                </h2>
              </div>
              <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quality Commitment Notice */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sky-600">
            <Award className="w-5 h-5" />
            <h3 className="font-bengali font-black text-base text-slate-900 dark:text-white">
              আন্তর্জাতিক কোয়ালিটি সার্টিফিকেশন ও স্ট্যান্ডার্ড
            </h3>
          </div>
          <p className="font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            KiddyBD-এর সরবরাহকৃত খেলনাসমূহ ইউরোপীয় (EN71) ও আমেরিকান (ASTM F963) শিশু খেলনা নিরাপত্তা নীতিমালার সাথে সংগতি রেখে তৈরি। আপনার সন্তানের হাসিমুখ ও নিরাপত্তার গ্যারান্টি আমরা প্রদান করি।
          </p>
        </div>
      </div>
    </div>
  );
}
