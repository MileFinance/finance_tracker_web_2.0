"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { BrokerImportResponse, CreateTransactionRequest, Transaction } from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

type ImportSummary = {
  imported: number;
  skipped: number;
  failed: number;
  message?: string;
};

function isTransactionArray(value: unknown): value is Transaction[] {
  return Array.isArray(value);
}

function toImportSummary(value: BrokerImportResponse | Transaction[]): ImportSummary {
  if (isTransactionArray(value)) {
    return {
      imported: value.length,
      skipped: 0,
      failed: 0,
      message: `Imported ${value.length} transactions from IBKR.`,
    };
  }

  return {
    imported: value.imported ?? 0,
    skipped: value.skipped ?? 0,
    failed: value.failed ?? 0,
    message: value.message,
  };
}

export function useTransactions() {
  const { token } = useAuth();
  const [items, setItems] = useState<Transaction[]>([]);
  const [lastImport, setLastImport] = useState<ImportSummary | null>(null);
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
        const nextItems = await apiClient.listTransactions(portfolioId, ensureToken());
        setItems(nextItems);
        return nextItems;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load transactions.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const create = useCallback(
    async (portfolioId: number, payload: CreateTransactionRequest) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.createTransaction(portfolioId, payload, ensureToken());
        setItems((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to create transaction.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const importFromIbkr = useCallback(
    async (portfolioId: number, connectionId: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.importIbkrTransactions(connectionId, ensureToken());
        const summary = toImportSummary(result);
        setLastImport(summary);

        const refreshed = await apiClient.listTransactions(portfolioId, ensureToken());
        setItems(refreshed);
        return summary;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to import IBKR transactions.";
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
    lastImport,
    loading,
    error,
    load,
    create,
    importFromIbkr,
    setError,
  };
}
