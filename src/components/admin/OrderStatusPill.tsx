type OrderStatusPillProps = {
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
};

const statusClass: Record<OrderStatusPillProps["status"], string> = {
  placed: "bg-[#fff4e1] text-[#8d5a0c] border-[#f3d8a6]",
  processing: "bg-[#edf5ff] text-[#1d4f90] border-[#c9ddf8]",
  shipped: "bg-[#eef4ff] text-[#2e499a] border-[#c8d7fb]",
  delivered: "bg-[#edf9f1] text-[#216b42] border-[#c6e8d3]",
  cancelled: "bg-[#fff1f1] text-[#9f2a2a] border-[#efc2c2]",
};

export const OrderStatusPill = ({ status }: OrderStatusPillProps) => {
  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClass[status]}`}
    >
      {status}
    </span>
  );
};
