import type { ProductDoc } from "@/types/firestore";
import type { CatalogProduct } from "@/types/product";

export const mapProductDocToCatalogProduct = (
  data: ProductDoc,
  fallbackId: string,
): CatalogProduct => {
  return {
    id: fallbackId,
    slug: data.slug,
    name: data.name,
    type: data.type,
    shortDescription: data.description,
    description: data.description,
    origin: data.origin,
    cookingQuality: data.cookingQuality,
    price: data.price,
    samplePrice: data.samplePrice,
    rating: data.ratingAverage,
    popularityScore: data.popularityScore,
    featured: data.featured,
    isNewArrival: data.isNewArrival,
    images: data.images,
    weightOptions: data.weights,
  };
};
