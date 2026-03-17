type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export const QuantityInput = ({ value, onChange }: QuantityInputProps) => {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-[#e8dfd1]">
      <button
        type="button"
        className="h-9 w-9 text-lg text-[#5d554c] transition hover:bg-[#fff3e1]"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="grid h-9 min-w-10 place-items-center px-2 text-sm font-semibold text-[#2b1f14]">
        {value}
      </span>
      <button
        type="button"
        className="h-9 w-9 text-lg text-[#5d554c] transition hover:bg-[#fff3e1]"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};
