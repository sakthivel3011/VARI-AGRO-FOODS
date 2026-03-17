import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { useSeo } from "@/hooks/useSeo";

const AboutPage = () => {
  useSeo({
    title: "About Us | Vari Agro Foods",
    description: "Learn how Vari Agro Foods partners with farmers to deliver premium quality rice nationwide.",
    canonicalPath: "/about",
  });

  return (
    <>
      <PageHero
        badge="Our Journey"
        title="About Vari Agro Foods"
        subtitle="We partner with farming communities to deliver premium organic rice with trust and transparency."
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-8 rounded-2xl border border-[#efe4d6] bg-white p-8 shadow-soft lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#2b1f14]">Our Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5d554c] md:text-base">
                We exist to make premium rice accessible while supporting ethical farming and fair pricing.
                Every order strengthens a direct farm-to-home ecosystem.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#2b1f14]">Our Standards</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5d554c] md:text-base">
                From sourcing to packaging, each batch is quality checked for aroma, texture, and moisture
                to ensure consistent cooking excellence.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AboutPage;
