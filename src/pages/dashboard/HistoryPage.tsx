import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserOrders } from "@/services/orders";
import type { OrderRecord } from "@/services/orders";
import { useSeo } from "@/hooks/useSeo";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";

const HistoryPage = () => {
  useSeo({
    title: "Order History | Vari Agro Foods",
    description: "View completed and cancelled purchases from your account history.",
    canonicalPath: "/dashboard/history",
  });

  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const items = await getUserOrders(user.uid);
        setOrders(items);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [user]);

  const historical = useMemo(
    () => orders.filter((item) => item.data.status === "delivered" || item.data.status === "cancelled"),
    [orders],
  );

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Order History</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Past Purchases</h2>

      {loading ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          Loading order history...
        </p>
      ) : historical.length === 0 ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          Your completed and cancelled order history will appear here.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {historical.map((order) => (
            <article key={order.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="font-semibold text-[#2b1f14]">{order.data.items.length} items</p>
                <p className="font-semibold text-brand-red">₹{order.data.total.toLocaleString()}</p>
              </div>
              <div className="mt-2 inline-flex rounded-full border border-[#e8dfd1] px-2 py-1 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                <OrderStatusPill status={order.data.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
