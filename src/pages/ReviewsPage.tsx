import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { testimonials } from "@/data/homeData";
import { subscribeApprovedReviews, type ReviewRecord } from "@/services/reviews";
import { useSeo } from "@/hooks/useSeo";

type DisplayReview = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

const fallbackReviews: DisplayReview[] = testimonials.map((item, index) => ({
  id: `testimonial-${index}`,
  name: item.name,
  text: item.text,
  rating: item.rating,
}));

const ReviewsPage = () => {
  useSeo({
    title: "Customer Reviews | Vari Agro Foods",
    description: "Read verified customer reviews and ratings for Vari Agro Foods premium rice products.",
    canonicalPath: "/reviews",
  });

  const [displayReviews, setDisplayReviews] = useState<DisplayReview[]>(fallbackReviews);

  useEffect(() => {
    const unsubscribe = subscribeApprovedReviews((records: ReviewRecord[]) => {
      if (records.length === 0) {
        setDisplayReviews(fallbackReviews);
        return;
      }

      setDisplayReviews(
        records.map((record) => ({
          id: record.id,
          name: record.data.userName,
          text: record.data.text,
          rating: record.data.rating,
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <PageHero
        badge="Trusted Voices"
        title="Customer Reviews"
        subtitle="Ratings and testimonials from customers who use Vari Agro Foods daily."
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {displayReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft">
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
    </>
  );
};

export default ReviewsPage;
