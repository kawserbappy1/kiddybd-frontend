import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Ruler,
  Baby,
  Smile,
  Brain,
  Sparkles,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "বয়স ও সাইজ নির্দেশিকা | KiddyBD",
  description: "শিশুর বয়স অনুযায়ী সঠিক খেলনা, মন্টেসরি কিট ও মাপ নির্বাচনের সহজ বাংলা গাইড।",
};

export default function SizeGuidePage() {
  const AGE_RANGES = [
    {
      range: "০ - ১২ মাস (নবজাতক ও ইনফ্যান্ট)",
      skills: "দৃষ্টিশক্তি, স্পর্শ অনুভূতি ও শ্রবণশক্তি বিকাশ",
      toys: "সফ্ট র্যাটল, হাই-কনট্রাস্ট কার্ড, সিলিকন টিদার, সেন্সরি বল ও নরম কাপড়ের বই।",
      safety: "মসৃণ টেক্সচার, বড় মাপের উপাদান যাতে গিলে ফেলার ঝুঁকি না থাকে।",
    },
    {
      range: "১ - ৩ বছর (টডলার)",
      skills: "হাতের গ্রিপ, মোটর স্কিল ও ব্যালেন্স তৈরি",
      toys: "উডেন শেপ সর্টার, কালার ম্যাচিং পেগবোর্ড, স্ট্যাকিং কাপ ও ছোট পুশ-পুল কার।",
      safety: "ফুড-গ্রেড ন্যাচারাল উড ও নন-টক্সিক ওয়াটার বেজড কালার।",
    },
    {
      range: "৩ - ৫ বছর (প্রি-স্কুলার)",
      skills: "সমস্যা সমাধান, কল্পনাশক্তি ও বর্ণমালা পরিচয়",
      toys: "মন্টেসরি ব্যালেন্সিং গেম, বড় পাজল, ম্যাগনেটিক ব্লক, প্লে-ডো ও ড্রয়িং কিট।",
      safety: "কোনো সূক্ষ্ম বা ধারালো প্রান্ত নেই, হালকা ও টেকসই।",
    },
    {
      range: "৫ - ৮ বছর (আর্লি লার্নার)",
      skills: "যৌক্তিক চিন্তা, গণিত, বিজ্ঞান ও দলগত মেলামেশা",
      toys: "বেসিক রোবোটিক্স কিট, সাইন্স ল্যাব সেট, কনস্ট্রাকশন ব্লক ও স্ট্র্যাটেজি বোর্ড গেম।",
      safety: "সহজ বাংলা ইউজার ম্যানুয়াল ও পরিবেশবান্ধব প্লাস্টিক।",
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
            বয়স ও সাইজ নির্দেশিকা
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-purple-500 via-indigo-600 to-sky-500 p-8 sm:p-10 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Brain className="w-3.5 h-3.5" /> Child Age &amp; Size Guide
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight">
              শিশুর বয়স অনুযায়ী সঠিক খেলনা ও সাইজ নির্বাচন
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
              সঠিক বয়সে সঠিক শিক্ষণীয় খেলনা শিশুর বুদ্ধিমত্তা, একাগ্রতা ও কল্পনাশক্তি কয়েকগুণ বাড়িয়ে তোলে।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Age-based Selection Table / Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-black font-bengali text-slate-900 dark:text-white">
            🎯 বয়স ভিত্তিক ডেভেলপমেন্টাল খেলনা গাইড:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGE_RANGES.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-bengali">
                  <Baby className="w-3.5 h-3.5" />
                  <span>{item.range}</span>
                </div>

                <div className="space-y-2 font-bengali text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-900 dark:text-white">বিকাশের ক্ষেত্র:</strong>{" "}
                    {item.skills}
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">উপযোগী খেলনা:</strong>{" "}
                    {item.toys}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ {item.safety}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clothing Size Reference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#FF3E78]" />
            <h3 className="font-bengali font-black text-base text-slate-900 dark:text-white">
              পোশাক ও পরিধেয় সাইজ নির্দেশিকা
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bengali text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">বয়স</th>
                  <th className="py-2.5 px-3">সাইজ ট্যাগ</th>
                  <th className="py-2.5 px-3">বুকের মাপ (ইঞ্চি)</th>
                  <th className="py-2.5 px-3">লম্বা (ইঞ্চি)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-bold">০-৬ মাস</td>
                  <td className="py-2.5 px-3">NB / 6M</td>
                  <td className="py-2.5 px-3">১৬&quot;</td>
                  <td className="py-2.5 px-3">১৪&quot;</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">৬-১২ মাস</td>
                  <td className="py-2.5 px-3">12M</td>
                  <td className="py-2.5 px-3">১৮&quot;</td>
                  <td className="py-2.5 px-3">১৬&quot;</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">১-২ বছর</td>
                  <td className="py-2.5 px-3">2T</td>
                  <td className="py-2.5 px-3">২০&quot;</td>
                  <td className="py-2.5 px-3">১৮&quot;</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">৩-৪ বছর</td>
                  <td className="py-2.5 px-3">4T</td>
                  <td className="py-2.5 px-3">২২&quot;</td>
                  <td className="py-2.5 px-3">২০&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
