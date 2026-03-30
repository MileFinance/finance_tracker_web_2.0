"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { PriceData, PriceHistory, QueryRange } from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

export function useMarketData() {
  const { token } = useAuth();
  const [price, setPrice] = useState<PriceData | null>(null);
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  }, [token]);

  const loadPrice = useCallback(
    async (symbol: string, type?: "crypto" | "stock" | "etf" | "index") => {
      setLoading(true);
      setError(null);
      try {
        const nextPrice = await apiClient.getMarketPrice(symbol, ensureToken(), type);
        setPrice(nextPrice);
        return nextPrice;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load price.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const loadHistory = useCallback(
    async (symbol: string, range: QueryRange = {}) => {
      setLoading(true);
      setError(null);
      try {
        const nextHistory = await apiClient.getMarketHistory(symbol, ensureToken(), range);
        setHistory(nextHistory);
        return nextHistory;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load price history.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  return {
    price,
    history,
    loading,
    error,
    loadPrice,
    loadHistory,
    setError,
  };
}
