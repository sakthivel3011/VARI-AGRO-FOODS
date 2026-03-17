import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

type PageHeroProps = {
  title: string;
  subtitle: string;
  badge?: string;
  actions?: ReactNode;
};

export const PageHero = ({ title, subtitle, badge, actions }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden border-b border-[#f0e6d7] bg-white">
      <div className="absolute inset-0 bg-gold-glow" />
      <Container className="relative z-10 py-14 md:py-20">
        {badge ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">{badge}</p>
        ) : null}
        <h1 className="font-heading text-4xl font-bold text-[#2b1f14] md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5d554c] md:text-base">{subtitle}</p>
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </section>
  );
};
