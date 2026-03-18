import type { ProductPreviewCard } from "@/types/product";

export const featuredProducts: ProductPreviewCard[] = [
  {
    id: "basmati-gold",
    name: "Royal Basmati Gold",
    price: 1499,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sona-masoori",
    name: "Sona Masoori Classic",
    price: 899,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ponni-premium",
    name: "Ponni Premium",
    price: 999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=80",
  },
];

export const newArrivals: ProductPreviewCard[] = [
  {
    id: "brown-rice",
    name: "Organic Brown Rice",
    price: 1099,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=80",
    tag: "New Arrival",
  },
  {
    id: "red-rice",
    name: "Traditional Red Rice",
    price: 1199,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1603048719539-9ecb8e13f98b?auto=format&fit=crop&w=900&q=80",
    tag: "New Arrival",
  },
  {
    id: "jeerakasala",
    name: "Jeerakasala Fragrant",
    price: 1399,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80",
    tag: "New Arrival",
  },
];

export const whyChooseUs = [
  {
    title: "Organic Farming",
    description: "Cultivated with natural practices and strict quality controls.",
    icon: "🌾",
  },
  {
    title: "Direct From Farmers",
    description: "We source directly to ensure fairness, transparency, and freshness.",
    icon: "🤝",
  },
  {
    title: "Premium Quality",
    description: "Handpicked grains with rich aroma, texture, and cooking consistency.",
    icon: "⭐",
  },
  {
    title: "Fresh Packaging",
    description: "Sealed and delivered quickly to preserve purity and flavor.",
    icon: "📦",
  },
];

export const subscriptionPlans = [
  {
    title: "Weekly Essentials",
    description: "Fresh stock every week for homes that cook daily.",
    price: "From ₹699/week",
  },
  {
    title: "Monthly Family Plan",
    description: "Best value for regular usage with priority dispatch.",
    price: "From ₹2,499/month",
  },
  {
    title: "Gold Saver Plan",
    description: "Premium plan with extra discounts and free sample packs.",
    price: "From ₹3,499/month",
  },
];

export const testimonials = [
  {
    name: "Meera R.",
    text: "The aroma and consistency are outstanding. This is now our family favorite.",
    rating: 5,
  },
  {
    name: "Rohit P.",
    text: "Loved the quality and delivery experience. Packaging felt truly premium.",
    rating: 5,
  },
  {
    name: "Ayesha K.",
    text: "Sample pack helped us choose perfectly. Great service and excellent rice.",
    rating: 4,
  },
];

export const faqs = [
  {
    question: "How do you ensure rice quality?",
    answer:
      "Each batch goes through sourcing checks, grain grading, and moisture-level screening before packaging.",
  },
  {
    question: "What are the delivery timelines?",
    answer:
      "Most metro deliveries arrive within 2-4 business days depending on location and plan.",
  },
  {
    question: "How does subscription billing work?",
    answer:
      "Your selected weekly or monthly plan is billed automatically and can be modified from your dashboard.",
  },
];
