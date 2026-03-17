import {
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { CartItem } from "@/types/product";
import {
  CartContext,
  type AddToCartPayload,
  type CartContextValue,
} from "@/context/cart-context";

const createCartItemId = (productId: string, weight: string, isSamplePack: boolean): string => {
  return `${productId}-${weight}-${isSamplePack ? "sample" : "regular"}`;
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = ({ product, quantity = 1, weight, isSamplePack = false }: AddToCartPayload) => {
    const selectedWeight = isSamplePack ? "1kg-sample" : weight ?? product.weightOptions[0] ?? "1kg";
    const cartItemId = createCartItemId(product.id, selectedWeight, isSamplePack);

    setItems((previous) => {
      const existing = previous.find((item) => item.cartItemId === cartItemId);

      if (existing) {
        return previous.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      const next: CartItem = {
        cartItemId,
        productId: product.id,
        slug: product.slug,
        name: isSamplePack ? `${product.name} (Sample Pack)` : product.name,
        image: product.images[0],
        unitPrice: isSamplePack ? product.samplePrice : product.price,
        quantity,
        weight: selectedWeight,
        isSamplePack,
      };

      return [...previous, next];
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setItems((previous) =>
      previous
        .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((previous) => previous.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  const deliveryCharge = subtotal === 0 || subtotal >= 1200 ? 0 : 99;
  const totalAmount = subtotal + deliveryCharge;

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity,
      subtotal,
      deliveryCharge,
      totalAmount,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, totalQuantity, subtotal, deliveryCharge, totalAmount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
