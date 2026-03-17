import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { useSeo } from "@/hooks/useSeo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useSeo({
    title: "Login | Vari Agro Foods",
    description: "Sign in to your Vari Agro Foods account",
    canonicalPath: "/login",
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signIn();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      // TODO: Implement email/password login when backend is ready
      setError("Email login coming soon. Use Google Sign-In for now.");
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
            <p className="mt-2 text-sm text-[#f7efe2]">Welcome back</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[#e8dfd1] bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
            <h2 className="font-heading text-2xl font-bold text-[#2b1f14] mb-6">
              Sign In
            </h2>

            {error && (
              <div className="mb-6 rounded-lg border border-brand-red bg-red-50 p-4 text-sm text-brand-red">
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-[#e8dfd1] bg-white px-4 py-3 font-semibold text-[#2b1f14] transition-all hover:bg-[#f9f6ef] disabled:opacity-60 mb-6"
            >
              {loading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>

            {/* Divider */}
            <div className="mb-6 flex items-center">
              <div className="flex-1 border-t border-[#e8dfd1]"></div>
              <span className="mx-2 text-xs text-[#7a6d5f]">or</span>
              <div className="flex-1 border-t border-[#e8dfd1]"></div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#2b1f14]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-[#7a6d5f]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-[#e8dfd1] bg-[#fdfbf7] py-2 pl-10 pr-4 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#2b1f14]">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-[#7a6d5f]" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#e8dfd1] bg-[#fdfbf7] py-2 pl-10 pr-4 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand-green py-2 font-semibold text-white transition-all hover:bg-opacity-90 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-[#7a6d5f]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-brand-green hover:text-opacity-80"
              >
                Sign up
              </Link>
            </p>

            <button className="mt-4 w-full rounded-lg border border-[#e8dfd1] py-2 text-sm text-[#7a6d5f] transition-colors hover:bg-[#f9f6ef]">
              Forgot password?
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
