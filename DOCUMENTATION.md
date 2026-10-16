# 🎨 KiddyBD Frontend — Next.js 16 Kids E-Commerce Storefront & Admin Portal

> **Ultra-Fast, Accessible, and Responsive Storefront & Unified Management Suite Engineered for Bangladesh's Leading Children's Brand.**

---

## 📌 ১. ফ্রন্টএন্ড আর্কিটেকচার ও উদ্দেশ্য (Frontend Purpose & Vision)

**KiddyBD Frontend** তৈরি করা হয়েছে শিশুদের খেলনা, শিক্ষামূলক পণ্য (Montessori, STEM Toys), পোশাক ও শিশুযত্ন সামগ্রী ক্রয়ের জন্য বাংলাদেশের সবচেয়ে দ্রুতগতির, প্রিমিয়াম ও ইউজার-ফ্রেন্ডলি অনলাইন অভিজ্ঞতা প্রদান করতে।

এটি শুধুমাত্র একটি সাধারণ কাস্টমার শপ নয়—এর মধ্যে রয়েছে:
1. **হাইপার-রেস্পনসিভ স্টোরফ্রন্ট (Customer Storefront):** মোবাইল-ফার্স্ট ডিজাইন, শিশুদের উপযোগী দৃষ্টিনন্দন থিম, ডার্ক/লাইট মোড এবং নির্বিঘ্ন ৩-স্টেপ চেকআউট।
2. **এন্টারপ্রাইজ অ্যাডমিন পোর্টাল (Acme Inc. Inspired Admin Suite):** প্রোডাক্ট ইনভেন্টরি, ক্যাশ-অন-ডেলিভারি অর্ডার পাইপলাইন, সরাসরি কুরিয়ার বুকিং (Pathao, Steadfast, REDX), কুপন ও স্টাফ ম্যানেজমেন্ট।

---

## 🌟 ২. মূল বৈশিষ্ঠ্য ও অভিনবত্ব (Unique Frontend Capabilities)

| ফিচার | বিস্তারিত বিবরণ |
| :--- | :--- |
| **বাংলাদেশ ৬৪ জেলা ও ৪৯৫+ উপজেলা ড্রপডাউন** | বিভাগ সিলেক্ট করলেই স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট জেলা এবং জেলার অধীনে সকল থানা/উপজেলা লোড হয়। এছাড়া প্রত্যন্ত অঞ্চলের জন্য *Other / Outskirts* অপশন রয়েছে। |
| **লাইভ অর্ডার ট্র্যাকিং ও ইনস্ট্যান্ট ইনভয়েস** | কাস্টমার যেকোনো ডিভাইসে তার অর্ডার নম্বর দিয়ে রিয়েল-টাইমে কুরিয়ার ট্র্যাকিং কোড এবং ডেলিভারি স্ট্যাটাস দেখতে পারে এবং এক ক্লিকে প্রিন্ট উপযোগী ইনভয়েস ডাউনলোড করতে পারে। |
| **মাল্টিপল ইমেজ গ্যালারি ও ভিডিও প্লেয়ার** | প্রতিটি পণ্যে একাধিক হাই-রেজুলেশন ছবি জুম/থাম্বনেইল স্লাইডার এবং প্রোডাক্ট ডেমো ভিডিও দেখার সুবিধা। |
| **ইন্টেলিজেন্ট কার্ট ড্রয়ার ও ফ্রি শিপিং বার** | কার্টে পণ্য যোগ করলে ডাইনামিক ড্রয়ার খোলে এবং কত টাকার পণ্য যোগ করলে ফ্রি হোম ডেলিভারি পাওয়া যাবে তার লাইভ ক্যালকুলেশন বার দেখায়। |
| **মন্টেসরি ও স্কিল-ভিত্তিক ফিল্টারিং** | বয়স (Age Groups) এবং বিকাশমূলক দক্ষতা (Cognitive, Motor Skills, Language, STEM) অনুযায়ী নিখুঁত ফিল্টারিং। |
| **অ্যাকমে স্টাইল প্রিমিয়াম অ্যাডমিন ড্যাশবোর্ড** | সম্পূর্ণ ডার্ক/লাইট থিম সাপোর্টেড অ্যাডমিন ড্যাশবোর্ড, রিয়েলটাইম মেট্রিক্স, অডিট হিস্টোরি এবং ফ্রড/রিস্ক অ্যানালাইসিস ব্যাজ। |

---

## 🛠️ ৩. ব্যবহৃত টেকনোলজি ও লাইব্রেরি (Tech Stack & Tools)

- **Core Framework:** Next.js 16 (App Router with TurboPack)
- **Language:** TypeScript 5+
- **Styling & Design System:** Tailwind CSS v4, Vanilla CSS Design Tokens
- **Icons:** Lucide React
- **UI Components & Primitives:** Radix UI (Dialog, Popover, Dropdown, Tabs, Avatar, Slider, Tooltip)
- **Animation Engine:** Motion (Framer Motion) & Embla Carousel
- **State Management:** Zustand (Client Side Persist & Hydration Guard)
- **Server State & Data Fetching:** TanStack React Query v5 & Axios
- **Form & Validation:** React Hook Form, Zod Schema Resolver
- **Notifications:** Sonner Toast Engine
- **Theming:** next-themes (Seamless System/Light/Dark Mode toggle)

---

## 🔒 ৪. ফ্রন্টএন্ড সিকিউরিটি ও পারফরম্যান্স অপ্টিমাইজেশন (Security & UX Best Practices)

1. **Client Hook Suspense Isolation:**
   - রানটাইম URL হুক (`usePathname`) কে `<Suspense>` বাউন্ডারির ভেতরে রেখে প্রিরেন্ডারিং আনব্লকড রাখা হয়েছে, ফলে পেজ লোড টাইম অত্যন্ত দ্রুত।
2. **Hydration & State Sync:**
   - Zustand স্টোর লোকালস্টোরেজ থেকে হাইড্রেট হওয়া পর্যন্ত অ্যাডমিন গার্ড সুরক্ষিত থাকে, যার ফলে লগইন ছাড়া অ্যাডমিন প্যানেলে অনুপ্রবেশ অসম্ভব।
3. **Optimistic UI Updates:**
   - কুরিয়ার অ্যাসাইন এবং অর্ডার স্ট্যাটাস চেঞ্জে ইনস্ট্যান্ট ভিজ্যুয়াল ফিডব্যাক দেওয়া হয়।
4. **প্রিন্ট ফ্রেন্ডলি স্টাইলিং (Tailwind Print Modifiers):**
   - অ্যাডমিন অর্ডারের প্যাকিং স্লিপ প্রিন্ট করার সময় অপ্রয়োজনীয় সাইডবার ও হেডার স্বয়ংক্রিয়ভাবে হাইড হয়ে অফিসিয়াল ইনভয়েস প্রিন্ট আউট হয়।

---

## 📁 ৫. ফোল্ডার স্ট্রাকচার (Folder Architecture)

```
frontend/
├── public/                 # Static Assets, Logos & Placeholders
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (admin)/admin/  # Admin Management Modules (Orders, Products, Staff, Inventory)
│   │   ├── (shop)/         # Customer Storefront (Products, Cart, Checkout, Tracking)
│   │   ├── layout.tsx      # Root App Layout with Theme & Storefront Chrome
│   │   └── page.tsx        # Dynamic Home Page (Shelves, Marquees, Hero Banner)
│   ├── components/         # Reusable Modular UI Components
│   │   ├── admin/          # Admin Sidebar, Navbar & Header Components
│   │   ├── checkout/       # Address Selector, Payment Methods
│   │   ├── home/           # Product Shelves, Category Grids
│   │   ├── layout/         # Header, Footer, Cart Drawer, Mobile Navigation
│   │   ├── orders/         # Live Tracking Client, Invoice Generator
│   │   └── ui/             # Radix & Tailwind Buttons, Badges, Modals
│   ├── lib/                # BD Locations Data (64 Districts), Utils
│   ├── services/           # Axios API Clients for Backend Integration
│   ├── stores/             # Zustand Global Stores (Auth, Cart, Wishlist)
│   └── types/              # Full TypeScript Definitions
├── next.config.ts          # Next.js Remote Image Hostnames & Configuration
├── package.json            # Project Dependencies & Scripts
└── DOCUMENTATION.md        # Complete Frontend Documentation
```

---

## 💻 ৬. লোকাল ডেভেলপমেন্ট সেটআপ (Local Setup Instructions)

### প্রাক-প্রয়োজনীয়তা (Prerequisites)
- Node.js (v18 বা তদূর্ধ্ব)
- npm বা yarn

### ধাপসমূহ (Steps)
```bash
# ১. রিপোজিটরি ক্লোন করুন
git clone https://github.com/kawserbappy1/kiddybd-frontend.git
cd kiddybd-frontend

# ২. ডিপেনডেন্সি ইনস্টল করুন
npm install

# ৩. এনভায়রনমেন্ট ফাইল সেটআপ করুন (.env.local)
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# ৪. ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```
ব্রাউজারে [http://localhost:3000](http://localhost:3000) ওপেন করে লাইভ প্রিভিউ দেখুন।

---

## 📄 লাইসেন্স (License)
এই প্রজেক্টটি **KiddyBD**-এর নিজস্ব বাণিজ্যিক ও বৌদ্ধিক সম্পত্তি হিসেবে সংরক্ষিত।
All rights reserved © 2026 KiddyBD.
