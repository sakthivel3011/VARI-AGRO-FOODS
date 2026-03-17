import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { initAnalytics } from "@/config/firebase";

export const AppProviders = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    AOS.init({
      duration: 650,
      once: true,
      easing: "ease-out-cubic",
      offset: 40,
    });

    void initAnalytics();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
};
