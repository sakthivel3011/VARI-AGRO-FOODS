import { createContext } from "react";
import type { CartItem, CatalogProduct } from "@/types/product";

export type AddToCartPayload = {
  product: CatalogProduct;
  quantity?: number;
  weight?: string;
  isSamplePack?: boolean;
};

export type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  addToCart: (payload: AddToCartPayload) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
