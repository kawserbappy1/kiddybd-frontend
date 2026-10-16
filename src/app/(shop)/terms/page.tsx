import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FileText, ChevronRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী | KiddyBD",
  description: "KiddyBD প্ল্যাটফর্ম ব্যবহারের শর্তাবলী ও নিয়মকানুন।",
};

export default function TermsOfServicePage() {
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
            শর্তাবলী
          </span>
        </nav>

        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <FileText className="w-3.5 h-3.5" /> Terms &amp; Conditions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-bengali tracking-tight mt-2">
            প্ল্যাটফর্ম ব্যবহারের নিয়ম ও শর্তাবলী
          </h1>
          <p className="font-bengali text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1">
            KiddyBD-তে কেনাকাটা করার আগে অনুগ্রহ করে আমাদের শর্তাবলী ভালোভাবে জেনে নিন।
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 font-bengali text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              ১. অর্ডার নিশ্চিতকরণ ও স্টক
            </h2>
            <p>
              অর্ডার সাবমিট করার পর আমাদের সিস্টেম থেকে স্বয়ংক্রিয় কনফার্মেশন পাঠানো হয়। অপ্রত্যাশিত কোনো কারণে পণ্যের স্টক শেষ হয়ে গেলে গ্রাহককে ফোন বা এসএমএস করে বিকল্প প্রস্তাব বা রিফান্ড প্রদান করা হবে।
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              ২. মূল্য নির্ধারণ ও ডিসকাউন্ট অফার
            </h2>
            <p>
              ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশি টাকায় (BDT ৳) ধার্যকৃত। যেকোনো প্রোমোশনাল অফার বা কুপন নির্ধারিত মেয়াদের মধ্যে ব্যবহারযোগ্য।
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              ৩. ডেলিভারি গ্রহণ ও চেক করা
            </h2>
            <p>
              ডেলিভারি রাইডারের উপস্থিতিতে পার্সেল খুলে সঠিকতা যাচাই করে পণ্য গ্রহণ করার অনুরোধ করা হচ্ছে। কোনো অনিচ্ছাকৃত ভুলের ক্ষেত্রে আমাদের রিটার্ন পলিসি অনুযায়ী সমাধান প্রদান করা হবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
