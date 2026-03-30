"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortfolioSnapshot } from "@/lib/api/types";

type Props = {
  snapshots30D: PortfolioSnapshot[];
  snapshots90D: PortfolioSnapshot[];
  snapshots365D: PortfolioSnapshot[];
  loading?: boolean;
  onRangeChange?: (range: "30D" | "90D" | "365D") => void;
};

const currency = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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

export default function PerformanceChart({ snapshots30D, snapshots90D, snapshots365D, loading, onRangeChange }: Props) {
  const [activeRange, setActiveRange] = useState<"30D" | "90D" | "365D">("30D");

  const snapshotsByRange = { "30D": snapshots30D, "90D": snapshots90D, "365D": snapshots365D };
  const data = snapshotsByRange[activeRange];

  const dateList = data.map((s) => s.date.slice(0, 10));
  const [fromDate, setFromDate] = useState(dateList[0] ?? "");
  const [toDate, setToDate] = useState(dateList[dateList.length - 1] ?? "");

  // Sync window when range or data changes
  useEffect(() => {
    const dates = data.map((s) => s.date.slice(0, 10));
    setFromDate(dates[0] ?? "");
    setToDate(dates[dates.length - 1] ?? "");
  }, [activeRange, data]);

  const filteredData = useMemo(() => {
    if (data.length === 0) return data;
    const next = data.filter((item) => item.date.slice(0, 10) >= fromDate && item.date.slice(0, 10) <= toDate);
    return next.length >= 2 ? next : data;
  }, [data, fromDate, toDate]);

  const firstVisibleIndex = data.findIndex((item) => item.date.slice(0, 10) === filteredData[0]?.date.slice(0, 10));
  const lastVisibleIndex = data.findIndex((item) => item.date.slice(0, 10) === filteredData[filteredData.length - 1]?.date.slice(0, 10));

  function shiftWindow(step: number) {
    const size = lastVisibleIndex - firstVisibleIndex;
    const nextStart = Math.min(Math.max(0, firstVisibleIndex + step), data.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromDate(data[nextStart].date.slice(0, 10));
    setToDate(data[nextEnd].date.slice(0, 10));
  }

  const portfolioValues = filteredData.map((item) => item.total_value);
  const all = [...portfolioValues];
  const min = all.length > 0 ? Math.min(...all) * 0.98 : 0;
  const max = all.length > 0 ? Math.max(...all) * 1.02 : 1;

  const width = 600;
  const height = 240;
  const portfolioPath = toPath(portfolioValues, width, height, min, max);

  const canGoBack = firstVisibleIndex > 0;
  const canGoForward = lastVisibleIndex < data.length - 1;

  return (
    <section className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-5">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Performance</p>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Value Trend</h3>
        </div>
        <div className="inline-flex rounded-xl border border-[#252545] bg-[#04040a] p-1 text-xs font-medium text-neutral-300">
          {(["30D", "90D", "365D"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => {
                setActiveRange(range);
                onRangeChange?.(range);
              }}
              className={`rounded-lg px-3 py-1 ${activeRange === range ? "bg-[#1e1e35] text-white" : "text-neutral-300"}`}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      {loading && data.length === 0 && (
        <p className="text-sm text-neutral-400">Loading chart&hellip;</p>
      )}

      {!loading && data.length === 0 && (
        <p className="text-sm text-neutral-500">No snapshots yet. Create a snapshot to start tracking performance.</p>
      )}

      {data.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="text-xs text-neutral-400">From</label>
            <select
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-lg border border-[#252545] bg-[#04040a] px-2 py-1 text-xs text-white"
            >
              {dateList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <label className="text-xs text-neutral-400">To</label>
            <select
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-lg border border-[#252545] bg-[#04040a] px-2 py-1 text-xs text-white"
            >
              {dateList.map((d) => (
                <option key={d} value={d}>{d}</option>
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

          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-[#252545] bg-[#04040a] p-2">
              <svg viewBox={`0 0 ${width} ${height}`} className="h-60 w-full min-w-140" role="img" aria-label="Portfolio line chart">
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
                <path d={portfolioPath} fill="none" stroke="#14b8a6" strokeWidth="3" />
              </svg>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-[#2dd4bf]" />Portfolio</span>
              {portfolioValues.length > 0 && (
                <span className="ml-auto text-neutral-400">Latest: {currency.format(portfolioValues[portfolioValues.length - 1])}</span>
              )}
            </div>

            {filteredData.length > 0 && (
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{filteredData[0].date.slice(0, 10)}</span>
                <span>{filteredData[filteredData.length - 1].date.slice(0, 10)}</span>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
