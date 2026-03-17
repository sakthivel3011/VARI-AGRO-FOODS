import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { QuantityInput } from "@/components/cart/QuantityInput";
import { useCart } from "@/hooks/useCart";
import { useSeo } from "@/hooks/useSeo";

const CartPage = () => {
  useSeo({
    title: "Your Cart | Vari Agro Foods",
    description: "Review selected rice products, update quantities, and continue to secure checkout.",
    canonicalPath: "/cart",
  });

  const {
    items,
    subtotal,
    deliveryCharge,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <>
      <div className="py-4">
        <Container>
          <BackButton />
        </Container>
      </div>
      <PageHero
        badge="Your Cart"
        title="Cart Summary"
        subtitle="Review selected items, update quantity, and continue to checkout."
      />

      <section className="py-12 md:py-16">
        <Container className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.length === 0 ? (
              <article className="rounded-2xl border border-[#efe4d6] bg-white p-7 shadow-soft">
                <h2 className="font-heading text-3xl font-bold text-[#2b1f14]">Your cart is empty</h2>
                <p className="mt-2 text-sm text-[#5d554c]">Add premium rice products to continue checkout.</p>
                <Link to="/products" className="mt-5 inline-block">
                  <Button>Browse Products</Button>
                </Link>
              </article>
            ) : (
              items.map((item) => (
                <article
                  key={item.cartItemId}
                  className="flex flex-col gap-4 rounded-2xl border border-[#efe4d6] bg-white p-4 shadow-soft md:flex-row"
                >
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <h2 className="font-semibold text-[#2b1f14]">{item.name}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                        {item.isSamplePack ? "Sample Pack" : item.weight}
                      </p>
                      <p className="mt-1 text-sm text-[#5d554c]">₹{item.unitPrice.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.cartItemId, value)}
                      />
                      <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full border border-[#e8dfd1] text-[#5d554c] transition hover:border-brand-red hover:text-brand-red"
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="rounded-2xl border border-[#efe4d6] bg-white p-6 shadow-soft">
            <h2 className="font-heading text-2xl font-bold text-[#2b1f14]">Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-[#5d554c]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
              </div>
              <div className="border-t border-[#efe4d6] pt-3 text-base font-bold text-[#2b1f14]">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {items.length > 0 ? (
              <Link to="/checkout" className="mt-6 block">
                <Button className="w-full">Checkout</Button>
              </Link>
            ) : (
              <div className="mt-6">
                <Button className="w-full" disabled>
                  Checkout
                </Button>
              </div>
            )}
            {items.length > 0 ? (
              <Button variant="outline" className="mt-3 w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            ) : null}
          </aside>
        </Container>
      </section>
    </>
  );
};

export default CartPage;
