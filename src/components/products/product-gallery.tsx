"use client";

import * as React from "react";
import Image from "next/image";
import { Play, ShieldCheck, Baby, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  ageLabel: string;
  hasVideo?: boolean;
  videoUrl?: string;
  discountPercent?: number;
}

function getEmbedVideoUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Handle YouTube standard and shortened links
  if (trimmed.includes("youtube.com/watch")) {
    const videoId = new URL(trimmed).searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (trimmed.includes("youtu.be/")) {
    const videoId = trimmed.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed.includes("?") ? `${trimmed}&autoplay=1` : `${trimmed}?autoplay=1`;
  }
  return trimmed;
}

export function ProductGallery({
  images,
  productName,
  ageLabel,
  hasVideo = false,
  videoUrl,
  discountPercent = 0,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomCoords, setZoomCoords] = React.useState({ x: 50, y: 50 });
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);

  const embedUrl = getEmbedVideoUrl(videoUrl);
  const canShowVideo = Boolean(hasVideo && embedUrl);

  const activeImage = images[activeIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-start select-none">
      {/* Vertical/Horizontal Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-w-full md:max-h-[540px] pb-2 md:pb-0 scrollbar-thin">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
              activeIndex === idx
                ? "border-primary shadow-md scale-102 ring-2 ring-primary/20"
                : "border-border/60 hover:border-primary/50 opacity-75 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}

        {canShowVideo && (
          <button
            type="button"
            onClick={() => setIsVideoOpen(true)}
            className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all flex flex-col items-center justify-center text-primary group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
            <span className="text-[10px] font-bold mt-1">Video</span>
          </button>
        )}
      </div>

      {/* Main Preview Container with Zoom on Hover */}
      <div className="relative flex-1 w-full aspect-square md:aspect-4/5 rounded-3xl overflow-hidden border border-border/70 bg-card/60 shadow-md">
        {/* Badges on Image */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-md">
              Save {discountPercent}%
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
            <Baby className="w-3.5 h-3.5" />
            {ageLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            Non-toxic & BPA Free
          </span>
        </div>

        {/* Video demo floating trigger */}
        {canShowVideo && (
          <button
            type="button"
            onClick={() => setIsVideoOpen(true)}
            className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 hover:bg-background text-foreground border border-border text-xs font-bold backdrop-blur-md shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-primary text-primary" />
            Demo Video
          </button>
        )}

        {/* Zoomable Image Container */}
        <div
          className="relative w-full h-full overflow-hidden cursor-crosshair"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={activeImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={`object-cover transition-transform duration-200 ease-out ${
              isZoomed ? "scale-175" : "scale-100"
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Zoom Hint Indicator */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm">
          <ZoomIn className="w-3.5 h-3.5" />
          Hover to zoom
        </div>

        {/* Navigation Arrow buttons for mobile or fast browsing */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Image"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 dark:bg-black/70 text-foreground hover:scale-110 flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Image"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 dark:bg-black/70 text-foreground hover:scale-110 flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Video Demonstration Modal */}
      {canShowVideo && embedUrl && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-3xl bg-black border-none">
            <DialogHeader className="p-4 bg-background text-foreground border-b border-border">
              <DialogTitle className="font-display text-base">
                Product Demonstration: {productName}
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title="Product Demonstration"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
