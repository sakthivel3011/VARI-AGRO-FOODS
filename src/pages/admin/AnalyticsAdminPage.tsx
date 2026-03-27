import { useEffect, useMemo, useState } from "react";
import {
  getDailyOrdersRevenue,
  getTopProducts,
  getUserActivity,
  type DailyMetric,
  type TopProductMetric,
  type UserActivityMetric,
} from "@/services/adminAnalytics";
import { useSeo } from "@/hooks/useSeo";
import { demoDailyMetrics, demoTopProducts, demoUserActivity } from "@/data/adminDemoData";

const AnalyticsAdminPage = () => {
  useSeo({
    title: "Admin Analytics | Vari Agro Foods",
    description: "Daily orders, revenue trends, user activity, and top selling rice analytics dashboard.",
    canonicalPath: "/admin/analytics",
  });

  const [daily, setDaily] = useState<DailyMetric[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductMetric[]>([]);
  const [activity, setActivity] = useState<UserActivityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [dailyData, topData, userData] = await Promise.all([
          getDailyOrdersRevenue(14),
          getTopProducts(7),
          getUserActivity(14),
        ]);

        setDaily(dailyData);
        setTopProducts(topData.length === 0 ? demoTopProducts : topData);
        setActivity(userData.length === 0 ? demoUserActivity : userData);
        setStatusMessage(
          dailyData.length === 0 && topData.length === 0 && userData.length === 0
            ? "Showing sample analytics for review."
            : "",
        );
      } catch (error) {
        console.error("Failed to load analytics", error);
        setDaily(demoDailyMetrics);
        setTopProducts(demoTopProducts);
        setActivity(demoUserActivity);
        setStatusMessage("Live analytics unavailable. Showing sample data.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const ordersPeak = useMemo(() => Math.max(...daily.map((entry) => entry.orders), 1), [daily]);
  const revenuePeak = useMemo(() => Math.max(...daily.map((entry) => entry.revenue), 1), [daily]);
  const usersPeak = useMemo(() => Math.max(...activity.map((entry) => entry.activeUsers), 1), [activity]);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Analytics</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Performance Metrics</h2>

      {loading ? <p className="mt-4 text-sm text-[#5d554c]">Loading analytics charts...</p> : null}
      {statusMessage ? <p className="mt-3 text-sm text-[#5d554c]">{statusMessage}</p> : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Daily Orders</h3>
          <div className="mt-3 space-y-2">
            {daily.map((entry) => (
              <div key={entry.day}>
                <div className="mb-1 flex justify-between text-xs text-[#7a6d5f]">
                  <span>{entry.day}</span>
                  <span>{entry.orders}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f1e6d8]">
                  <div
                    className="h-2 rounded-full bg-brand-red"
                    style={{ width: `${Math.max((entry.orders / ordersPeak) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Revenue</h3>
          <div className="mt-3 space-y-2">
            {daily.map((entry) => (
              <div key={`rev-${entry.day}`}>
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Top Products</h3>
          <div className="mt-3 space-y-3">
            {topProducts.map((product) => (
              <div key={product.name} className="rounded-xl border border-[#f1e6d8] bg-[#fffdf9] p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#2b1f14]">{product.name}</span>
                  <span className="text-brand-red">{product.units} units</span>
                </div>
                <p className="mt-1 text-xs text-[#7a6d5f]">Revenue ₹{product.revenue.toLocaleString()}</p>
              </div>
            ))}
            {topProducts.length === 0 ? <p className="text-sm text-[#5d554c]">No data yet.</p> : null}
          </div>
        </article>

        <article className="rounded-2xl border border-[#efe4d6] bg-white p-5 shadow-soft">
          <h3 className="font-heading text-xl font-bold text-[#2b1f14]">User Activity</h3>
          <div className="mt-3 space-y-2">
            {activity.map((entry) => (
              <div key={entry.day}>
                <div className="mb-1 flex justify-between text-xs text-[#7a6d5f]">
                  <span>{entry.day}</span>
                  <span>{entry.activeUsers}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f1e6d8]">
                  <div
                    className="h-2 rounded-full bg-brand-gold"
                    style={{ width: `${Math.max((entry.activeUsers / usersPeak) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default AnalyticsAdminPage;
