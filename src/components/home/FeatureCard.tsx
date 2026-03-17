import { cn } from "@/utils/cn";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
  className?: string;
};

export const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  return (
    <article
      className={cn(
        "rounded-2xl border border-[#efe4d6] bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
      data-aos="fade-up"
    >
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="font-heading text-xl font-semibold text-[#2b1f14]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5d554c]">{description}</p>
    </article>
  );
};
