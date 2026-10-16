import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ChevronRight, Home, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "প্রাইভেসি পলিসি | KiddyBD",
  description: "KiddyBD-এর গ্রাহক তথ্য সুরক্ষা এবং গোপনীয়তা নীতি।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            প্রাইভেসি পলিসি
          </span>
        </nav>

        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Lock className="w-3.5 h-3.5" /> User Data Protection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight mt-2">
            আমাদের গোপনীয়তা ও ডাটা সুরক্ষা নীতি
          </h1>
          <p className="font-bengali text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1">
            KiddyBD গ্রাহকদের ব্যক্তিগত তথ্যের সর্বোচ্চ নিরাপত্তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              ১. আমরা কী তথ্য সংগ্রহ করি?
            </h2>
            <p>
              অর্ডার প্রক্রিয়াকরণের জন্য আমরা গ্রাহকের নাম, ডেলিভারি ঠিকানা, মোবাইল নম্বর এবং ইমেইল সংগ্রহ করি। কোনো প্রকার পেমেন্ট কার্ড বা ব্যাংকিং পাসওয়ার্ড আমাদের ডাটাবেজে সংরক্ষণ করা হয় না।
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              ২. তথ্যের ব্যবহার
            </h2>
            <p>
              সংগৃহীত তথ্য কেবল আপনার ঠিকানায় পার্সেল পৌঁছে দেওয়া, অর্ডার ট্র্যাকিং এসএমএস পাঠানো এবং কাস্টমার সাপোর্ট প্রদানের উদ্দেশ্যে ব্যবহৃত হয়। আমরা কোনো তৃতীয় পক্ষের কাছে গ্রাহকের ডাটা বিক্রি বা প্রকাশ করি না।
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              ৩. কুকিজ ও সাইট সিকিউরিটি
            </h2>
            <p>
              ওয়েবসাইটের ব্রাউজিং অভিজ্ঞতা ও কার্ট মেমোরি ধরে রাখার সুবিধার্থে স্ট্যান্ডার্ড এনক্রিপ্টেড কুকি ব্যবহার করা হয়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
