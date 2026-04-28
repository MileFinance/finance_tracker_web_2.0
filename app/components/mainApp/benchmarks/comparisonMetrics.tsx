import { formatPercent } from "@/app/components/mainApp/mock/format";

type ComparisonMetricsProps = {
  metrics: {
    portfolio_return: number;
    benchmark_return: number;
    alpha: number;
    beta: number;
    portfolio_sharpe: number;
    benchmark_sharpe: number;
    correlation: number;
    tracking_error: number;
    information_ratio: number;
  } | null;
};

export default function ComparisonMetrics({ metrics }: ComparisonMetricsProps) {
  const valueOrNA = (value: string): string => (metrics ? value : "N/A");

  const cards = [
    { label: "Portfolio Return", value: valueOrNA(formatPercent(metrics?.portfolio_return ?? 0)) },
    { label: "Benchmark Return", value: valueOrNA(formatPercent(metrics?.benchmark_return ?? 0)) },
    { label: "Alpha", value: valueOrNA(formatPercent(metrics?.alpha ?? 0)) },
    { label: "Beta", value: valueOrNA((metrics?.beta ?? 0).toFixed(2)) },
    { label: "Portfolio Sharpe", value: valueOrNA((metrics?.portfolio_sharpe ?? 0).toFixed(2)) },
    { label: "Benchmark Sharpe", value: valueOrNA((metrics?.benchmark_sharpe ?? 0).toFixed(2)) },
    { label: "Correlation", value: valueOrNA((metrics?.correlation ?? 0).toFixed(2)) },
    { label: "Tracking Error", value: valueOrNA(formatPercent(metrics?.tracking_error ?? 0)) },
    { label: "Information Ratio", value: valueOrNA((metrics?.information_ratio ?? 0).toFixed(2)) },
  ];

  return (
    <section className="rounded-md bg-transparent border border-surface p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Comparison metrics</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Alpha and Risk Breakdown</h3>
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
