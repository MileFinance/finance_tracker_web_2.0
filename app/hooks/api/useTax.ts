"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { TaxHarvestingOpportunity, TaxReport, UnrealizedGain } from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

type TaxState = {
  report: TaxReport | null;
  unrealizedGains: UnrealizedGain[];
  opportunities: TaxHarvestingOpportunity[];
};

export function useTax() {
  const { token } = useAuth();
  const [data, setData] = useState<TaxState>({
    report: null,
    unrealizedGains: [],
    opportunities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  }, [token]);

  const load = useCallback(
    async (portfolioId: number, year?: number) => {
      setLoading(true);
      setError(null);
      try {
        const [report, unrealizedGains, opportunities] = await Promise.all([
          apiClient.getTaxReport(portfolioId, ensureToken(), year),
          apiClient.listUnrealizedGains(portfolioId, ensureToken()),
          apiClient.listTaxHarvestingOpportunities(portfolioId, ensureToken()),
        ]);

        const nextData = { report, unrealizedGains, opportunities };
        setData(nextData);
        return nextData;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load tax data.";
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
    load,
    setError,
  };
}
