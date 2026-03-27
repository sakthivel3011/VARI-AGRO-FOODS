import { useEffect, useState } from "react";
import { getAllUsers, type UserRecord } from "@/services/users";
import { useSeo } from "@/hooks/useSeo";
import { demoUsers } from "@/data/adminDemoData";

const UsersAdminPage = () => {
  useSeo({
    title: "Admin Users | Vari Agro Foods",
    description: "View registered users and profile roles in Vari Agro Foods admin panel.",
    canonicalPath: "/admin/users",
  });

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const userRecords = await getAllUsers(300);
        if (userRecords.length === 0) {
          setUsers(demoUsers);
          setStatusMessage("Showing sample users for review.");
        } else {
          setUsers(userRecords);
          setStatusMessage("");
        }
      } catch (error) {
        console.error("Failed to load users", error);
        setUsers(demoUsers);
        setStatusMessage("Live users unavailable. Showing sample data.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">User Directory</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Users</h2>

      {loading ? (
        <p className="mt-4 rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4 text-sm text-[#5d554c]">
          Loading users...
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {statusMessage ? <p className="text-sm text-[#5d554c]">{statusMessage}</p> : null}
          {users.map((user) => (
            <article key={user.id} className="rounded-xl border border-[#efe4d6] bg-[#fffcf8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#2b1f14]">{user.data.displayName}</p>
                <span className="rounded-full border border-[#e8dfd1] px-2 py-1 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                  {user.data.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#5d554c]">{user.data.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">UID: {user.data.uid}</p>
            </article>
          ))}

          {users.length === 0 ? <p className="text-sm text-[#5d554c]">No users found.</p> : null}
        </div>
      )}
    </div>
  );
};

export default UsersAdminPage;
