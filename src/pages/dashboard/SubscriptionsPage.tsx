import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getUserSubscriptions, updateSubscriptionStatus } from "@/services/subscriptions";
import type { SubscriptionDoc } from "@/types/firestore";
import type { UserSubscriptionRecord } from "@/services/subscriptions";
import { useSeo } from "@/hooks/useSeo";

const SubscriptionsPage = () => {
  useSeo({
    title: "My Subscriptions | Vari Agro Foods",
    description: "Pause, resume, or cancel your weekly and monthly rice subscriptions.",
    canonicalPath: "/dashboard/subscriptions",
  });

  const { user } = useAuth();
  const [items, setItems] = useState<UserSubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const docs = await getUserSubscriptions(user.uid);
      setItems(docs);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const setStatus = async (subscriptionId: string, status: SubscriptionDoc["status"]) => {
    try {
      await updateSubscriptionStatus(subscriptionId, status);
      await loadSubscriptions();
    } catch (error) {
      console.error("Failed to update subscription status", error);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Subscriptions</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Manage Plans</h2>

      {loading ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          Loading subscriptions...
        </p>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          <p>Weekly and monthly subscription controls will appear here.</p>
          <Link to="/subscription" className="mt-3 inline-block">
            <Button className="h-8 px-3">Choose Subscription Plan</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="font-semibold capitalize text-[#2b1f14]">{item.data.plan} plan</p>
                <p className="font-semibold text-brand-red">
                  {typeof item.data.pricePerCycle === "number" && item.data.pricePerCycle > 0
                    ? `₹${item.data.pricePerCycle.toLocaleString()}`
                    : "Billed via Stripe"}
                </p>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                Status: {item.data.status}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(item.data.status === "active" || item.data.status === "pending") ? (
                  <Button
                    variant="outline"
                    className="h-9 px-4"
                    onClick={() => void setStatus(item.id, "paused")}
                    disabled={item.data.status === "pending"}
                  >
                    Pause
                  </Button>
                ) : null}
                {item.data.status === "paused" ? (
                  <Button
                    variant="secondary"
                    className="h-9 px-4"
                    onClick={() => void setStatus(item.id, "active")}
                  >
                    Resume
                  </Button>
                ) : null}
                {item.data.status !== "cancelled" ? (
                  <Button className="h-9 px-4" onClick={() => void setStatus(item.id, "cancelled")}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
