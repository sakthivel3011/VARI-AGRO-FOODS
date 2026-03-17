import { ArrowRight, Star } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { ProductCard } from "@/components/home/ProductCard";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSeo } from "@/hooks/useSeo";
import {
  faqs,
  featuredProducts,
  newArrivals,
  subscriptionPlans,
  testimonials,
  whyChooseUs,
} from "@/data/homeData";
import { warmCriticalImages } from "@/services/performance";

const HomePage = () => {
  useSeo({
    title: "Vari Agro Foods | Premium Rice Direct From Farmers",
    description:
      "Shop premium organic rice online at Vari Agro Foods. Farm-direct sourcing, subscription plans, sample packs, and secure checkout.",
    canonicalPath: "/",
  });

  useEffect(() => {
    warmCriticalImages([
      ...featuredProducts.map((product) => product.image),
      ...newArrivals.map((product) => product.image),
    ]);
  }, []);

  return (
    <>
      <HeroSection />

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Best Sellers"
            title="Featured Premium Rice"
            subtitle="Curated top-selling varieties known for fragrance, texture, and quality."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  slug:
                    product.id === "basmati-gold"
                      ? "royal-basmati-gold"
                      : product.id === "sona-masoori"
                        ? "sona-masoori-classic"
                        : "ponni-premium",
                  shortDescription: "Premium aromatic rice with consistent quality and rich flavor.",
                  samplePrice: Math.max(99, Math.floor(product.price * 0.15)),
                  weightOptions: ["1kg", "5kg", "10kg"],
                  type: "Rice",
                }}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#fffaf2] py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Just Arrived"
            title="Newly Added Rice"
            subtitle="Fresh arrivals from our latest harvest partnerships."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  slug:
                    product.id === "brown-rice"
                      ? "organic-brown-rice"
                      : product.id === "red-rice"
                        ? "traditional-red-rice"
                        : "jeerakasala-fragrant",
                  shortDescription: "Freshly added premium grains from latest harvest sourcing.",
                  samplePrice: Math.max(99, Math.floor(product.price * 0.15)),
                  weightOptions: ["1kg", "5kg"],
                  type: "Rice",
                }}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Our Promise"
            title="Why Choose Vari Agro Foods"
            subtitle="Built on farmer trust, quality-first operations, and reliable delivery."
            align="center"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-8 overflow-hidden rounded-3xl border border-[#e8dfd1] bg-white p-8 shadow-soft lg:grid-cols-2 lg:p-12">
            <div data-aos="fade-right">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">Farmer Story</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-[#2b1f14] md:text-4xl">
                From Family Fields To Your Kitchen
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5d554c] md:text-base">
                We collaborate with dedicated farming families who preserve soil health and uphold
                traditional cultivation values. Every grain reflects that care from seed to packaging.
              </p>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-red"
              >
                Read Their Journey <ArrowRight size={16} />
              </Link>
            </div>
            <div data-aos="fade-left" className="relative h-72 overflow-hidden rounded-2xl md:h-80">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
                alt="Farmers working in rice fields"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#fffaf2] py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Flexible Plans"
            title="Subscription Plans"
            subtitle="Get premium rice deliveries at your preferred schedule with savings."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <article
                key={plan.title}
                className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft"
                data-aos="zoom-in"
              >
                <h3 className="font-heading text-2xl font-semibold text-[#2b1f14]">{plan.title}</h3>
                <p className="mt-2 text-sm text-[#5d554c]">{plan.description}</p>
                <p className="mt-4 text-lg font-bold text-brand-red">{plan.price}</p>
                <Button className="mt-5 w-full">Choose Plan</Button>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Customer Love"
            title="What Our Customers Say"
            subtitle="Real feedback from families and restaurants that trust our quality."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((review, index) => (
              <article
                key={`${review.name}-${index}`}
                className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft"
                data-aos="fade-up"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} size={16} className="fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#5d554c]">"{review.text}"</p>
                <p className="mt-4 text-sm font-bold text-[#2b1f14]">{review.name}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 md:pb-20">
        <Container>
          <SectionHeading eyebrow="Need Help" title="Frequently Asked Questions" />
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft"
                data-aos="fade-up"
              >
                <summary className="cursor-pointer list-none text-sm font-bold text-[#2b1f14] md:text-base">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#5d554c]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
