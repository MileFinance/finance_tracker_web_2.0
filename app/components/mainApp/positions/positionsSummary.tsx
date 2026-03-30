import { eur, formatPercent } from "@/app/components/mainApp/mock/format";

type PositionsSummaryProps = {
  summary: {
    total_cost: number;
    total_value: number;
    total_gain: number;
    total_gain_percent: number;
  };
};

export default function PositionsSummary({ summary }: PositionsSummaryProps) {
  return (
    <section className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Positions summary</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Current Holdings Snapshot</h2>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[#252545] bg-[#04040a] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total Cost</p>
          <p className="mt-2 text-2xl font-black text-white">{eur.format(summary.total_cost)}</p>
        </article>
        <article className="rounded-2xl border border-[#252545] bg-[#04040a] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total Value</p>
          <p className="mt-2 text-2xl font-black text-white">{eur.format(summary.total_value)}</p>
        </article>
        <article className="rounded-2xl border border-[#14b8a6]/30 bg-[#04040a] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total Gain</p>
          <p className="mt-2 text-2xl font-black text-[#2dd4bf]">{eur.format(summary.total_gain)}</p>
          <p className="text-sm text-[#2dd4bf]">{formatPercent(summary.total_gain_percent)}</p>
        </article>
      </div>
    </section>
  );
}
