import { useEffect, useState } from "react";
import { getAllUsers, type UserRecord } from "@/services/users";
import { getAllOrders, type OrderRecord } from "@/services/orders";
import { useSeo } from "@/hooks/useSeo";
import { demoOrders, demoUsers } from "@/data/adminDemoData";

const CustomerManagementPage = () => {
  useSeo({
    title: "Admin Customers | Vari Agro Foods",
    description: "Customer purchase history, order count, and lifetime spend insights.",
    canonicalPath: "/admin/customers",
  });

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [userItems, orderItems] = await Promise.all([getAllUsers(300), getAllOrders(900)]);
        const useDemo = userItems.length === 0 && orderItems.length === 0;
        setUsers(useDemo ? demoUsers : userItems);
        setOrders(useDemo ? demoOrders : orderItems);
        setStatusMessage(useDemo ? "Showing sample customer insights for review." : "");
      } catch (error) {
        console.error("Failed to load customer management data", error);
        setUsers(demoUsers);
        setOrders(demoOrders);
        setStatusMessage("Live customer data unavailable. Showing sample data.");
      }
    };

    void run();
  }, []);

  const stats = new Map<string, { count: number; spend: number }>();
  orders.forEach((entry) => {
    const uid = entry.data.userId;
    const current = stats.get(uid) ?? { count: 0, spend: 0 };
    current.count += 1;
    current.spend += entry.data.total;
    stats.set(uid, current);
  });

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Customer Management</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Purchase History Insights</h2>

      <div className="mt-5 space-y-3">
        {statusMessage ? <p className="text-sm text-[#5d554c]">{statusMessage}</p> : null}
        {users.map((user) => {
          const userStats = stats.get(user.id) ?? { count: 0, spend: 0 };

          return (
            <article key={user.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#2b1f14]">{user.data.displayName}</p>
                <span className="rounded-full border border-[#e8dfd1] px-2 py-1 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                  {user.data.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#5d554c]">{user.data.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                Orders: {userStats.count} · Lifetime Spend: ₹{userStats.spend.toLocaleString()}
              </p>
            </article>
          );
        })}

        {users.length === 0 ? <p className="text-sm text-[#5d554c]">No customer records available.</p> : null}
      </div>
    </div>
  );
};

export default CustomerManagementPage;
