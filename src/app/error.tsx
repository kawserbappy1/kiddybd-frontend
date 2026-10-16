"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home, Sparkles, AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-5">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-100 dark:bg-rose-950/40 border-4 border-rose-300 dark:border-rose-700/50 flex items-center justify-center text-5xl shadow-inner">
          🧸
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
        Oops! Something slipped. Let&apos;s get you back to the toys.
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
        We encountered an unexpected bump while loading this page. Don&apos;t worry, your cart and saved favorites are safe!
      </p>

      {error.digest && (
        <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full mt-3">
          Error Ref: {error.digest}
        </span>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Button
          onClick={() => reset()}
          className="rounded-full px-6 h-11 font-bold text-xs gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>

        <Button
          asChild
          variant="outline"
          className="rounded-full px-6 h-11 font-bold text-xs gap-2"
        >
          <Link href="/">
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
