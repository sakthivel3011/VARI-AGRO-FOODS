import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { trackEvent } from "@/services/analytics";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Subscription", to: "/subscription" },
  { label: "Reviews", to: "/reviews" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, signIn, signOut } = useAuth();
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0e6d7] bg-white/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-red text-lg font-bold text-white">
            V
          </div>
          <div>
            <p className="font-heading text-xl font-bold leading-none text-[#2b1f14]">Vari Agro Foods</p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-brand-green">Premium Rice</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold text-[#4d4033] transition-colors hover:text-brand-red",
                  isActive && "text-brand-red",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/products"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#e8dfd1] text-[#4d4033] transition hover:border-brand-red hover:text-brand-red"
            aria-label="Browse products"
          >
            <Search size={18} />
          </Link>
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e8dfd1] text-[#4d4033] transition hover:border-brand-red hover:text-brand-red"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {totalQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            ) : null}
          </Link>
          <Link
            to="/admin/login"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#e8dfd1] text-[#4d4033] transition hover:border-brand-red hover:text-brand-red"
            title="Admin Login"
            aria-label="Admin login"
          >
            <span className="text-xs font-bold">⚙️</span>
          </Link>
          <Link
            to={isAdmin ? "/admin" : "/dashboard"}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#e8dfd1] text-[#4d4033] transition hover:border-brand-red hover:text-brand-red"
            aria-label={isAdmin ? "Open admin dashboard" : "Open user dashboard"}
          >
            <User size={18} />
          </Link>
          <AuthStatus />
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-[#e8dfd1] text-[#4d4033] lg:hidden"
          onClick={() => {
            setOpen((prev) => !prev);
            void trackEvent("mobile_nav_toggle");
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-[#f0e6d7] bg-white transition-all duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <Container className="flex flex-col gap-4 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn("text-sm font-semibold text-[#4d4033]", isActive && "text-brand-red")
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd1] px-4 py-2 text-sm"
            >
              <ShoppingCart size={16} /> Cart ({totalQuantity})
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd1] px-4 py-2 text-sm"
            >
              ⚙️ Admin
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd1] px-4 py-2 text-sm"
                >
                  <User size={16} /> Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="px-4 py-2"
                  onClick={async () => {
                    await signOut();
                    setOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                className="px-4 py-2"
                onClick={async () => {
                  await signIn();
                  setOpen(false);
                }}
              >
                Login
              </Button>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
};
