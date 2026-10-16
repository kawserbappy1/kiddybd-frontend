"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function NewsletterCtaBanner() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Welcome to the KiddyBD Family! 🎉 Special 10% coupon sent.");
  };

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-linear-to-r from-purple-100 via-pink-100 to-amber-100 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-amber-950/50 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-purple-200/70 dark:border-purple-900/50 shadow-xs relative overflow-hidden"
      >
        {/* Playful Floating Doodles with animation */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 text-7xl select-none opacity-20 pointer-events-none"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute -bottom-4 -left-4 text-7xl select-none opacity-20 pointer-events-none"
        >
          🌟
        </motion.div>

        {/* Mascot & Text Column */}
        <div className="flex items-center gap-5 z-10">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 0 }}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-4xl sm:text-5xl select-none shrink-0 border border-slate-200/70 dark:border-slate-800 cursor-pointer"
          >
            🦁
          </motion.div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-[#FFB703]" />
              <span>Exclusive 10% OFF Welcome Coupon</span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
              Join the KiddyBD Family!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
              Get secret offers, age-wise parenting advice and newly launched smart toys in your inbox.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="w-full max-w-md z-10">
          {isSubscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-xs border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>You&apos;re subscribed! Check your inbox for the welcome code.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#FF3E78] transition-colors shadow-2xs"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="h-11 px-6 rounded-full bg-[#FF3E78] hover:bg-[#e62e66] text-white text-xs font-bold transition-all shadow-sm shadow-pink-500/20 shrink-0 cursor-pointer"
              >
                Get 10% Coupon
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
