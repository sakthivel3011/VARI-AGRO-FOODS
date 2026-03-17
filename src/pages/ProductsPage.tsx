import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/home/ProductCard";
import { getStaticCatalogProducts } from "@/data/catalogProducts";
import { getCatalogProducts } from "@/services/products";
import { trackEvent } from "@/services/analytics";
import type { CatalogProduct } from "@/types/product";
import { useSeo } from "@/hooks/useSeo";
import { warmCriticalImages } from "@/services/performance";

const fallbackProducts = getStaticCatalogProducts();

const productTypeMatchesFilter = (productType: string, filter: string): boolean => {
  if (filter === "all") {
    return true;
  }

  const normalizedType = productType.toLowerCase();

  if (filter === "basmati") {
    return normalizedType.includes("basmati");
  }

  if (filter === "sona") {
    return normalizedType.includes("sona");
  }

  if (filter === "brown") {
    return normalizedType.includes("brown");
  }

  return normalizedType.includes(filter);
};

const ProductsPage = () => {
  useSeo({
    title: "Vari Agro Foods | Shop Premium Rice",
    description:
      "Browse all rice products by type, price, and popularity. Buy sample packs or full-size premium rice online.",
    canonicalPath: "/products",
  });

  const [queryText, setQueryText] = useState("");
  const [riceType, setRiceType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [remoteProducts, setRemoteProducts] = useState<CatalogProduct[]>(fallbackProducts);

  useEffect(() => {
    const run = async () => {
      void trackEvent("products_filter_changed", {
        rice_type: riceType,
      });

      try {
        const products = await getCatalogProducts({}, 24);

        if (products.length === 0) {
          return;
        }

        setRemoteProducts(products);
      } catch {
        setRemoteProducts(fallbackProducts);
      }
    };

    void run();
  }, [riceType]);

  useEffect(() => {
    warmCriticalImages(remoteProducts.map((product) => product.images[0]));
  }, [remoteProducts]);

  const visibleProducts = useMemo(() => {
    const filtered = remoteProducts.filter((product) => {
      const normalizedText = queryText.trim().toLowerCase();
      const matchesText =
        normalizedText.length === 0 ||
        product.name.toLowerCase().includes(normalizedText) ||
        product.shortDescription.toLowerCase().includes(normalizedText) ||
        product.type.toLowerCase().includes(normalizedText);
      const matchesType = productTypeMatchesFilter(product.type, riceType);

      return matchesText && matchesType;
    });

    if (sortBy === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return [...filtered].sort((a, b) => b.popularityScore - a.popularityScore);
  }, [queryText, riceType, sortBy, remoteProducts]);

  return (
    <>
      <div className="py-4">
        <Container>
          <BackButton />
        </Container>
      </div>
      <PageHero
        badge="Rice Collection"
        title="Discover Our Premium Rice Range"
        subtitle="Search and filter by rice type, price, and popularity to find your ideal grain."
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-4 rounded-2xl border border-[#efe4d6] bg-white p-4 shadow-soft md:grid-cols-2 lg:grid-cols-4">
            <label className="relative lg:col-span-2">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6d5f]" />
              <input
                type="text"
                placeholder="Search rice by name"
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                className="h-11 w-full rounded-full border border-[#e8dfd1] bg-[#fffcf8] pl-11 pr-4 text-sm outline-none focus:border-brand-red"
              />
            </label>

            <select
              className="h-11 rounded-full border border-[#e8dfd1] bg-[#fffcf8] px-4 text-sm outline-none focus:border-brand-red"
              value={riceType}
              onChange={(event) => setRiceType(event.target.value)}
            >
              <option value="all">Rice Type</option>
              <option value="basmati">Basmati</option>
              <option value="sona">Sona Masoori</option>
              <option value="brown">Brown Rice</option>
            </select>

            <select
              className="h-11 rounded-full border border-[#e8dfd1] bg-[#fffcf8] px-4 text-sm outline-none focus:border-brand-red"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="popular">Sort By Popularity</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price Low To High</option>
              <option value="price-high">Price High To Low</option>
            </select>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a6d5f]">
            <Filter size={14} /> Filters active
            <span className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd1] px-2 py-1 text-[11px] normal-case">
              <SlidersHorizontal size={12} /> Premium only
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  shortDescription: product.shortDescription,
                  price: product.price,
                  samplePrice: product.samplePrice,
                  rating: product.rating,
                  image: product.images[0],
                  weightOptions: product.weightOptions,
                  type: product.type,
                  tag: product.isNewArrival ? "New Arrival" : undefined,
                }}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProductsPage;
