type BenchmarkSelectorProps = {
  options: string[];
  selected: string;
  onSelect: (symbol: string) => void;
};

export default function BenchmarkSelector({ options, selected, onSelect }: BenchmarkSelectorProps) {
  return (
    <section className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-4">
      <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Benchmark selector</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((symbol) => (
          <button
            type="button"
            key={symbol}
            onClick={() => onSelect(symbol)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              selected === symbol
                ? "border-[#14b8a6]/40 bg-[#14b8a6]/10 text-[#2dd4bf]"
                : "border-[#252545] bg-[#04040a] text-neutral-300"
            }`}
          >
            {symbol}
          </button>
        ))}
      </div>
    </section>
  );
}
