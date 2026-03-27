import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";
import { getAllOrders, updateOrderStatus, type OrderRecord } from "@/services/orders";
import type { OrderDoc } from "@/types/firestore";
import { useSeo } from "@/hooks/useSeo";
import { demoOrders } from "@/data/adminDemoData";

const statusSequence: OrderDoc["status"][] = ["placed", "processing", "shipped", "delivered"];

const nextStatus = (current: OrderDoc["status"]): OrderDoc["status"] => {
  if (current === "cancelled" || current === "delivered") {
    return current;
  }

  const index = statusSequence.indexOf(current);
  if (index < 0 || index === statusSequence.length - 1) {
    return "delivered";
  }

  return statusSequence[index + 1];
};

const OrdersAdminPage = () => {
  useSeo({
    title: "Admin Orders | Vari Agro Foods",
    description: "Track and update order status from Vari Agro Foods admin dashboard.",
    canonicalPath: "/admin/orders",
  });

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(250);
      if (data.length === 0) {
        setOrders(demoOrders);
        setStatusMessage("Showing sample orders for review.");
      } else {
        setOrders(data);
        setStatusMessage("");
      }
    } catch (error) {
      console.error("Failed to load admin orders", error);
      setOrders(demoOrders);
      setStatusMessage("Live orders unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const progressOrder = async (orderId: string, currentStatus: OrderDoc["status"]) => {
    try {
      await updateOrderStatus(orderId, nextStatus(currentStatus));
      await loadOrders();
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "cancelled");
      await loadOrders();
    } catch (error) {
      console.error("Failed to cancel order", error);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Order Management</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Orders</h2>

      {loading ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          Loading orders...
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {statusMessage ? <p className="text-sm text-[#5d554c]">{statusMessage}</p> : null}
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#2b1f14]">{order.data.customerName}</p>
                <p className="font-semibold text-brand-red">₹{order.data.total.toLocaleString()}</p>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                {order.data.paymentMethod} · {order.data.paymentStatus}
              </p>
              <div className="mt-2">
                <OrderStatusPill status={order.data.status} />
              </div>
              <p className="mt-2 text-sm text-[#5d554c]">{order.data.deliveryAddress}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {order.data.status !== "cancelled" && order.data.status !== "delivered" ? (
                  <Button
                    variant="secondary"
                    className="h-8 px-3"
                    onClick={() => void progressOrder(order.id, order.data.status)}
                  >
                    Next Status
                  </Button>
                ) : null}
                {order.data.status !== "cancelled" && order.data.status !== "delivered" ? (
                  <Button variant="outline" className="h-8 px-3" onClick={() => void cancelOrder(order.id)}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </article>
          ))}

          {orders.length === 0 ? <p className="text-sm text-[#5d554c]">No orders available.</p> : null}
        </div>
      )}
    </div>
  );
};

export default OrdersAdminPage;
