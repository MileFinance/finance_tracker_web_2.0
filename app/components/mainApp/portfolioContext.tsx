"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import type { Portfolio } from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

type PortfolioContextValue = {
  selectedPortfolioId: number | null;
  setSelectedPortfolioId: (portfolioId: number) => void;
  portfolios: Portfolio[];
  loading: boolean;
  error: string | null;
  refreshPortfolios: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);

  const refreshPortfolios = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetched = await apiClient.listPortfolios(token);
      setPortfolios(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load portfolios.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshPortfolios();
  }, [refreshPortfolios]);

  useEffect(() => {
    if (!portfolios.length) {
      setSelectedPortfolioId(null);
      return;
    }

    const fromUrl = Number(searchParams.get("portfolio"));
    const existsInPortfolioList = portfolios.some((item) => item.id === fromUrl);
    if (existsInPortfolioList) {
      setSelectedPortfolioId(fromUrl);
      return;
    }

    setSelectedPortfolioId(portfolios[0].id);
  }, [searchParams, portfolios]);

  useEffect(() => {
    if (!selectedPortfolioId) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("portfolio") !== String(selectedPortfolioId)) {
      params.set("portfolio", String(selectedPortfolioId));
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [selectedPortfolioId, searchParams, pathname, router]);

  const value = useMemo(
    () => ({ selectedPortfolioId, setSelectedPortfolioId, portfolios, loading, error, refreshPortfolios }),
    [selectedPortfolioId, portfolios, loading, error, refreshPortfolios]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
