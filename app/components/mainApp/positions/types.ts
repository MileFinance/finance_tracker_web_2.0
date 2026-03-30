export type AssetType =
  | "Stocks"
  | "Index Fund"
  | "Crypto"
  | "Fixed Income"
  | "Gold"
  | "Cash"
  | "Other";

export type PositionViewModel = {
  id: number;
  name: string;
  ticker: string;
  shares: number;
  average_cost: number;
  current_price: number;
  currency: string;
  total_cost: number;
  total_value: number;
  gain: number;
  gain_percent: number;
  asset_type: AssetType;
  last_price_update?: string;
  daily_change_percent: number;
  daily_change_amount: number;
};
