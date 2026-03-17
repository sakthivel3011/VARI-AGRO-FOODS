import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";

const adminLinks = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/analytics", label: "Analytics" },
];

export const AdminLayout = () => {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    // Clear admin password session
    localStorage.removeItem("adminSession");
    // Also try to sign out from Firebase if authenticated
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    // Redirect will be handled by AdminRoute
    window.location.href = "/admin/login";
  };

  return (
    <section className="py-10 md:py-14">
      <Container className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-2xl border border-[#efe4d6] bg-[#2a1b10] p-5 text-white shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5d48a]">Admin Panel</p>
          <h1 className="mt-2 font-heading text-2xl font-bold">{profile?.displayName ?? "Admin"}</h1>
          <p className="mt-1 text-sm text-[#e7d8c6]">{profile?.email}</p>

          <nav className="mt-6 space-y-1">
            {adminLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "block rounded-xl px-3 py-2 text-sm font-semibold text-[#f5ecdf] transition hover:bg-[#3a2818]",
                    isActive && "bg-[#4a321c] text-[#f8e0a3]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#4d3a2c] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#f5ecdf] transition hover:border-[#f8e0a3] hover:text-[#f8e0a3]"
          >
            <LogOut size={14} /> Logout
          </button>
        </aside>

        <div className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft md:p-8">
          <Outlet />
        </div>
      </Container>
    </section>
  );
};
