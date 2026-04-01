"use client";

import { useEffect, useRef, useState } from "react";

type TradingSeriesType = "line" | "area" | "histogram";

type TradingSeriesPoint = {
  time: string;
  value: number;
};

type TradingSeries = {
  id: string;
  type: TradingSeriesType;
  color: string;
  name?: string;
  data: TradingSeriesPoint[];
  lineWidth?: 1 | 2 | 3 | 4;
  lineStyle?: "solid" | "dotted" | "dashed";
  priceScaleId?: string;
};

type TradingViewChartProps = {
  series: TradingSeries[];
  height?: number;
};

function toTimestamp(input: string): number | null {
  const parsed = new Date(input);
  const ms = parsed.getTime();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / 1000);
}

function toLineStyle(style?: TradingSeries["lineStyle"]): number {
  // LineStyle.Dotted = 1, LineStyle.Dashed = 2, LineStyle.Solid = 0
  if (style === "dotted") return 1;
  if (style === "dashed") return 2;
  return 0;
}

function toDataPoints(
  points: TradingSeriesPoint[],
): Array<{ time: number; value: number }> {
  const normalized: Array<{ time: number; value: number }> = [];

  for (const point of points) {
    const time = toTimestamp(point.time);
    if (time === null) continue;
    normalized.push({ time, value: point.value });
  }

  return normalized.sort((a, b) => a.time - b.time);
}

export default function TradingViewChart({
  series,
  height = 260,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || series.length === 0) return;

    let isMounted = true;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        // Dynamically import lightweight-charts only when component mounts
        // This prevents the library from being included in the main bundle
        // and reduces initial page load time by ~100-150 KiB
        const {
          AreaSeries,
          ColorType,
          createChart,
          HistogramSeries,
          LineSeries,
        } = await import("lightweight-charts");

        if (!isMounted || !container) return;

        const chart = createChart(container, {
          width: container.clientWidth || 640,
          height,
          layout: {
            background: { type: ColorType.Solid, color: "#04040a" },
            textColor: "#a3a3a3",
          },
          grid: {
            vertLines: { color: "#16162a" },
            horzLines: { color: "#16162a" },
          },
          crosshair: {
            vertLine: { color: "#3f3f5d", labelBackgroundColor: "#1e1e35" },
            horzLine: { color: "#3f3f5d", labelBackgroundColor: "#1e1e35" },
          },
          rightPriceScale: {
            borderColor: "#252545",
          },
          timeScale: {
            borderColor: "#252545",
            timeVisible: true,
          },
        });

        let hasRenderedSeries = false;

        for (const item of series) {
          const data = toDataPoints(item.data);
          if (data.length === 0) continue;

          if (item.type === "line") {
            const next = chart.addSeries(LineSeries, {
              color: item.color,
              lineWidth: item.lineWidth ?? 2,
              lineStyle: toLineStyle(item.lineStyle),
              lastValueVisible: false,
              priceLineVisible: false,
              priceScaleId: item.priceScaleId,
            });
            // @ts-expect-error - lightweight-charts expects different Time type
            next.setData(data);
            hasRenderedSeries = true;
          }

          if (item.type === "area") {
            const next = chart.addSeries(AreaSeries, {
              lineColor: item.color,
              topColor: `${item.color}66`,
              bottomColor: `${item.color}00`,
              lineWidth: item.lineWidth ?? 2,
              lastValueVisible: false,
              priceLineVisible: false,
              priceScaleId: item.priceScaleId,
            });
            // @ts-expect-error - lightweight-charts expects different Time type
            next.setData(data);
            hasRenderedSeries = true;
          }

          if (item.type === "histogram") {
            const next = chart.addSeries(HistogramSeries, {
              base: 0,
              color: item.color,
              priceLineVisible: false,
              lastValueVisible: false,
              priceScaleId: item.priceScaleId,
            });
            next.setData(
              // @ts-expect-error - lightweight-charts type incompatibility
              data.map((point) => ({
                ...point,
                color: point.value >= 0 ? "#14b8a6" : "#fb7185",
              })),
            );
            hasRenderedSeries = true;
          }
        }

        if (hasRenderedSeries) {
          chart.timeScale().fitContent();
        }

        const resizeObserver = new ResizeObserver((entries) => {
          const nextWidth = entries[0]?.contentRect.width;
          if (!nextWidth) return;
          chart.applyOptions({ width: Math.floor(nextWidth) });
        });

        resizeObserver.observe(container);

        setIsLoading(false);

        cleanup = () => {
          resizeObserver.disconnect();
          chart.remove();
        };
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load lightweight-charts:", error);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [series, height]);

  return (
    <div ref={containerRef} className="h-full w-full">
      {isLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-sm text-white/50">Loading chart...</div>
        </div>
      )}
    </div>
  );
}
