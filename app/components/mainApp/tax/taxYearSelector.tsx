type TaxYearSelectorProps = {
  years: number[];
  selected: number;
  onSelect: (year: number) => void;
};

export default function TaxYearSelector({ years, selected, onSelect }: TaxYearSelectorProps) {
  return (
    <section className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-4">
      <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Tax year</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {years.map((year) => (
          <button
            type="button"
            key={year}
            onClick={() => onSelect(year)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              selected === year
                ? "border-[#14b8a6]/40 bg-[#14b8a6]/10 text-[#2dd4bf]"
                : "border-[#252545] bg-[#04040a] text-neutral-300"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </section>
  );
}
