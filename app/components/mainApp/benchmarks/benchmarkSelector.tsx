type BenchmarkSelectorProps = {
  options: Array<{
    symbol: string;
    name: string;
  }>;
  selected: string;
  onSelect: (symbol: string) => void;
};

export default function BenchmarkSelector({ options, selected, onSelect }: BenchmarkSelectorProps) {
  return (
    <section className="rounded-md bg-transparent border border-surface p-4">
      <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Benchmark selector</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option.symbol}
            onClick={() => onSelect(option.symbol)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              selected === option.symbol
                ? "border-[#14b8a6]/40 bg-[#14b8a6]/10 text-[#2dd4bf]"
                : "bg-transparent border border-surface text-neutral-300"
            }`}
            title={option.name}
          >
            {option.symbol} <span className="text-neutral-400">({option.name})</span>
          </button>
        ))}
      </div>
    </section>
  );
}
