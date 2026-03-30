"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type {
  BenchmarkComparison,
  PerformanceMetrics,
  PortfolioSnapshot,
  QueryRange,
} from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

type AnalyticsState = {
  snapshots: PortfolioSnapshot[];
  performance: PerformanceMetrics | null;
  benchmark: BenchmarkComparison | null;
};

export function useAnalytics() {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsState>({
    snapshots: [],
    performance: null,
    benchmark: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  }, [token]);

  const loadPerformance = useCallback(
    async (portfolioId: number, range: QueryRange = {}) => {
      setLoading(true);
      setError(null);
      try {
        const [snapshots, performance] = await Promise.all([
          apiClient.listSnapshots(portfolioId, ensureToken(), range),
          apiClient.getPerformanceMetrics(portfolioId, ensureToken(), range),
        ]);

        setData((prev) => ({ ...prev, snapshots, performance }));
        return { snapshots, performance };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load analytics performance.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const loadBenchmark = useCallback(
    async (portfolioId: number, benchmark = "SPY", range: QueryRange = {}) => {
      setLoading(true);
      setError(null);
      try {
        const nextBenchmark = await apiClient.getBenchmarkComparison(portfolioId, ensureToken(), {
          benchmark,
          ...range,
        });
        setData((prev) => ({ ...prev, benchmark: nextBenchmark }));
        return nextBenchmark;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load benchmark comparison.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const createSnapshot = useCallback(
    async (portfolioId: number, date?: string) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.createSnapshot(portfolioId, ensureToken(), date ? { date } : undefined);
        setData((prev) => ({ ...prev, snapshots: [...prev.snapshots, created] }));
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to create snapshot.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  return {
    ...data,
    loading,
    error,
    loadPerformance,
    loadBenchmark,
    createSnapshot,
    setError,
  };
}
