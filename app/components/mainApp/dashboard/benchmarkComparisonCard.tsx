import type { BenchmarkComparison } from "@/lib/api/types";
import { SkeletonCard } from "@/app/components/ui/skeleton";

type Props = {
  comparison: BenchmarkComparison | null;
  loading?: boolean;
};

export default function BenchmarkComparisonCard({ comparison, loading }: Props) {
  const label = comparison ? `Portfolio vs ${comparison.benchmark_name || comparison.benchmark_symbol}` : "Portfolio vs Benchmark";

  return (
    <section className="rounded-md  bg-transparent border border-surface p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Benchmark comparison</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">{label}</h3>
      </header>

      {loading && !comparison && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !comparison && (
        <p className="text-sm text-neutral-500">Benchmark data unavailable.</p>
      )}

      {comparison && (
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-md bg-transparent border border-surface p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Portfolio Return</p>
            <p className={`mt-2 text-2xl font-semibold ${comparison.portfolio_return >= 0 ? "text-[#2dd4bf]" : "text-rose-300"}`}>
              {comparison.portfolio_return >= 0 ? "+" : ""}{(comparison.portfolio_return * 100).toFixed(1)}%
            </p>
          </article>
          <article className="rounded-md bg-transparent border border-surface p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{comparison.benchmark_symbol} Return</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {comparison.benchmark_return >= 0 ? "+" : ""}{(comparison.benchmark_return * 100).toFixed(1)}%
            </p>
          </article>
          <article className="rounded-md bg-transparent border border-surface p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Alpha</p>
            <p className={`mt-2 text-2xl font-semibold ${comparison.alpha >= 0 ? "text-[#2dd4bf]" : "text-rose-300"}`}>
              {comparison.alpha >= 0 ? "+" : ""}{comparison.alpha.toFixed(2)}
            </p>
          </article>
          <article className="rounded-md bg-transparent border border-surface p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Beta</p>
            <p className="mt-2 text-2xl font-semibold text-white">{comparison.beta.toFixed(2)}</p>
          </article>
        </div>
      )}
    </section>
  );
}
