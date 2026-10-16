import { redirect } from "next/navigation";

const SLUG_TO_CATEGORY: Record<string, string> = {
  "toys-games": "Toys & Games",
  "baby-essentials": "Baby Essentials",
  "kids-fashion": "Kids Fashion",
  "nursery-room": "Nursery & Room",
  "learning-books": "Learning & Books",
  "outdoor-sports": "Outdoor & Sports",
  "arts-crafts": "Arts & Crafts",
  "feeding-care": "Feeding & Care",
  "travel-safety": "Travel & Safety",
};

export function generateStaticParams() {
  return [
    { slug: "toys-games" },
    { slug: "baby-essentials" },
    { slug: "kids-fashion" },
    { slug: "nursery-room" },
    { slug: "learning-books" },
    { slug: "outdoor-sports" },
    { slug: "arts-crafts" },
    { slug: "feeding-care" },
    { slug: "travel-safety" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  let categoryName = SLUG_TO_CATEGORY[slug];

  if (!categoryName) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${backendUrl}/categories`, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        const found = data.data?.categories?.find((c: any) => c.slug === slug);
        if (found) {
          categoryName = found.name;
        }
      }
    } catch {}
  }

  if (!categoryName && slug) {
    categoryName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  if (categoryName) {
    redirect(`/products?category=${encodeURIComponent(categoryName)}`);
  }

  redirect("/products");
}
