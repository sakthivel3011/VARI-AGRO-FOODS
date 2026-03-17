export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  type: string;
  shortDescription: string;
  description: string;
  origin: string;
  cookingQuality: string;
  price: number;
  samplePrice: number;
  rating: number;
  popularityScore: number;
  featured: boolean;
  isNewArrival: boolean;
  images: string[];
  weightOptions: string[];
};

export type ProductPreviewCard = {
  id: string;
  slug?: string;
  name: string;
  shortDescription?: string;
  price: number;
  samplePrice?: number;
  rating: number;
  image: string;
  weightOptions?: string[];
  type?: string;
  tag?: string;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  weight: string;
  isSamplePack: boolean;
};
