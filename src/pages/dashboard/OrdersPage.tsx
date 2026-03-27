import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";
import { useAuth } from "@/hooks/useAuth";
import { cancelOrderByUser, getUserOrders } from "@/services/orders";
import type { OrderRecord } from "@/services/orders";
import { useSeo } from "@/hooks/useSeo";
import { demoOrders } from "@/data/adminDemoData";

const OrdersPage = () => {
  useSeo({
    title: "My Orders | Vari Agro Foods",
    description: "Track order status, payment progress, and delivery lifecycle.",
    canonicalPath: "/dashboard/orders",
  });

  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const items = await getUserOrders(user.uid);
      if (items.length === 0) {
        setOrders([demoOrders[0]]);
        setStatus("Showing sample order data for review.");
      } else {
        setOrders(items);
      }
    } catch {
      setOrders([demoOrders[0]]);
      setStatus("Live orders unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const run = async () => {
      await loadOrders();
    };

    void run();
  }, [loadOrders]);

  const cancelOrder = async (orderIndex: number) => {
    const selected = orders[orderIndex];
    if (!selected) {
      return;
    }

    try {
      await cancelOrderByUser(selected.id);
      setStatus("Order cancellation requested.");
      await loadOrders();
    } catch (error) {
      console.error("Failed to cancel order", error);
      setStatus("Unable to cancel this order now.");
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">My Orders</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Active Orders</h2>

      {loading ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          Loading your orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          No active orders yet. Place your first order from the products page.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((order, index) => (
            <article key={order.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="font-semibold text-[#2b1f14]">{order.data.items.length} items</p>
                <p className="font-semibold text-brand-red">₹{order.data.total.toLocaleString()}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                <OrderStatusPill status={order.data.status} />
                <span className="rounded-full border border-[#e8dfd1] px-2 py-1">{order.data.paymentMethod}</span>
                <span className="rounded-full border border-[#e8dfd1] px-2 py-1">{order.data.paymentStatus}</span>
              </div>

              {order.data.status !== "delivered" && order.data.status !== "cancelled" ? (
                <Button
                  variant="outline"
                  className="mt-3 h-8 px-3"
                  onClick={() => void cancelOrder(index)}
                >
                  Cancel Order
                </Button>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {status ? <p className="mt-4 text-sm text-[#5d554c]">{status}</p> : null}
    </div>
  );
};

export default OrdersPage;
