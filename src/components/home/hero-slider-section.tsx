"use client";

import { HeroBannerSlider } from "@/components/layout/hero-banner-slider";
import { VerticalCategoryMenu } from "@/components/layout/vertical-category-menu";

export function HeroSliderSection() {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4 pb-6">
      <div className="flex items-start gap-5">
        {/* Left (25% width / w-64): Category tree sidebar listing 10 departments with arrow icons */}
        <div className="hidden lg:block w-64 shrink-0">
          <VerticalCategoryMenu />
        </div>

        {/* Right (75% width): Large rounded playful hero banner carousel */}
        <div className="flex-1 min-w-0">
          <HeroBannerSlider />
        </div>
      </div>
    </section>
  );
}
