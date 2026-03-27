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
  const { isAdmin, user } = useAuth();
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

  const seedOrdersReviewsAndMessages = async () => {
    if (!isAdmin || !user) {
      setStatus("Admin login required to seed sample content.");
      return;
    }

    try {
      const primary = sampleProducts[0];
      const secondary = sampleProducts[1] ?? sampleProducts[0];

      await addDoc(collection(db, collections.orders), {
        userId: user.uid,
        items: [
          {
            productId: "demo-product-1",
            name: primary.name,
            image: primary.images[0],
            unitPrice: primary.price,
            quantity: 1,
            weight: primary.weights[0] ?? "1kg",
          },
        ],
        subtotal: primary.price,
        deliveryCharge: primary.price >= 1200 ? 0 : 99,
        total: primary.price >= 1200 ? primary.price : primary.price + 99,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "placed",
        customerName: user.displayName ?? "Demo Customer",
        phone: user.phoneNumber ?? "9000000000",
        deliveryAddress: "135 Mariamman Kovil Street, Chennai",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, collections.reviews), {
        productId: "demo-product-1",
        userId: user.uid,
        userName: user.displayName ?? "Demo Customer",
        rating: 5,
        text: "Sample review: excellent quality and aroma. Perfect for daily cooking.",
        mediaUrls: [],
        moderationStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, collections.reviews), {
        productId: "demo-product-2",
        userId: user.uid,
        userName: user.displayName ?? "Demo Customer",
        rating: 4,
        text: `Sample review: ${secondary.name} has good taste and consistent grain quality.`,
        mediaUrls: [],
        moderationStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, collections.messages), {
        userId: user.uid,
        anonymousName: "Rice Lover",
        text: "Sample message: Please add more premium rice combo offers.",
        moderationStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, collections.messages), {
        userId: user.uid,
        anonymousName: "KitchenPro",
        text: "Sample message: Looking for monthly subscription discounts.",
        moderationStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatus("Sample orders, reviews, and messages added.");
    } catch {
      setStatus("Seeding sample content failed. Check Firebase rules and login.");
    }
  };

  return (
    <section className="py-16">
      <Container className="max-w-3xl rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Developer Utility</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Seed Firestore Sample Data</h1>
        <p className="mt-3 text-sm text-[#5d554c]">
          This page inserts starter data for products, orders, reviews, and messages for review/demo.
        </p>
        <Button className="mt-6" onClick={() => void seedProducts()}>
          Seed Products Collection
        </Button>
        <Button className="mt-3" variant="secondary" onClick={() => void seedOrdersReviewsAndMessages()}>
          Seed Orders + Reviews + Messages
        </Button>
        {status ? <p className="mt-4 text-sm font-semibold text-[#5d554c]">{status}</p> : null}
      </Container>
    </section>
  );
};

export default DevSeedPage;
