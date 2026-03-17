import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { addUserAddress, getUserAddresses } from "@/services/users";
import type { UserAddress } from "@/types/firestore";
import { useSeo } from "@/hooks/useSeo";

type AddressInput = {
  label: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
};

const AddressesPage = () => {
  useSeo({
    title: "Saved Addresses | Vari Agro Foods",
    description: "Manage saved delivery addresses for faster checkout and order fulfillment.",
    canonicalPath: "/dashboard/addresses",
  });

  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState<AddressInput>({
    label: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) {
        setAddresses([]);
        setLoading(false);
        return;
      }

      try {
        const list = await getUserAddresses(user.uid);
        setAddresses(list);
      } catch (error) {
        console.error("Failed to load addresses", error);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadAddresses();
  }, [user]);

  const addAddress = async () => {
    setStatus("");

    if (!user) {
      setStatus("Please login to save addresses.");
      return;
    }

    if (!form.label || !form.line1 || !form.city || !form.state || !form.postalCode) {
      setStatus("Please complete all address fields.");
      return;
    }

    try {
      const next = await addUserAddress(user.uid, {
        label: form.label,
        line1: form.line1,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: "India",
      });

      setAddresses(next);
      setForm({ label: "", line1: "", city: "", state: "", postalCode: "" });
      setStatus("Address saved.");
    } catch (error) {
      console.error("Failed to save address", error);
      setStatus("Unable to save address right now.");
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Saved Addresses</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Delivery Locations</h2>

      <article className="mt-5 rounded-2xl border border-[#efe4d6] bg-[#fffcf8] p-4">
        <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Add Address</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">Label</span>
            <input
              value={form.label}
              onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
              placeholder="Home / Office"
              className="h-10 w-full rounded-lg border border-[#e8dfd1] px-3 text-sm"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">Address Line</span>
            <input
              value={form.line1}
              onChange={(event) => setForm((prev) => ({ ...prev, line1: event.target.value }))}
              placeholder="Street, building, area"
              className="h-10 w-full rounded-lg border border-[#e8dfd1] px-3 text-sm"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">City</span>
            <input
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              placeholder="City"
              className="h-10 w-full rounded-lg border border-[#e8dfd1] px-3 text-sm"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">State</span>
            <input
              value={form.state}
              onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
              placeholder="State"
              className="h-10 w-full rounded-lg border border-[#e8dfd1] px-3 text-sm"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">Postal Code</span>
            <input
              value={form.postalCode}
              onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
              placeholder="Postal code"
              className="h-10 w-full rounded-lg border border-[#e8dfd1] px-3 text-sm"
            />
          </label>
        </div>
        <Button className="mt-3 h-9 px-4" onClick={() => void addAddress()}>
          Save Address
        </Button>
        {status ? <p className="mt-2 text-sm text-[#5d554c]">{status}</p> : null}
      </article>

      <article className="mt-6 rounded-2xl border border-[#efe4d6] bg-white p-4 shadow-soft">
        <h3 className="font-heading text-xl font-bold text-[#2b1f14]">My Addresses</h3>
        <div className="mt-3 space-y-3">
          {loading ? <p className="text-sm text-[#5d554c]">Loading addresses...</p> : null}
          {addresses.map((address, index) => (
            <div key={`${address.label}-${index}`} className="rounded-xl border border-[#f1e6d8] bg-[#fffdf9] p-3">
              <p className="font-semibold text-[#2b1f14]">{address.label}</p>
              <p className="mt-1 text-sm text-[#5d554c]">
                {address.line1}, {address.city}, {address.state} - {address.postalCode}
              </p>
            </div>
          ))}
          {!loading && addresses.length === 0 ? (
            <p className="text-sm text-[#5d554c]">No saved addresses yet.</p>
          ) : null}
        </div>
      </article>
    </div>
  );
};

export default AddressesPage;
