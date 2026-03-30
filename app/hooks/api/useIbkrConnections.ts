"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type {
  CreateIbkrConnectionRequest,
  IbkrConnection,
  UpdateIbkrConnectionRequest,
} from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

export function useIbkrConnections() {
  const { token } = useAuth();
  const [items, setItems] = useState<IbkrConnection[]>([]);
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
      const next = await apiClient.listIbkrConnections(ensureToken());
      setItems(next);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load IBKR connections.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [ensureToken]);

  const create = useCallback(
    async (payload: CreateIbkrConnectionRequest) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.createIbkrConnection(payload, ensureToken());
        setItems((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to create IBKR connection.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const update = useCallback(
    async (connectionId: number, payload: UpdateIbkrConnectionRequest) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await apiClient.updateIbkrConnection(connectionId, payload, ensureToken());
        setItems((prev) => prev.map((item) => (item.id === connectionId ? updated : item)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to update IBKR connection.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const remove = useCallback(
    async (connectionId: number) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.deleteIbkrConnection(connectionId, ensureToken());
        setItems((prev) => prev.filter((item) => item.id !== connectionId));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to delete IBKR connection.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const getStatus = useCallback(
    async (connectionId: number) => {
      setError(null);
      try {
        return await apiClient.getIbkrConnectionStatus(connectionId, ensureToken());
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load IBKR connection status.";
        setError(message);
        throw err;
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
    getStatus,
    setError,
  };
}
