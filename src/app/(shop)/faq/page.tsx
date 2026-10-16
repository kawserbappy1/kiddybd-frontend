"use client";

import * as React from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Home,
  MessageCircle,
  PhoneCall,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const FAQS = [
    {
      category: "অর্ডার ও পেমেন্ট",
      q: "KiddyBD থেকে অর্ডার করার নিয়ম কী?",
      a: "পছন্দের পণ্য সিলেক্ট করে 'Add to Cart' বা 'Buy Now' বাটনে ক্লিক করুন। এরপর আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করে খুব সহজেই ক্যাশ অন ডেলিভারি বা বিকাশে অর্ডার সম্পূর্ণ করতে পারবেন।",
    },
    {
      category: "ডেলিভারি",
      q: "ঢাকা এবং ঢাকার বাইরে ডেলিভারি পেতে কত সময় লাগে?",
      a: "ঢাকা সিটির ভেতরে অর্ডার কনফার্মের ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। ঢাকার বাইরে ও জেলা পর্যায়ে Steadfast Courier-এর মাধ্যমে ২ থেকে ৩ কার্যদিবসের মধ্যে হোম ডেলিভারি পৌঁছে দেওয়া হয়।",
    },
    {
      category: "ডেলিভারি",
      q: "ডেলিভারি চার্জ কত?",
      a: "ঢাকা সিটিতে ডেলিভারি চার্জ মাত্র ৳৭০ এবং ঢাকার বাইরে ৳১৩০। তবে আপনার মোট কার্ট ভ্যালু ৳১,৫০০ বা তার বেশি হলে ডেলিভারি সম্পূর্ণ ফ্রি!",
    },
    {
      category: "পেমেন্ট",
      q: "আমি কি ক্যাশ অন ডেলিভারিতে (COD) পেমেন্ট করতে পারব?",
      a: "হ্যাঁ, সারা বাংলাদেশে কোনো প্রকার অগ্রিম টাকা ছাড়াই ক্যাশ অন ডেলিভারিতে অর্ডার করার সুবিধা রয়েছে। পণ্য হাতে পেয়ে ডেলিভারিম্যানকে টাকা বুঝিয়ে দিন।",
    },
    {
      category: "নিরাপত্তা ও কোয়ালিটি",
      q: "KiddyBD-এর খেলনাগুলো কি শিশুদের স্বাস্থ্যের জন্য নিরাপদ?",
      a: "আমাদের প্রতিটি খেলনা BPA-free, মসৃণ কাটিং ফিনিশিং এবং শিশুদের জন্য শতভাগ নিরাপদ ফুড-গ্রেড ন্যাচারাল মেটেরিয়াল দিয়ে তৈরি। কোনো প্রকার ক্ষতিকর রাসায়নিক বা ধারালো উপাদান থাকে না।",
    },
    {
      category: "রিটার্ন ও রিফান্ড",
      q: "পণ্য ভাঙা বা ত্রুটিপূর্ণ পেলে কীভাবে পরিবর্তন বা রিটার্ন করব?",
      a: "ডেলিভারি পাওয়ার পর পণ্যে কোনো সমস্যা থাকলে আনবক্সিং ছবি বা ভিডিওসহ আমাদের হটলাইনে বা হোয়াটসঅ্যাপে (+880 1700-000001) জানান। আমরা ৭ কার্যদিবসের মধ্যে সম্পূর্ণ ফ্রিতে রিপ্লেসমেন্ট প্রদান করব।",
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
            সাধারণ প্রশ্নোত্তর (FAQ)
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-sky-500 via-indigo-600 to-rose-500 p-8 sm:p-10 text-white shadow-xl shadow-sky-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
              অর্ডার, পেমেন্ট, ডেলিভারি ও প্রোডাক্ট সংক্রান্ত সাধারণ প্রশ্নের উত্তর এক নজরে দেখে নিন।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/70 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bengali font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-[#0EA5E9] font-black text-xs flex items-center justify-center shrink-0">
                      ?
                    </span>
                    <span>{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bengali leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-sky-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bengali font-black text-sm text-slate-900 dark:text-white">
              আপনার প্রশ্নের উত্তর খুঁজে পাননি?
            </h4>
            <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              আমাদের কাস্টমার কেয়ার টিম আপনাকে সহযোগিতা করতে ২৪/৭ প্রস্তুত রয়েছে।
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://wa.me/8801700000001"
              target="_blank"
              className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
