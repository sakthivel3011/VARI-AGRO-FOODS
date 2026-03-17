import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1592997571659-0b21ff64313b?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f1307]/85 via-[#31180b]/60 to-[#7b632d]/35" />

      <Container className="relative z-10 flex min-h-[72vh] items-center py-16 md:min-h-[78vh]">
        <motion.div
          className="max-w-2xl text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f8e0a3]">
            Premium Organic Quality
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
            Premium Quality Rice Direct From Farmers
          </h1>
          <p className="mt-6 max-w-xl text-sm text-[#f7efe2] md:text-base">
            Experience aromatic grains, farm-fresh quality, and trusted sourcing from partner farmers,
            delivered to your doorstep with uncompromised care.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products">
              <Button variant="secondary">Shop Now</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#2b1f14]">
                Explore Rice
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
