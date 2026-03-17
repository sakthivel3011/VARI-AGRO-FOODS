import { UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export const AuthStatus = () => {
  const { user, profile, loading, isAuthenticated, signOut } = useAuth();

  if (loading) {
    return (
      <div className="inline-flex h-10 items-center rounded-full border border-[#e8dfd1] px-4 text-xs text-[#5d554c]">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="hidden lg:inline-flex">
        <Button variant="secondary">Login</Button>
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link
        to={profile?.role === "admin" ? "/admin" : "/dashboard"}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e8dfd1] bg-white px-4 text-xs font-semibold text-[#4d4033]"
      >
        <UserCircle2 size={16} />
        {user?.displayName ?? profile?.displayName ?? "My Account"}
      </Link>
      <Button variant="outline" onClick={signOut} className="h-10 px-4 text-xs">
        Logout
      </Button>
    </div>
  );
};
