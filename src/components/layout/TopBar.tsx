import { Leaf } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="border-b border-[#eee3d3] bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium text-[#5d554c] sm:px-6 lg:px-8">
        <Leaf size={14} className="text-brand-green" />
        Organic rice direct from trusted farmers across India.
      </div>
    </div>
  );
};
