import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Target,
  Smile,
  Users,
  ChevronRight,
  Home,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "আমাদের গল্প ও পরিচিতি | KiddyBD",
  description: "KiddyBD-এর যাত্রা, ভিশন এবং বাংলাদেশের শিশুদের নিরাপদ ও বুদ্ধিদীপ্ত শৈশব গড়ায় আমাদের অঙ্গীকার।",
};

export default function AboutUsPage() {
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
            আমাদের গল্প
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-rose-500 via-[#FF3E78] to-amber-500 p-8 sm:p-12 text-white shadow-xl shadow-pink-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 fill-current" /> Our Story &amp; Mission
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-bengali tracking-tight leading-tight">
              স্মার্ট শৈশব ও উজ্জ্বল ভবিষ্যতের বিশ্বস্ত সঙ্গী
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-pink-50 leading-relaxed font-medium">
              আমরা বিশ্বাস করি, প্রতিটি শিশুই অসীম সম্ভাবনার অধিকারী। স্ক্রিন টাইম কমিয়ে আনন্দদায়ক স্পর্শভিত্তিক খেলার মাধ্যমে মেধার পূর্ণ বিকাশ ঘটানোই KiddyBD-এর মূল লক্ষ্য।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-52 h-52 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-[#FF3E78] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-base font-black font-bengali text-slate-900 dark:text-white">
              আমাদের মিশন (Our Mission)
            </h2>
            <p className="font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              বাংলাদেশের প্রতিটি অভিভাবকের কাছে নিরাপদ, বৈজ্ঞানিক ও বয়সোপযোগী মন্টেসরি ও শিক্ষণীয় খেলনা সুলভ মূল্যে পৌঁছে দেওয়া, যা শিশুর যৌক্তিক চিন্তা ও সৃজনশীলতা বৃদ্ধি করে।
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-[#0EA5E9] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-black font-bengali text-slate-900 dark:text-white">
              আমাদের ভিশন (Our Vision)
            </h2>
            <p className="font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              একটি সুস্থ, আত্মবিশ্বাসী ও উদ্ভাবনী ভবিষ্যৎ প্রজন্ম গড়ে তোলা—যেখানে শিশুরা প্রযুক্তির আসক্তি কাটিয়ে বাস্তব জগতের খেলায় আনন্দ খুঁজে পাবে।
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black font-bengali text-slate-900 dark:text-white">
            ✨ কেন অভিভাবকরা KiddyBD-কে বিশ্বাস করেন?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                ১
              </div>
              <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                ১০০% নন-টক্সিক ও নিরাপদ
              </h3>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                শিশুদের মুখে দেওয়া বা স্পর্শ করার উপযোগী BPA-free ও ল্যাব সার্টিফাইড উপাদান।
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-[#0EA5E9] flex items-center justify-center font-bold text-xs">
                ২
              </div>
              <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                বিশেষজ্ঞদের অনুমোদিত
              </h3>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                চাইল্ড সাইকোলজিস্ট ও আর্লি চাইল্ডহুড শিক্ষকদের সাথে পরামর্শক্রমে নির্বাচিত খেলনা।
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-[#FF3E78] flex items-center justify-center font-bold text-xs">
                ৩
              </div>
              <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
                সহজ রিটার্ন পলিসি
              </h3>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                পণ্য পছন্দ না হলে বা কোনো ত্রুটি থাকলে ৭ দিনের মধ্যে দ্রুত সমাধান।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
