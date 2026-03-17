import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useSeo } from "@/hooks/useSeo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const ProfilePage = () => {
  useSeo({
    title: "My Profile | Vari Agro Foods",
    description: "Manage profile details, cart snapshot, and account overview.",
    canonicalPath: "/dashboard",
  });

  const { profile } = useAuth();
  const { items, totalAmount } = useCart();

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">My Profile</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Welcome back</h2>
      <div className="mt-6 grid gap-4 rounded-2xl border border-[#efe4d6] bg-[#fffcf8] p-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a6d5f]">Name</p>
          <p className="mt-1 text-sm font-semibold text-[#2b1f14]">{profile?.displayName ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a6d5f]">Email</p>
          <p className="mt-1 text-sm font-semibold text-[#2b1f14]">{profile?.email ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a6d5f]">Role</p>
          <p className="mt-1 text-sm font-semibold capitalize text-[#2b1f14]">{profile?.role ?? "customer"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a6d5f]">Cart Items</p>
          <p className="mt-1 text-sm font-semibold text-[#2b1f14]">{items.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a6d5f]">Cart Total</p>
          <p className="mt-1 text-sm font-semibold text-[#2b1f14]">₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/dashboard/orders">
          <Button className="h-9 px-4">Track Orders</Button>
        </Link>
        <Link to="/dashboard/subscriptions">
          <Button variant="outline" className="h-9 px-4">
            Manage Subscriptions
          </Button>
        </Link>
        <Link to="/dashboard/addresses">
          <Button variant="secondary" className="h-9 px-4">
            Saved Addresses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
