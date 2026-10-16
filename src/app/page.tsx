import { HeroSliderSection } from "@/components/home/hero-slider-section";
import { TrustBadgesSection } from "@/components/home/trust-badges-section";
import { LiveHomeProductShelves } from "@/components/home/live-home-product-shelves";
import { PromoTripletBanners } from "@/components/home/promo-triplet-banners";
import { FamilyMomentsBlogGrid } from "@/components/home/family-moments-blog-grid";
import { NewsletterCtaBanner } from "@/components/home/newsletter-cta-banner";
import { TrustedBrandsCarousel } from "@/components/home/trusted-brands-carousel";

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-[#FAFAFA] dark:bg-slate-950 transition-colors">
      {/* 1. Hero Section: Category Sidebar (Left) + Big Rounded Carousel Banner (Right) */}
      <HeroSliderSection />

      {/* 2. Trust Badges Bar */}
      <TrustBadgesSection />

      {/* 3. Live Product Shelves (New Arrivals -> Best Sellers Marquee -> Special Offers Marquee -> Category Showcase -> Featured) */}
      <LiveHomeProductShelves />

      {/* 4. Triplet Promotional Feature Banners */}
      <PromoTripletBanners />

      {/* 5. Family Moments Parenting Blog Section */}
      <FamilyMomentsBlogGrid />

      {/* 6. Mascot Newsletter Banner */}
      <NewsletterCtaBanner />

      {/* 7. Trusted Brands Grid */}
      <TrustedBrandsCarousel />
    </div>
  );
}
