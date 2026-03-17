import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { db } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import { useAuth } from "@/hooks/useAuth";
import { catalogProducts } from "@/data/catalogProducts";

const sampleProducts = catalogProducts.map((product) => ({
  name: product.name,
  slug: product.slug,
  type: product.type,
  description: product.description,
  origin: product.origin,
  cookingQuality: product.cookingQuality,
  price: product.price,
  samplePrice: product.samplePrice,
  weights: product.weightOptions,
  stock: 140,
  ratingAverage: product.rating,
  ratingCount: 100,
  popularityScore: product.popularityScore,
  featured: product.featured,
  isNewArrival: product.isNewArrival,
  images: product.images,
}));

const DevSeedPage = () => {
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState("");

  const seedProducts = async () => {
    if (!isAdmin) {
      setStatus("Only admins can seed products.");
      return;
    }

    try {
      for (const product of sampleProducts) {
        await addDoc(collection(db, collections.products), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setStatus("Sample products added to Firestore.");
    } catch {
      setStatus("Seeding failed. Check Firebase rules and project setup.");
    }
  };

  return (
    <section className="py-16">
      <Container className="max-w-3xl rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Developer Utility</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Seed Firestore Products</h1>
        <p className="mt-3 text-sm text-[#5d554c]">
          This page inserts starter `products` documents for local development and staging.
        </p>
        <Button className="mt-6" onClick={() => void seedProducts()}>
          Seed Products Collection
        </Button>
        {status ? <p className="mt-4 text-sm font-semibold text-[#5d554c]">{status}</p> : null}
      </Container>
    </section>
  );
};

export default DevSeedPage;
