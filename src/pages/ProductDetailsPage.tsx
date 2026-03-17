import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/home/ProductCard";
import { ReviewComposer } from "@/components/reviews/ReviewComposer";
import {
  getStaticCatalogProducts,
  getStaticProductBySlug,
} from "@/data/catalogProducts";
import { getCatalogProductBySlug } from "@/services/products";
import { useCart } from "@/hooks/useCart";
import type { CatalogProduct } from "@/types/product";
import { useSeo } from "@/hooks/useSeo";
import { subscribeApprovedReviewsByProduct, type ReviewRecord } from "@/services/reviews";
import { warmCriticalImages } from "@/services/performance";

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const { addToCart } = useCart();

  useSeo({
    title: product ? `${product.name} | Vari Agro Foods` : "Product Details | Vari Agro Foods",
    description:
      product?.shortDescription ??
      "Premium rice product details, pricing, weight options, and sample pack purchase.",
    canonicalPath: slug ? `/products/${slug}` : "/products",
  });

  useEffect(() => {
    const run = async () => {
      if (!slug) {
        setProduct(null);
        return;
      }

      try {
        const remote = await getCatalogProductBySlug(slug);
        if (remote) {
          setProduct(remote);
          setSelectedImage(remote.images[0]);
          setSelectedWeight(remote.weightOptions[0] ?? "1kg");
          return;
        }
      } catch (error) {
        console.error("Failed to load remote product details", error);
      }

      const local = getStaticProductBySlug(slug);
      if (local) {
        setProduct(local);
        setSelectedImage(local.images[0]);
        setSelectedWeight(local.weightOptions[0] ?? "1kg");
      } else {
        setProduct(null);
      }
    };

    void run();
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return getStaticCatalogProducts()
      .filter((item) => item.id !== product.id && item.type === product.type)
      .slice(0, 3);
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    warmCriticalImages(product.images);
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const unsubscribe = subscribeApprovedReviewsByProduct(product.id, (next) => {
      setReviews(next);
    });

    return () => unsubscribe();
  }, [product]);

  if (!product) {
    return (
      <section className="py-20">
        <Container className="text-center">
          <h1 className="font-heading text-4xl font-bold text-[#2b1f14]">Product Not Found</h1>
          <p className="mt-3 text-sm text-[#5d554c]">We could not find this rice product.</p>
          <Link to="/products" className="mt-6 inline-block">
            <Button>Back To Products</Button>
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <>
      <div className="py-4">
        <Container>
          <BackButton />
        </Container>
      </div>
      <PageHero
        badge={product.type}
        title={product.name}
        subtitle={product.shortDescription}
      />

      <section className="py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
          <div>
            <div className="overflow-hidden rounded-3xl border border-[#efe4d6] bg-white shadow-soft">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className="overflow-hidden rounded-xl border border-[#efe4d6] bg-white"
                >
                  <img src={image} alt={product.name} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-4xl font-bold text-[#2b1f14]">{product.name}</h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-[#5d554c]">
              <Star size={16} className="fill-brand-gold text-brand-gold" /> {product.rating} customer rating
            </div>

            <p className="mt-5 text-sm leading-relaxed text-[#5d554c] md:text-base">{product.description}</p>

            <div className="mt-6 grid gap-4 rounded-2xl border border-[#efe4d6] bg-[#fffdf9] p-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6254]">Origin</span>
                <span className="font-semibold text-[#2b1f14]">{product.origin}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6254]">Cooking Quality</span>
                <span className="font-semibold text-[#2b1f14]">{product.cookingQuality}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-green">Weight Options</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.weightOptions.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selectedWeight === weight
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-[#e8dfd1] bg-white text-[#4d4033]"
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
              <p className="text-3xl font-bold text-brand-red">₹{product.price.toLocaleString()}</p>
              <p className="text-sm text-[#5d554c]">Sample pack from ₹{product.samplePrice.toLocaleString()}</p>
              <div className="grid gap-2 md:grid-cols-2">
                <Button
                  onClick={() =>
                    addToCart({
                      product,
                      weight: selectedWeight || product.weightOptions[0],
                      quantity: 1,
                    })
                  }
                >
                  Add To Cart
                </Button>
                <Button variant="secondary" onClick={() => addToCart({ product, isSamplePack: true, quantity: 1 })}>
                  Buy Sample Pack
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#fffaf2] py-12 md:py-16">
        <Container>
          <h3 className="font-heading text-3xl font-bold text-[#2b1f14]">Customer Reviews</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold text-[#2b1f14]">{review.data.userName}</p>
                  <p className="text-[#7a6d5f]">{review.data.rating} / 5</p>
                </div>
                <p className="mt-2 text-sm text-[#5d554c]">{review.data.text}</p>
                {review.data.mediaUrls?.[0] ? (
                  <img
                    src={review.data.mediaUrls[0]}
                    alt={`${review.data.userName} feedback`}
                    loading="lazy"
                    className="mt-3 h-40 w-full rounded-xl object-cover"
                  />
                ) : null}
              </article>
            ))}
            {reviews.length === 0 ? (
              <article className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft md:col-span-2">
                <p className="text-sm leading-relaxed text-[#5d554c]">
                  Customers consistently highlight aroma, grain quality, and clean packaging for {product.name}.
                </p>
              </article>
            ) : null}
          </div>

          <div className="mt-5">
            <ReviewComposer productId={product.id} productName={product.name} />
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <h3 className="font-heading text-3xl font-bold text-[#2b1f14]">Related Products</h3>
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  slug: item.slug,
                  name: item.name,
                  shortDescription: item.shortDescription,
                  price: item.price,
                  samplePrice: item.samplePrice,
                  rating: item.rating,
                  image: item.images[0],
                  weightOptions: item.weightOptions,
                  type: item.type,
                }}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProductDetailsPage;
