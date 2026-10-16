"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      router.replace(`/products?q=${encodeURIComponent(q)}`);
    } else {
      router.replace("/products");
    }
  }, [router, searchParams]);

  return null;
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={null}>
      <SearchHandler />
    </React.Suspense>
  );
}
