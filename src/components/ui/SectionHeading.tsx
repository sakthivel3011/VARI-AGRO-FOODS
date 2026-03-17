type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) => {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`} data-aos="fade-up">
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-bold leading-tight text-[#2b1f14] md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base text-[#5d554c]">{subtitle}</p> : null}
    </div>
  );
};
