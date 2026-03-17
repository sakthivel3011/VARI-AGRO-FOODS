import { StatCard } from "@/components/ui/StatCard";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import {
  getDailyOrdersRevenue,
  getOverviewMetrics,
  getTopProducts,
  getUserActivity,
  type DailyMetric,
  type TopProductMetric,
  type UserActivityMetric,
} from "@/services/adminAnalytics";

const OverviewPage = () => {
  useSeo({
    title: "Admin Overview | Vari Agro Foods",
    description: "Business overview with users, orders, revenue, top products, and daily performance metrics.",
    canonicalPath: "/admin",
  });

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topProductName, setTopProductName] = useState("N/A");
  const [daily, setDaily] = useState<DailyMetric[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductMetric[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivityMetric[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const [overview, dayStats, top, users] = await Promise.all([
          getOverviewMetrics(),
          getDailyOrdersRevenue(10),
          getTopProducts(5),
          getUserActivity(10),
        ]);

        setTotalUsers(overview.totalUsers);
        setTotalOrders(overview.totalOrders);
        setTotalRevenue(overview.totalRevenue);
        setTotalProducts(overview.totalProducts);
        setTopProductName(overview.topProductName);
        setDaily(dayStats);
        setTopProducts(top);
        setUserActivity(users);
      } catch (error) {
        console.error("Failed to load admin overview", error);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const dailyPeak = useMemo(() => {
    if (daily.length === 0) {
      return 1;
    }

    return Math.max(...daily.map((entry) => entry.orders), 1);
  }, [daily]);

  const revenuePeak = useMemo(() => {
    if (daily.length === 0) {
      return 1;
    }

    return Math.max(...daily.map((entry) => entry.revenue), 1);
  }, [daily]);

  const userPeak = useMemo(() => {
    if (userActivity.length === 0) {
      return 1;
    }

    return Math.max(...userActivity.map((entry) => entry.activeUsers), 1);
  }, [userActivity]);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Admin Overview</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Business Snapshot</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers.toLocaleString()} />
        <StatCard label="Total Orders" value={totalOrders.toLocaleString()} tone="success" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} tone="warning" />
        <StatCard label="Top Rice" value={topProductName} />
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-2xl font-bold text-[#2b1f14]">Daily Orders</h3>
          <div className="mt-4 space-y-2">
            {daily.map((entry) => (
              <div key={entry.day}>
                <div className="mb-1 flex justify-between text-xs text-[#7a6d5f]">
                  <span>{entry.day}</span>
                  <span>{entry.orders}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f1e6d8]">
                  <div
                    className="h-2 rounded-full bg-brand-red"
                    style={{ width: `${Math.max((entry.orders / dailyPeak) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-2xl font-bold text-[#2b1f14]">Revenue Trend</h3>
          <div className="mt-4 space-y-2">
            {daily.map((entry) => (
              <div key={`revenue-${entry.day}`}>
                <div className="mb-1 flex justify-between text-xs text-[#7a6d5f]">
                  <span>{entry.day}</span>
                  <span>₹{entry.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f1e6d8]">
                  <div
                    className="h-2 rounded-full bg-brand-green"
                    style={{ width: `${Math.max((entry.revenue / revenuePeak) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-2xl font-bold text-[#2b1f14]">Top Products</h3>
          <div className="mt-4 space-y-3">
            {topProducts.map((product) => (
              <div key={product.name} className="rounded-xl border border-[#f1e6d8] bg-[#fffdf9] p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#2b1f14]">{product.name}</span>
                  <span className="text-brand-red">{product.units} units</span>
                </div>
                <p className="mt-1 text-xs text-[#7a6d5f]">Revenue: ₹{product.revenue.toLocaleString()}</p>
              </div>
            ))}
            {topProducts.length === 0 ? (
              <p className="text-sm text-[#5d554c]">No top product data yet.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-2xl font-bold text-[#2b1f14]">User Activity</h3>
          <div className="mt-4 space-y-2">
            {userActivity.map((entry) => (
              <div key={entry.day}>
                <div className="mb-1 flex justify-between text-xs text-[#7a6d5f]">
                  <span>{entry.day}</span>
                  <span>{entry.activeUsers} active</span>
                </div>
                <div className="h-2 rounded-full bg-[#f1e6d8]">
                  <div
                    className="h-2 rounded-full bg-brand-gold"
                    style={{ width: `${Math.max((entry.activeUsers / userPeak) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-7 rounded-2xl border border-[#efe4d6] bg-[#fffdf9] p-4">
        <p className="text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">Quick Admin Actions</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link to="/admin/products" className="rounded-full border border-[#e8dfd1] px-3 py-1 text-[#5d554c]">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="rounded-full border border-[#e8dfd1] px-3 py-1 text-[#5d554c]">
            Update Orders
          </Link>
          <Link to="/admin/reviews" className="rounded-full border border-[#e8dfd1] px-3 py-1 text-[#5d554c]">
            Moderate Reviews
          </Link>
          <Link to="/admin/messages" className="rounded-full border border-[#e8dfd1] px-3 py-1 text-[#5d554c]">
            Moderate Chat
          </Link>
        </div>
      </div>

      {loading ? <p className="mt-5 text-sm text-[#7a6d5f]">Loading analytics...</p> : null}
      <p className="mt-4 text-xs uppercase tracking-[0.11em] text-[#7a6d5f]">
        Products in catalog: {totalProducts.toLocaleString()}
      </p>
    </div>
  );
};

export default OverviewPage;
