import type { AssetType } from "@/app/components/mainApp/positions/types";

export type TransactionViewModel = {
  id: number;
  trade_date: string;
  name: string;
  ticker: string;
  trade_type: "BUY" | "SELL";
  quantity: number;
  price: number;
  commission: number;
  total: number;
  currency: string;
  asset_type: AssetType;
  notes?: string;
};

export type TransactionFiltersState = {
  tradeType: "All" | "BUY" | "SELL";
  assetType: "All" | AssetType;
  year: "All" | string;
};
