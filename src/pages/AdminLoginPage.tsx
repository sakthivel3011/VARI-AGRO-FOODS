import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BackButton } from "@/components/ui/BackButton";
import { useSeo } from "@/hooks/useSeo";

const AdminLoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_PASSWORD = "3698";

  useSeo({
    title: "Admin Login | Vari Agro Foods",
    description: "Admin access",
    canonicalPath: "/admin/login",
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (!password) {
        setError("Please enter the admin password");
        return;
      }

      if (password === ADMIN_PASSWORD) {
        // Store admin session in localStorage
        localStorage.setItem("adminSession", JSON.stringify({
          authenticated: true,
          timestamp: new Date().getTime(),
        }));
        // Redirect to admin panel
        setTimeout(() => navigate("/admin"), 300);
      } else {
        setError("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f1307]/90 via-[#31180b]/85 to-[#2b1f14]/80" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center py-12">
        <div className="absolute top-8 left-0 right-0 px-4">
          <BackButton />
        </div>
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <h1 className="font-heading text-4xl font-bold text-white">
              Vari Agro
            </h1>
            <p className="mt-2 text-sm text-[#f7efe2]">Admin Access</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[#e8dfd1] bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
            <h2 className="font-heading text-2xl font-bold text-[#2b1f14] mb-6">
              Admin Login
            </h2>

            {error && (
              <div className="mb-6 rounded-lg border border-brand-red bg-red-50 p-4 text-sm text-brand-red">
                {error}
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#2b1f14]">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-[#7a6d5f]" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-[#e8dfd1] bg-[#fdfbf7] py-2 pl-10 pr-4 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-green py-2 font-semibold text-white transition-all hover:bg-opacity-90 disabled:opacity-60"
              >
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? "Verifying..." : "Access Admin Panel"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-[#7a6d5f]">
              Restricted access. Authorized personnel only.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminLoginPage;
