import type { CatalogProduct } from "@/types/product";

export const catalogProducts: CatalogProduct[] = [
  {
    id: "basmati-gold",
    slug: "royal-basmati-gold",
    name: "Royal Basmati Gold",
    type: "Basmati",
    shortDescription: "Long-grain aromatic basmati ideal for biryani and festive meals.",
    description:
      "Royal Basmati Gold is aged for aroma and grain length. It cooks fluffy, separate, and fragrant for premium home and restaurant use.",
    origin: "Punjab, India",
    cookingQuality: "Long, fluffy, and aromatic",
    price: 1499,
    samplePrice: 199,
    rating: 4.9,
    popularityScore: 97,
    featured: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg", "10kg"],
  },
  {
    id: "sona-masoori",
    slug: "sona-masoori-classic",
    name: "Sona Masoori Classic",
    type: "Sona Masoori",
    shortDescription: "Light and soft grains for daily wholesome family cooking.",
    description:
      "Sona Masoori Classic offers a balanced texture and light aroma for regular meals. It is easy to digest and perfect for everyday use.",
    origin: "Andhra Pradesh, India",
    cookingQuality: "Soft and light",
    price: 899,
    samplePrice: 149,
    rating: 4.7,
    popularityScore: 89,
    featured: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg", "10kg"],
  },
  {
    id: "ponni-premium",
    slug: "ponni-premium",
    name: "Ponni Premium",
    type: "Ponni",
    shortDescription: "Premium ponni grains with clean finish and balanced moisture.",
    description:
      "Ponni Premium is sorted for consistency and cooking comfort. Best for daily meals where soft texture and clean taste matter.",
    origin: "Tamil Nadu, India",
    cookingQuality: "Soft with mild aroma",
    price: 999,
    samplePrice: 159,
    rating: 4.8,
    popularityScore: 86,
    featured: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512427691650-6f67f2ff90ce?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg", "10kg"],
  },
  {
    id: "brown-rice",
    slug: "organic-brown-rice",
    name: "Organic Brown Rice",
    type: "Brown Rice",
    shortDescription: "Whole-grain nutrition with earthy flavor and rich fiber.",
    description:
      "Organic Brown Rice is minimally processed to preserve bran and nutrients. Ideal for fitness and wellness-focused diets.",
    origin: "Karnataka, India",
    cookingQuality: "Nutty and firm",
    price: 1099,
    samplePrice: 169,
    rating: 4.6,
    popularityScore: 82,
    featured: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603048719539-9ecb8e13f98b?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg"],
  },
  {
    id: "red-rice",
    slug: "traditional-red-rice",
    name: "Traditional Red Rice",
    type: "Red Rice",
    shortDescription: "Rustic grains with natural color, rich minerals, and deep taste.",
    description:
      "Traditional Red Rice is rich in antioxidants and texture. Great for specialty meals and nutrient-forward cooking.",
    origin: "Kerala, India",
    cookingQuality: "Firm with earthy notes",
    price: 1199,
    samplePrice: 179,
    rating: 4.8,
    popularityScore: 84,
    featured: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1603048719539-9ecb8e13f98b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg"],
  },
  {
    id: "jeerakasala",
    slug: "jeerakasala-fragrant",
    name: "Jeerakasala Fragrant",
    type: "Jeerakasala",
    shortDescription: "Fine-grain fragrant rice for premium South Indian dishes.",
    description:
      "Jeerakasala Fragrant is prized for aroma and elegant texture. Perfect for special rice preparations and festive menus.",
    origin: "Kerala, India",
    cookingQuality: "Fine grain and aromatic",
    price: 1399,
    samplePrice: 189,
    rating: 4.7,
    popularityScore: 83,
    featured: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg"],
  },
  {
    id: "idly-rice",
    slug: "idly-special-rice",
    name: "Idly Special Rice",
    type: "Parboiled",
    shortDescription: "Selected grains for soft idly and fluffy dosa batter.",
    description:
      "Idly Special Rice is curated for fermentation quality and consistent batter texture for traditional breakfast recipes.",
    origin: "Tamil Nadu, India",
    cookingQuality: "Batter-friendly",
    price: 799,
    samplePrice: 129,
    rating: 4.5,
    popularityScore: 75,
    featured: false,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1512427691650-6f67f2ff90ce?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg", "10kg"],
  },
  {
    id: "seerar-samba",
    slug: "seerar-samba-rice",
    name: "Seerar Samba Rice",
    type: "Traditional",
    shortDescription: "Heritage variety known for taste and texture retention.",
    description:
      "Seerar Samba Rice offers an authentic heritage profile preferred in traditional cuisine and mindful diets.",
    origin: "Tamil Nadu, India",
    cookingQuality: "Firm yet soft",
    price: 1299,
    samplePrice: 179,
    rating: 4.6,
    popularityScore: 78,
    featured: false,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=1200&q=80",
    ],
    weightOptions: ["1kg", "5kg"],
  },
];

export const getStaticCatalogProducts = (): CatalogProduct[] => catalogProducts;

export const getStaticProductBySlug = (slug: string): CatalogProduct | undefined => {
  return catalogProducts.find((product) => product.slug === slug);
};

export const getStaticProductById = (id: string): CatalogProduct | undefined => {
  return catalogProducts.find((product) => product.id === id);
};
