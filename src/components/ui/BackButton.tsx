import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";

type BackButtonProps = {
  className?: string;
  label?: string;
};

export const BackButton = ({ className, label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#e8dfd1] bg-white px-4 py-2 text-sm font-semibold text-[#2b1f14] transition-all hover:border-brand-green hover:bg-brand-cream hover:text-brand-green",
        className,
      )}
      title="Go back"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};
