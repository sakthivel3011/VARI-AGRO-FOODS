import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import type { CatalogProduct, ProductPreviewCard } from "@/types/product";

type ProductCardProps = {
  product: ProductPreviewCard;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const mappedProduct: CatalogProduct = {
    id: product.id,
    slug: product.slug ?? product.id,
    name: product.name,
    type: product.type ?? "Rice",
    shortDescription: product.shortDescription ?? "Premium quality rice.",
    description: product.shortDescription ?? "Premium quality rice.",
    origin: "India",
    cookingQuality: "Fluffy and aromatic",
    price: product.price,
    samplePrice: product.samplePrice ?? Math.max(99, Math.floor(product.price * 0.15)),
    rating: product.rating,
    popularityScore: 80,
    featured: false,
    isNewArrival: Boolean(product.tag),
    images: [product.image],
    weightOptions: product.weightOptions ?? ["1kg", "5kg"],
  };

  return (
    <article
      className="group overflow-hidden rounded-2xl border border-[#efe4d6] bg-white shadow-soft transition duration-300 hover:-translate-y-1"
      data-aos="fade-up"
    >
      <div className="relative h-52 overflow-hidden bg-[#f4efe7]">
        {product.tag ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white">
            {product.tag}
          </span>
        ) : null}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-semibold text-[#2b1f14]">{product.name}</h3>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-sm text-[#6f6254]">{product.shortDescription}</p>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-brand-red">₹{product.price.toLocaleString()}</p>
          <p className="flex items-center gap-1 text-sm font-medium text-[#705f4d]">
            <Star size={16} className="fill-brand-gold text-brand-gold" /> {product.rating}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            onClick={() =>
              addToCart({
                product: mappedProduct,
                weight: mappedProduct.weightOptions[0],
              })
            }
          >
            Add To Cart
          </Button>
          <Link to={`/products/${mappedProduct.slug}`} className="w-full">
            <Button variant="outline" className="w-full">
              View
            </Button>
          </Link>
        </div>
        <Button
          variant="secondary"
          className="mt-2 w-full"
          onClick={() => addToCart({ product: mappedProduct, isSamplePack: true, quantity: 1 })}
        >
          Buy Sample
        </Button>
      </div>
    </article>
  );
};
