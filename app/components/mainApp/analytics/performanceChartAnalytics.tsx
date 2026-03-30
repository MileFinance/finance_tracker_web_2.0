"use client";

import { useMemo, useState } from "react";

type PerformanceChartAnalyticsProps = {
  snapshots: Array<{
    date: string;
    total_value: number;
  }>;
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

export default function PerformanceChartAnalytics({ snapshots }: PerformanceChartAnalyticsProps) {
  const [fromDate, setFromDate] = useState(snapshots[0].date);
  const [toDate, setToDate] = useState(snapshots[snapshots.length - 1].date);

  const filtered = useMemo(() => {
    const next = snapshots.filter((item) => item.date >= fromDate && item.date <= toDate);
    return next.length >= 2 ? next : snapshots;
  }, [fromDate, toDate, snapshots]);

  const firstVisibleIndex = snapshots.findIndex((item) => item.date === filtered[0].date);
  const lastVisibleIndex = snapshots.findIndex((item) => item.date === filtered[filtered.length - 1].date);

  function shiftWindow(step: number) {
    const size = lastVisibleIndex - firstVisibleIndex;
    const nextStart = Math.min(Math.max(0, firstVisibleIndex + step), snapshots.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromDate(snapshots[nextStart].date);
    setToDate(snapshots[nextEnd].date);
  }

  const values = filtered.map((item) => item.total_value);
  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;

  const width = 640;
  const height = 220;
  const valuePath = toPath(values, width, height, min, max);
  const canGoBack = firstVisibleIndex > 0;
  const canGoForward = lastVisibleIndex < snapshots.length - 1;

  return (
    <section className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Performance curve</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Growth Over Time</h3>
      </header>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-400">From</label>
        <select
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="rounded-lg border border-[#252545] bg-[#04040a] px-2 py-1 text-xs text-white"
        >
          {snapshots.map((item) => (
            <option key={item.date} value={item.date}>
              {item.date}
            </option>
          ))}
        </select>
        <label className="text-xs text-neutral-400">To</label>
        <select
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="rounded-lg border border-[#252545] bg-[#04040a] px-2 py-1 text-xs text-white"
        >
          {snapshots.map((item) => (
            <option key={item.date} value={item.date}>
              {item.date}
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
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full min-w-140" role="img" aria-label="Analytics line chart">
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
          <path d={valuePath} fill="none" stroke="#14b8a6" strokeWidth="3" />
        </svg>
      </div>
    </section>
  );
}
