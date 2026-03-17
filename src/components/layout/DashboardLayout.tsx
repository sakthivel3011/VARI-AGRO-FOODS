import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";

const dashboardLinks = [
  { to: "/dashboard", label: "My Profile" },
  { to: "/dashboard/orders", label: "My Orders" },
  { to: "/dashboard/history", label: "Order History" },
  { to: "/dashboard/subscriptions", label: "Subscriptions" },
  { to: "/dashboard/addresses", label: "Saved Addresses" },
];

export const DashboardLayout = () => {
  const { profile, signOut } = useAuth();

  return (
    <section className="py-10 md:py-14">
      <Container className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Dashboard</p>
          <h1 className="mt-2 font-heading text-2xl font-bold text-[#2b1f14]">{profile?.displayName ?? "My Account"}</h1>
          <p className="mt-1 text-sm text-[#5d554c]">{profile?.email}</p>

          <nav className="mt-6 space-y-1">
            {dashboardLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "block rounded-xl px-3 py-2 text-sm font-semibold text-[#5d554c] transition hover:bg-[#fff4e4]",
                    isActive && "bg-[#fff0db] text-brand-red",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e8dfd1] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#5d554c] transition hover:border-brand-red hover:text-brand-red"
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
