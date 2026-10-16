"use client";

import * as React from "react";
import Link from "next/link";
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

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
            যোগাযোগ
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-linear-to-r from-sky-500 via-[#0EA5E9] to-indigo-600 p-8 sm:p-12 text-white shadow-xl shadow-sky-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <PhoneCall className="w-3.5 h-3.5" /> We&apos;re Here to Help
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-bengali tracking-tight leading-tight">
              যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন
            </h1>
            <p className="font-bengali text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
              অর্ডার, পণ্য সংক্রান্ত তথ্য বা যেকোনো পরামর্শ জানাতে আমরা সর্বদা আপনার পাশে আছি।
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-52 h-52 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0EA5E9] flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
              ফোন হটলাইন
            </h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              +880 1700-000001
            </p>
            <p className="font-bengali text-[11px] text-slate-400">
              সকাল ৯টা থেকে রাত ১০টা পর্যন্ত
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
              হোয়াটসঅ্যাপ চ্যাট
            </h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              +880 1700-000001
            </p>
            <p className="font-bengali text-[11px] text-slate-400">
              দ্রুত রিপ্লাই ও ২৪/৭ সহায়তা
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-[#FF3E78] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bengali font-bold text-xs text-slate-900 dark:text-white">
              ইমেইল সাপোর্ট
            </h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              support@kiddybd.com
            </p>
            <p className="font-bengali text-[11px] text-slate-400">
              ১২ ঘণ্টার মধ্যে উত্তর প্রদান
            </p>
          </div>
        </div>

        {/* Message form & Office address */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Office Address (5 cols) */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bengali font-black text-base text-slate-900 dark:text-white">
              📍 আমাদের প্রধান কার্যালয়:
            </h3>

            <div className="space-y-4 font-bengali text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>হেড অফিস:</strong> হাউজ ১২, রোড ৪, ব্লক-সি, বনশ্রী, ঢাকা - ১২১৯, বাংলাদেশ।
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>ওয়্যারহাউস ও হাব:</strong> মিরপুর-১০, ঢাকা। (শনিবার - বৃহস্পতিবার: সকাল ৯টা - সন্ধ্যা ৭টা)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="https://wa.me/8801700000001"
                target="_blank"
                className="w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all font-bengali"
              >
                <MessageCircle className="w-4 h-4" />
                <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
              </Link>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bengali font-black text-base text-slate-900 dark:text-white">
              ✉️ সরাসরি বার্তা পাঠান:
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bengali font-bold text-sm text-emerald-800 dark:text-emerald-200">
                  আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!
                </h4>
                <p className="font-bengali text-xs text-emerald-700 dark:text-emerald-300">
                  আমাদের প্রতিনিধি অতি শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 font-bengali"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      আপনার নাম
                    </label>
                    <Input
                      required
                      placeholder="পুরো নাম লিখুন"
                      className="h-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      মোবাইল নম্বর
                    </label>
                    <Input
                      required
                      placeholder="017XXXXXXXX"
                      className="h-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    বিষয়
                  </label>
                  <Input
                    placeholder="যেমন: অর্ডার সম্পর্কিত তথ্য বা পরামর্শ"
                    className="h-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    বার্তা বা মতামত
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                    className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="rounded-full px-6 h-10 font-bold text-xs bg-[#0EA5E9] hover:bg-[#0284c7] gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  বার্তা পাঠান
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
