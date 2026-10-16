"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: string;
  badge: {
    text: string;
    icon: string;
    style: string;
  };
  headlinePrefix: string;
  headlineHighlight: string;
  headlineColor: string;
  bengaliTagline: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  perkBadge: {
    text: string;
    sub: string;
    icon: string;
  };
  image: string;
  imageAlt: string;
  bgGradient: string;
  accentBlob: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "montessori-joy",
    badge: {
      text: "KiddyBD Exclusive • Certified Child-Safe",
      icon: "🧸",
      style: "bg-pink-100 text-[#FF3E78] dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    },
    headlinePrefix: "Where Fun Meets",
    headlineHighlight: "Creative Learning.",
    headlineColor: "text-[#FF3E78]",
    bengaliTagline: "খেলবে শিশু আনন্দে, মেধা বিকশিত হবে আপন ছন্দে।",
    description:
      "Handcrafted wooden rainbow arches, sensory sorting blocks & Montessori gear boards designed for healthy early childhood milestones.",
    primaryCta: {
      text: "Shop Collection",
      href: "/products?category=Toys%20%26%20Games",
    },
    secondaryCta: {
      text: "Montessori Toys",
      href: "/products?category=Montessori%20Sets",
    },
    perkBadge: {
      text: "Teddy Approved",
      sub: "100% Non-Toxic & Safe",
      icon: "🌟",
    },
    image: "/hero/hero-1-montessori.jpg",
    imageAlt: "KiddyBD Montessori Wooden Toys and Mascot Teddy",
    bgGradient:
      "from-[#FFF5F7] via-[#FFFBF2] to-[#F0F9FF] dark:from-slate-900 dark:via-slate-850 dark:to-slate-950",
    accentBlob: "bg-pink-400/15 dark:bg-pink-500/10",
  },
  {
    id: "stem-robotics",
    badge: {
      text: "Smart STEM & Robotics • Ages 3-10Y",
      icon: "🤖",
      style: "bg-sky-100 text-[#0EA5E9] dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    },
    headlinePrefix: "Smart Minds,",
    headlineHighlight: "Brighter Tomorrow.",
    headlineColor: "text-[#0EA5E9]",
    bengaliTagline: "কৌতূহলী শিশুর বুদ্ধিমত্তা ও মনোযোগ বিকাশে সেরা খেলনা।",
    description:
      "Interactive talking Robo-Buddies, geometric puzzle mazes and mechanical discovery sets that ignite STEM problem-solving early.",
    primaryCta: {
      text: "Explore STEM Toys",
      href: "/products?category=STEM%20%26%20Robotics",
    },
    secondaryCta: {
      text: "Brain Development",
      href: "/products?category=Brain%20developemnt",
    },
    perkBadge: {
      text: "Interactive Robot",
      sub: "Lights, Sounds & STEM Logic",
      icon: "⚡",
    },
    image: "/hero/hero-2-stem.jpg",
    imageAlt: "Robo-Buddy Interactive STEM Learning Robot Toy",
    bgGradient:
      "from-[#F0F9FF] via-[#F8FAFC] to-[#FEF3C7]/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950",
    accentBlob: "bg-sky-400/15 dark:bg-sky-500/10",
  },
  {
    id: "gear-adventures",
    badge: {
      text: "Flash Mega Deal • Dynamic 360° Lights",
      icon: "🏎️",
      style: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    headlinePrefix: "Gear Up For",
    headlineHighlight: "Endless Adventures!",
    headlineColor: "text-[#F59E0B]",
    bengaliTagline: "ঘুরবে কালারফুল গিয়ার, বাজবে প্রাণবন্ত মিউজিক ও আলো।",
    description:
      "Transparent mechanical action cars with spinning colorful gears, musical soundscapes, and obstacle-avoidance technology toddlers adore.",
    primaryCta: {
      text: "Grab Special Offer",
      href: "/products?deals=true",
    },
    secondaryCta: {
      text: "View All Products",
      href: "/products",
    },
    perkBadge: {
      text: "Super Speed Gear",
      sub: "360° Light & Melodies",
      icon: "🔥",
    },
    image: "/hero/hero-3-car.jpg",
    imageAlt: "Transparent Mechanical Gear Race Car Toy with Lights",
    bgGradient:
      "from-[#FFFBEB] via-[#FFF1F2]/60 to-[#F0FDF4]/50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950",
    accentBlob: "bg-amber-400/15 dark:bg-amber-500/10",
  },
];

export function HeroBannerSlider() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const slideDuration = 6000; // 6 seconds

  // Auto-advance slides with pause on hover
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/90 shadow-sm transition-all group"
    >
      {/* Active Slide Display */}
      <div
        key={slide.id}
        className={`w-full min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] bg-gradient-to-br ${slide.bgGradient} relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-colors`}
      >
        {/* Decorative Floating Accent Glows */}
        <div
          className={`absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${slide.accentBlob}`}
        />
        <div
          className={`absolute -bottom-16 -left-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${slide.accentBlob}`}
        />

        {/* Top Header Row inside Slider: Badge + Trust Guarantee Pill */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold font-display border shadow-2xs backdrop-blur-xs transition-all ${slide.badge.style}`}
          >
            <span>{slide.badge.icon}</span>
            <span>{slide.badge.text}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#0EA5E9]" /> Fast BD Delivery
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Non-Toxic Safe
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-[#FF3E78]" /> Easy Return
            </span>
          </div>
        </div>

        {/* Main Content Grid: Left Hero Copy + Right 3D Visual */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 shadow-xs backdrop-blur-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bengali text-sm sm:text-[15px] font-semibold text-slate-700 dark:text-slate-200 tracking-normal leading-normal">
                  {slide.bengaliTagline}
                </span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[44px] text-slate-900 dark:text-slate-50 leading-[1.12] tracking-tight">
                {slide.headlinePrefix}{" "}
                <span className={`${slide.headlineColor} underline decoration-wavy decoration-2 decoration-amber-400/40`}>
                  {slide.headlineHighlight}
                </span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
              {slide.description}
            </p>

            {/* Action Buttons & Rating proof */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <Button
                asChild
                className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-full px-7 py-3 h-auto font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 active:scale-95 transition-all group/btn"
              >
                <Link href={slide.primaryCta.href} className="inline-flex items-center gap-2">
                  <span>{slide.primaryCta.text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full px-5 py-3 h-auto text-xs sm:text-sm font-bold border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-xs text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
              >
                <Link href={slide.secondaryCta.href}>
                  {slide.secondaryCta.text}
                </Link>
              </Button>

              {/* Star Rating Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 pl-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>4.9/5 (2,400+ Parents)</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 dark:border-slate-800/90 bg-white dark:bg-slate-800 group-hover:scale-[1.02] transition-transform duration-500">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />

              {/* Designer Floating Sticker on Image */}
              <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-sm">
                  {slide.perkBadge.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-xs text-slate-900 dark:text-slate-100 leading-tight">
                    {slide.perkBadge.text}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold leading-tight">
                    {slide.perkBadge.sub}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Nav Row: Slide Indicators + Progress Bar */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          {/* Quick Slide Navigation Dots */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                type="button"
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-hidden ${
                  currentSlide === idx
                    ? "w-8 h-2.5 bg-[#0EA5E9] shadow-xs"
                    : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick Category Jump Tags */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold">
            <span className="text-slate-400">Popular:</span>
            <Link
              href="/products?category=Toys%20%26%20Games"
              className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-colors"
            >
              🧸 Toys
            </Link>
            <Link
              href="/products?category=Brain%20developemnt"
              className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-colors"
            >
              🧠 Brain
            </Link>
            <Link
              href="/products?category=STEM%20%26%20Robotics"
              className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-colors"
            >
              🤖 STEM
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Arrow Controls on hover */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))
        }
        type="button"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-lg border border-slate-200/60 dark:border-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer z-30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))
        }
        type="button"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-lg border border-slate-200/60 dark:border-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer z-30"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
