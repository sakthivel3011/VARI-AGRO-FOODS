import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useSeo } from "@/hooks/useSeo";

const PENDING_ONLINE_ORDER_KEY = "vari-pending-online-order";

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { clearCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const pendingOrderId = localStorage.getItem(PENDING_ONLINE_ORDER_KEY);
    if (pendingOrderId === orderId) {
      clearCart();
      localStorage.removeItem(PENDING_ONLINE_ORDER_KEY);
    }
  }, [orderId, clearCart]);

  useSeo({
    title: "Order Confirmed | Vari Agro Foods",
    description: "Your order has been successfully placed. Track your order from your dashboard.",
    canonicalPath: orderId ? `/order-success/${orderId}` : "/order-success",
  });

  return (
    <section className="py-20 md:py-24">
      <Container className="max-w-3xl">
        <div className="rounded-3xl border border-[#efe4d6] bg-white p-8 text-center shadow-soft md:p-12">
          <CheckCircle2 size={58} className="mx-auto text-brand-green" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-green">Order Confirmed</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-[#2b1f14]">Thank You For Your Purchase</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5d554c]">
            Your order has been placed successfully. We are preparing your premium rice shipment now.
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#efe4d6] bg-[#fffdf9] p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a6d5f]">Order ID</p>
            <p className="mt-2 break-all font-semibold text-[#2b1f14]">{orderId ?? "N/A"}</p>
          </div>

          <div className="mt-7 grid gap-2 md:grid-cols-2">
            <Link to="/products">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Link to="/dashboard/orders">
              <Button variant="outline" className="w-full">
                Track My Order
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OrderSuccessPage;
