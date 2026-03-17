type StatCardProps = {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning";
};

export const StatCard = ({ label, value, tone = "neutral" }: StatCardProps) => {
  const toneClass =
    tone === "success"
      ? "border-[#d4eadf] bg-[#f3fbf7]"
      : tone === "warning"
        ? "border-[#f1e1b8] bg-[#fff9ea]"
        : "border-[#efe4d6] bg-white";

  return (
    <article className={`rounded-2xl border p-5 shadow-soft ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a6d5f]">{label}</p>
      <p className="mt-3 font-heading text-3xl font-bold text-[#2b1f14]">{value}</p>
    </article>
  );
};
