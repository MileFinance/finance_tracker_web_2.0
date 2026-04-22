"use client";

import { useEffect, useMemo, useState } from "react";
import BenchmarkSelector from "@/app/components/mainApp/benchmarks/benchmarkSelector";
import ComparisonChart from "@/app/components/mainApp/benchmarks/comparisonChart";
import ComparisonMetrics from "@/app/components/mainApp/benchmarks/comparisonMetrics";
import AlphaBetaExplanation from "@/app/components/mainApp/benchmarks/alphaBetaExplanation";
import RiskMetricsTable from "@/app/components/mainApp/benchmarks/riskMetricsTable";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { useAnalytics } from "@/app/hooks/api/useAnalytics";
import { formatPercent } from "@/app/components/mainApp/mock/format";

const benchmarkOptions = [
  { symbol: "SPY", name: "S&P 500" },
  { symbol: "VOO", name: "Vanguard S&P 500" },
  { symbol: "QQQ", name: "Nasdaq 100" },
  { symbol: "VTI", name: "Total Stock Market" },
  { symbol: "ACWI", name: "MSCI All Country World" },
  { symbol: "IWDA", name: "MSCI World" },
];

function monthsToRange() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  return { from: from.toISOString(), to: to.toISOString() };
}

export default function BenchmarksView() {
  const { selectedPortfolioId } = usePortfolio();
  const { benchmark, loading, error, loadBenchmark } = useAnalytics();
  const [selectedBenchmark, setSelectedBenchmark] = useState("SPY");
  const fallbackRange = useMemo(() => monthsToRange(), []);

  useEffect(() => {
    if (!selectedPortfolioId) {
      return;
    }
    void loadBenchmark(selectedPortfolioId, selectedBenchmark, monthsToRange());
  }, [selectedPortfolioId, selectedBenchmark, loadBenchmark]);

  const chartLabels = benchmark
    ? [benchmark.start_date, benchmark.end_date]
    : [fallbackRange.from, fallbackRange.to];
  const chartPortfolio = benchmark ? [1, 1 + benchmark.portfolio_return] : [];
  const chartBenchmark = benchmark ? [1, 1 + benchmark.benchmark_return] : [];

  const metrics = useMemo(
    () =>
      benchmark
        ? {
            portfolio_return: benchmark.portfolio_return,
            benchmark_return: benchmark.benchmark_return,
            alpha: benchmark.alpha,
            beta: benchmark.beta,
            portfolio_sharpe: benchmark.portfolio_sharpe_ratio,
            benchmark_sharpe: benchmark.benchmark_sharpe_ratio,
            correlation: benchmark.correlation,
            tracking_error: benchmark.tracking_error,
            information_ratio: benchmark.information_ratio,
          }
        : null,
    [benchmark],
  );

  const riskRows = useMemo(
    () =>
      benchmark
        ? [
            {
              label: "Volatility",
              portfolio: formatPercent(benchmark.portfolio_volatility),
              benchmark: formatPercent(benchmark.benchmark_volatility),
            },
            {
              label: "Tracking Error",
              portfolio: formatPercent(benchmark.tracking_error),
              benchmark: "-",
            },
            {
              label: "Correlation",
              portfolio: benchmark.correlation.toFixed(2),
              benchmark: "1.00",
            },
            {
              label: "Information Ratio",
              portfolio: benchmark.information_ratio.toFixed(2),
              benchmark: "-",
            },
          ]
        : [],
    [benchmark],
  );

  return (
    <div className="w-full flex-1 overflow-y-auto bg-mainapp p-2 sm:p-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-md bg-transparent border border-surface p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Analytics</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Benchmark Comparison</h1>
        </header>

        {loading ? <p className="rounded-md bg-transparent border border-surface p-4 text-sm text-neutral-300">Loading benchmark comparison...</p> : null}
        {error ? <p className="rounded-md border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}
        {!loading && !error && !benchmark ? (
          <p className="rounded-md bg-transparent border border-surface p-4 text-sm text-neutral-300">
            Benchmark data is unavailable for the selected portfolio and period.
          </p>
        ) : null}

        <BenchmarkSelector
          options={benchmarkOptions}
          selected={selectedBenchmark}
          onSelect={setSelectedBenchmark}
        />

        {benchmark ? (
          <ComparisonChart
            labels={chartLabels}
            portfolio={chartPortfolio}
            benchmark={chartBenchmark}
            benchmarkSymbol={selectedBenchmark}
          />
        ) : null}

        <ComparisonMetrics metrics={metrics} />

        {benchmark ? (
          <section className="grid gap-4 xl:grid-cols-2">
            <RiskMetricsTable benchmarkSymbol={selectedBenchmark} rows={riskRows} />
            <AlphaBetaExplanation />
          </section>
        ) : null}
      </div>
    </div>
  );
}
