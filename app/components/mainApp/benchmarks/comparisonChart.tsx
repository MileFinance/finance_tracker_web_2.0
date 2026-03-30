"use client";

import { useMemo, useState } from "react";

type ComparisonChartProps = {
  labels: string[];
  portfolio: number[];
  benchmark: number[];
  benchmarkSymbol: string;
};

function toPath(values: number[], width: number, height: number, min: number, max: number) {
  if (values.length === 0) return "";
  const range = Math.max(max - min, 1);
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function ComparisonChart({ labels, portfolio, benchmark, benchmarkSymbol }: ComparisonChartProps) {
  const [fromLabel, setFromLabel] = useState(labels[0]);
  const [toLabel, setToLabel] = useState(labels[labels.length - 1]);

  const filtered = useMemo(() => {
    const fromIdx = labels.indexOf(fromLabel);
    const toIdx = labels.indexOf(toLabel);
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const filteredLabels = labels.slice(start, end + 1);
    const filteredPortfolio = portfolio.slice(start, end + 1);
    const filteredBenchmark = benchmark.slice(start, end + 1);

    if (filteredLabels.length >= 2) {
      return { filteredLabels, filteredPortfolio, filteredBenchmark, start, end };
    }

    return {
      filteredLabels: labels,
      filteredPortfolio: portfolio,
      filteredBenchmark: benchmark,
      start: 0,
      end: labels.length - 1,
    };
  }, [labels, portfolio, benchmark, fromLabel, toLabel]);

  function shiftWindow(step: number) {
    const size = filtered.end - filtered.start;
    const nextStart = Math.min(Math.max(0, filtered.start + step), labels.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromLabel(labels[nextStart]);
    setToLabel(labels[nextEnd]);
  }

  const width = 640;
  const height = 220;
  const min = Math.min(...filtered.filteredPortfolio, ...filtered.filteredBenchmark) * 0.99;
  const max = Math.max(...filtered.filteredPortfolio, ...filtered.filteredBenchmark) * 1.01;

  const portfolioPath = toPath(filtered.filteredPortfolio, width, height, min, max);
  const benchmarkPath = toPath(filtered.filteredBenchmark, width, height, min, max);

  const canGoBack = filtered.start > 0;
  const canGoForward = filtered.end < labels.length - 1;

  return (
    <section className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Cumulative returns</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio vs {benchmarkSymbol}</h3>
      </header>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-400">From</label>
        <select
          value={fromLabel}
          onChange={(event) => setFromLabel(event.target.value)}
          className="rounded-lg border border-[#252545] bg-[#04040a] px-2 py-1 text-xs text-white"
        >
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <label className="text-xs text-neutral-400">To</label>
        <select
          value={toLabel}
          onChange={(event) => setToLabel(event.target.value)}
          className="rounded-lg border border-[#252545] bg-[#04040a] px-2 py-1 text-xs text-white"
        >
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => shiftWindow(-1)}
          disabled={!canGoBack}
          className="ml-auto rounded-lg border border-[#252545] bg-[#04040a] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => shiftWindow(1)}
          disabled={!canGoForward}
          className="rounded-lg border border-[#252545] bg-[#04040a] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#252545] bg-[#04040a] p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full min-w-140" role="img" aria-label="Benchmark comparison chart">
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              x2={width}
              y1={(height * ratio).toFixed(2)}
              y2={(height * ratio).toFixed(2)}
              stroke="#1e1e35"
              strokeWidth="1"
            />
          ))}
          <path d={benchmarkPath} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" />
          <path d={portfolioPath} fill="none" stroke="#14b8a6" strokeWidth="3" />
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
        <span>{filtered.filteredLabels[0]}</span>
        <span>{filtered.filteredLabels[filtered.filteredLabels.length - 1]}</span>
      </div>
    </section>
  );
}
