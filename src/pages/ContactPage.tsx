import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useSeo } from "@/hooks/useSeo";

const ContactPage = () => {
  useSeo({
    title: "Contact Vari Agro Foods",
    description: "Contact Vari Agro Foods for product support, delivery help, subscription queries, and partnership requests.",
    canonicalPath: "/contact",
  });

  return (
    <>
      <PageHero
        badge="Get In Touch"
        title="Contact Vari Agro Foods"
        subtitle="Have questions about rice quality, delivery, or subscriptions? We are here to help."
      />

      <section className="py-12 md:py-16">
        <Container>
          <form className="mx-auto grid max-w-3xl gap-4 rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft md:grid-cols-2">
            <input
              type="text"
              placeholder="Your Name"
              className="h-11 rounded-xl border border-[#e8dfd1] px-4 text-sm outline-none focus:border-brand-red"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="h-11 rounded-xl border border-[#e8dfd1] px-4 text-sm outline-none focus:border-brand-red"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="h-11 rounded-xl border border-[#e8dfd1] px-4 text-sm outline-none focus:border-brand-red md:col-span-2"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="rounded-xl border border-[#e8dfd1] p-4 text-sm outline-none focus:border-brand-red md:col-span-2"
            />
            <Button className="md:col-span-2">Send Message</Button>
          </form>
        </Container>
      </section>
    </>
  );
};

export default ContactPage;
