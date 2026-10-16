import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fredoka, Hind_Siliguri } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Toaster } from "sonner";
import { DynamicFavicon } from "@/components/dynamic-favicon";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-bengali",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL("https://kiddybd.com"),
  title: {
    default: "KiddyBD — Smart Toys, Better Learning, Happier Kids",
    template: "%s | KiddyBD",
  },
  description:
    "Bangladesh's leading child-development & educational toys ecommerce platform. Age-matched, certified non-toxic, and curated with care.",
  keywords: [
    "educational toys bangladesh",
    "montessori toys dhaka",
    "stem kits for kids",
    "baby gear bangladesh",
    "safe non-toxic toys",
    "kiddybd",
  ],
  authors: [{ name: "KiddyBD Team" }],
  creator: "KiddyBD",
  publisher: "KiddyBD",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://kiddybd.com",
    siteName: "KiddyBD",
    title: "KiddyBD — Smart Toys, Better Learning, Happier Kids",
    description:
      "Play, Learn, Grow — Certified non-toxic toys, Montessori learning kits, and baby essentials delivered nationwide across Bangladesh.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "KiddyBD - Happy Kids, Happier Days",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KiddyBD — Smart Toys, Better Learning, Happier Kids",
    description:
      "Certified child-development toys delivered nationwide with Cash on Delivery and 7 Days Easy Returns.",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&auto=format&fit=crop&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${fredoka.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-background text-foreground"
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <StorefrontShell>{children}</StorefrontShell>
            <DynamicFavicon />
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                className: "rounded-2xl shadow-lg border border-border font-sans",
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
