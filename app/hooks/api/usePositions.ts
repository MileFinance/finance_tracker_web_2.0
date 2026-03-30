"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { CreatePositionRequest, Position, PositionWithMetrics, UpdatePositionRequest } from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

export function usePositions() {
  const { token } = useAuth();
  const [items, setItems] = useState<PositionWithMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  }, [token]);

  const load = useCallback(
    async (portfolioId: number) => {
      setLoading(true);
      setError(null);
      try {
        const nextItems = await apiClient.listPositions(portfolioId, ensureToken());
        setItems(nextItems);
        return nextItems;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load positions.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const create = useCallback(
    async (portfolioId: number, payload: CreatePositionRequest) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.createPosition(portfolioId, payload, ensureToken());
        await load(portfolioId);
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to create position.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken, load],
  );

  const update = useCallback(
    async (portfolioId: number, positionId: number, payload: UpdatePositionRequest) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await apiClient.updatePosition(positionId, payload, ensureToken());
        setItems((prev) => prev.map((item) => (item.id === positionId ? { ...item, ...(updated as Position) } : item)));
        await load(portfolioId);
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to update position.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken, load],
  );

  const remove = useCallback(
    async (portfolioId: number, positionId: number) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.deletePosition(positionId, ensureToken());
        setItems((prev) => prev.filter((item) => item.id !== positionId));
        await load(portfolioId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to delete position.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken, load],
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
