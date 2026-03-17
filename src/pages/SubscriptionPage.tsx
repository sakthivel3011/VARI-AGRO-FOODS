import { Check } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { subscriptionPlans } from "@/data/homeData";
import { useAuth } from "@/hooks/useAuth";
import { createStripeSubscriptionCheckout } from "@/services/payments";
import { useSeo } from "@/hooks/useSeo";

const SubscriptionPage = () => {
  useSeo({
    title: "Rice Subscriptions | Vari Agro Foods",
    description:
      "Subscribe to weekly or monthly premium rice delivery with automated billing and flexible plan management.",
    canonicalPath: "/subscription",
  });

  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleChoosePlan = async (planTitle: string) => {
    if (!user) {
      setMessage("Please login to start your subscription.");
      return;
    }

    const plan = planTitle.toLowerCase().includes("weekly") ? "weekly" : "monthly";

    try {
      setLoadingPlan(planTitle);
      const session = await createStripeSubscriptionCheckout(plan, "royal-basmati-gold", 5);
      window.location.href = session.checkoutUrl;
    } catch {
      setMessage("Unable to create subscription right now. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <PageHero
        badge="Smart Delivery"
        title="Rice Subscription Plans"
        subtitle="Choose weekly or monthly premium rice delivery with savings and priority dispatch."
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan, index) => (
              <article
                key={plan.title}
                className="relative rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft"
              >
                {index === 1 ? (
                  <span className="absolute right-4 top-4 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                ) : null}
                <h2 className="font-heading text-2xl font-semibold text-[#2b1f14]">{plan.title}</h2>
                <p className="mt-2 text-sm text-[#5d554c]">{plan.description}</p>
                <p className="mt-4 text-lg font-bold text-brand-red">{plan.price}</p>

                <ul className="mt-5 space-y-3 text-sm text-[#5d554c]">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-brand-green" /> Auto-scheduled delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-brand-green" /> Easy pause and resume
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-brand-green" /> Priority customer support
                  </li>
                </ul>

                <Button
                  className="mt-6 w-full"
                  onClick={() => void handleChoosePlan(plan.title)}
                  disabled={Boolean(loadingPlan)}
                >
                  {loadingPlan === plan.title ? "Redirecting..." : "Choose Plan"}
                </Button>
              </article>
            ))}
          </div>

          {message ? (
            <p className="mt-5 rounded-xl border border-[#efe4d6] bg-white p-3 text-sm text-[#5d554c]">
              {message}
            </p>
          ) : null}
        </Container>
      </section>
    </>
  );
};

export default SubscriptionPage;
