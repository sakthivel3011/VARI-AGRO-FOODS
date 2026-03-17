import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/services/orders";
import { trackEvent } from "@/services/analytics";
import { createStripeCheckoutSession } from "@/services/payments";
import { useSeo } from "@/hooks/useSeo";

type CheckoutForm = {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: "online" | "cod";
};

const PENDING_ONLINE_ORDER_KEY = "vari-pending-online-order";

const CheckoutPage = () => {
  useSeo({
    title: "Secure Checkout | Vari Agro Foods",
    description:
      "Complete your rice purchase with secure online payment or cash on delivery at Vari Agro Foods.",
    canonicalPath: "/checkout",
  });

  const navigate = useNavigate();
  const { items, subtotal, deliveryCharge, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    phone: "",
    deliveryAddress: "",
    paymentMethod: "cod",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!user) {
      setError("Please login to place your order.");
      return;
    }

    if (!form.customerName || !form.phone || !form.deliveryAddress) {
      setError("Please complete all checkout fields.");
      return;
    }

    try {
      setSubmitting(true);

      let orderId = "";

      if (form.paymentMethod === "online") {
        const stripeSession = await createStripeCheckoutSession({
          customerName: form.customerName,
          phone: form.phone,
          deliveryAddress: form.deliveryAddress,
          items,
        });

        await trackEvent("order_checkout_started", {
          payment_method: "online",
          total_amount: totalAmount,
        });

        localStorage.setItem(PENDING_ONLINE_ORDER_KEY, stripeSession.orderId);
        window.location.href = stripeSession.checkoutUrl;
        return;
      }

      orderId = await createOrder({
        userId: user.uid,
        items: items.map((item) => ({
          productId: item.productId,
          slug: item.slug,
          quantity: item.quantity,
          weight: item.weight,
        })),
        customerName: form.customerName,
        phone: form.phone,
        deliveryAddress: form.deliveryAddress,
      });

      await trackEvent("order_created", {
        payment_method: form.paymentMethod,
        total_amount: totalAmount,
      });

      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch {
      setError("Unable to place order right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <div className="py-4">
          <Container>
            <BackButton />
          </Container>
        </div>
        <PageHero
          badge="Checkout"
          title="Complete Your Order"
          subtitle="Enter delivery details and choose your payment method."
        />

        <section className="py-12 md:py-16">
          <Container className="max-w-2xl">
            <article className="rounded-2xl border border-[#efe4d6] bg-white p-8 text-center shadow-soft">
              <h2 className="font-heading text-3xl font-bold text-[#2b1f14]">Your cart is empty</h2>
              <p className="mt-3 text-sm text-[#5d554c]">
                Add premium rice products before proceeding to checkout.
              </p>
              <Link to="/products" className="mt-6 inline-block">
                <Button>Browse Products</Button>
              </Link>
            </article>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        badge="Checkout"
        title="Complete Your Order"
        subtitle="Enter delivery details and choose your payment method."
      />

      <section className="py-12 md:py-16">
        <Container className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft lg:col-span-2"
          >
            <h2 className="font-heading text-3xl font-bold text-[#2b1f14]">Delivery Details</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#7a6d5f]">
                  Customer Name
                </span>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-[#e8dfd1] px-4 text-sm outline-none focus:border-brand-red"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#7a6d5f]">
                  Phone Number
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-[#e8dfd1] px-4 text-sm outline-none focus:border-brand-red"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#7a6d5f]">
                  Delivery Address
                </span>
                <textarea
                  rows={4}
                  value={form.deliveryAddress}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#e8dfd1] p-4 text-sm outline-none focus:border-brand-red"
                />
              </label>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-green">Payment Option</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-[#e8dfd1] p-3 text-sm">
                  <input
                    type="radio"
                    checked={form.paymentMethod === "online"}
                    onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "online" }))}
                  />
                  Online Payment
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-[#e8dfd1] p-3 text-sm">
                  <input
                    type="radio"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "cod" }))}
                  />
                  Cash On Delivery
                </label>
              </div>
            </div>

            {error ? (
              <p className="mt-5 rounded-xl border border-[#f2d4d4] bg-[#fff5f5] px-4 py-3 text-sm text-[#9e2a2a]">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="mt-6 w-full" disabled={submitting || items.length === 0}>
              {submitting ? "Placing Order..." : "Confirm Order"}
            </Button>
          </form>

          <aside className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft">
            <h2 className="font-heading text-2xl font-bold text-[#2b1f14]">Order Summary</h2>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-sm">
                  <span className="max-w-[70%] text-[#5d554c]">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-[#2b1f14]">
                    ₹{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[#efe4d6] pt-4 text-sm">
              <div className="flex justify-between text-[#5d554c]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#5d554c]">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2b1f14]">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
};

export default CheckoutPage;
