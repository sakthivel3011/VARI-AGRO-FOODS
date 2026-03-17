type ReviewModerationBadgeProps = {
  status: "pending" | "approved" | "rejected";
};

const statusClass: Record<ReviewModerationBadgeProps["status"], string> = {
  pending: "bg-[#fff4e1] text-[#8d5a0c] border-[#f3d8a6]",
  approved: "bg-[#edf9f1] text-[#216b42] border-[#c6e8d3]",
  rejected: "bg-[#fff1f1] text-[#9f2a2a] border-[#efc2c2]",
};

export const ReviewModerationBadge = ({ status }: ReviewModerationBadgeProps) => {
  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClass[status]}`}
    >
      {status}
    </span>
  );
};
