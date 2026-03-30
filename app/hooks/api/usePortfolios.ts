"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { CreatePortfolioRequest, Portfolio, UpdatePortfolioRequest } from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

export function usePortfolios() {
  const { token } = useAuth();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  }, [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextItems = await apiClient.listPortfolios(ensureToken());
      setItems(nextItems);
      return nextItems;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load portfolios.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [ensureToken]);

  const create = useCallback(
    async (payload: CreatePortfolioRequest) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.createPortfolio(payload, ensureToken());
        setItems((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to create portfolio.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const update = useCallback(
    async (portfolioId: number, payload: UpdatePortfolioRequest) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await apiClient.updatePortfolio(portfolioId, payload, ensureToken());
        setItems((prev) => prev.map((item) => (item.id === portfolioId ? updated : item)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to update portfolio.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const remove = useCallback(
    async (portfolioId: number) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.deletePortfolio(portfolioId, ensureToken());
        setItems((prev) => prev.filter((item) => item.id !== portfolioId));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to delete portfolio.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  return {
    items,
    loading,
    error,
    load,
    create,
    update,
    remove,
    setError,
  };
}
