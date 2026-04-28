import { formatPercent } from "@/app/components/mainApp/mock/format";

type PerformanceMetricsProps = {
  metrics: {
    total_return: number;
    annualized_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
    ytd_return: number;
  } | null;
};

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const valueOrNA = (value: string): string => (metrics ? value : "N/A");

  const cards = [
    { label: "Total Return", value: valueOrNA(formatPercent(metrics?.total_return ?? 0)) },
    { label: "Annualized Return", value: valueOrNA(formatPercent(metrics?.annualized_return ?? 0)) },
    { label: "Volatility", value: valueOrNA(formatPercent(metrics?.volatility ?? 0)) },
    { label: "Sharpe Ratio", value: valueOrNA((metrics?.sharpe_ratio ?? 0).toFixed(2)) },
    { label: "Max Drawdown", value: valueOrNA(formatPercent(metrics?.max_drawdown ?? 0)) },
    { label: "YTD Return", value: valueOrNA(formatPercent(metrics?.ytd_return ?? 0)) },
  ];

  return (
    <section className="rounded-md bg-transparent border border-surface p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Metrics</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Risk and Return Metrics</h3>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-md bg-transparent border border-surface p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
