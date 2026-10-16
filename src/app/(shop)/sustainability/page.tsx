import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Leaf,
  Recycle,
  TreePine,
  ShieldCheck,
  ChevronRight,
  Home,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "পরিবেশবান্ধব ও টেকসই অঙ্গীকার | KiddyBD",
  description: "KiddyBD-এর পরিবেশবান্ধব, নন-টক্সিক এবং টেকসই খেলনা তৈরির অঙ্গীকার সম্পর্কে জানুন।",
};

export default function SustainabilityPage() {
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
            সাসটেইনেবিলিটি
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-green-500 p-8 sm:p-12 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Leaf className="w-3.5 h-3.5" /> Eco-Friendly Commitment
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-bengali tracking-tight leading-tight">
              শিশুদের সুস্থ সুন্দর আগামী ও সবুজ পৃথিবী
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
              আমরা শুধু খেলনা বিক্রি করি না, আমাদের উদ্দেশ্য ভবিষ্যৎ প্রজন্মের জন্য একটি বাসযোগ্য, দূষণমুক্ত ও সবুজ পৃথিবী নিশ্চিত করা।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-52 h-52 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Pillars of sustainability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-black font-bengali text-slate-900 dark:text-white">
              প্রাকৃতিক ও টেকসই কাঠ
            </h2>
            <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              আমাদের উডেন খেলনাগুলো দায়িত্বশীল বনজ কাঠ থেকে সংগৃহীত। প্লাস্টিকের বদলে প্রাকৃতিক উপাদানে শিশুরা স্পর্শের মাধ্যমে প্রকৃতির সান্নিধ্য পায়।
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0EA5E9] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-black font-bengali text-slate-900 dark:text-white">
              ক্ষতিকর রাসায়নিক মুক্ত
            </h2>
            <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              রং হিসেবে ব্যবহৃত হয় ফুড-গ্রেড ওয়াটার বেজড পিগমেন্ট। কোনো ক্ষতিকর সীসা (Lead), ফরমালডিহাইড বা প্লাস্টিকাইজারের ব্যবহার নেই।
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-black font-bengali text-slate-900 dark:text-white">
              পুনর্ব্যবহারযোগ্য প্যাকেজিং
            </h2>
            <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              একবার ব্যবহারযোগ্য প্লাস্টিক কমিয়ে আমরা ক্রাফ্ট পেপার বক্স এবং পুনর্ব্যবহারযোগ্য প্যাকেজিং ম্যাটেরিয়াল ব্যবহার করি।
            </p>
          </div>
        </div>

        {/* Longevity philosophy */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-black font-bengali text-slate-900 dark:text-white">
            🌱 &quot;এক খেলনা, বহু শৈশব&quot; – আমাদের স্থায়িত্বের দর্শন
          </h2>
          <p className="font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            সাধারণ সস্তা খেলনা ২-৩ দিনেই ভেঙে যায় এবং পরিবেশে বর্জ্য তৈরি করে। কিন্তু KiddyBD-এর মন্টেসরি ও কাঠের খেলনাগুলো অত্যন্ত মজবুত ও টেকসই। এক শিশুর ব্যবহারের পর তা সহজেই পরবর্তী ভাইবোন বা অন্য শিশুকে উপহার দেওয়া যায়।
          </p>
        </div>
      </div>
    </div>
  );
}
