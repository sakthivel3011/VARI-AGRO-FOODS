import { useContext } from "react";
import { CartContext, type CartContextValue } from "@/context/cart-context";

export const useCart = (): CartContextValue => {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }

  return value;
};
