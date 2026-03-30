export type AssetType = "Stocks" | "Index Fund" | "Crypto" | "Fixed Income" | "Gold" | "Cash";

export type Position = {
  id: string;
  name: string;
  ticker: string;
  shares: number;
  average_cost: number;
  current_price: number;
  currency: "EUR";
  total_cost: number;
  total_value: number;
  gain: number;
  gain_percent: number;
  asset_type: AssetType;
  last_price_update: string;
  daily_change_percent: number;
  daily_change_amount: number;
};

export const positions: Position[] = [
  {
    id: "p-1",
    name: "Apple Inc.",
    ticker: "AAPL",
    shares: 18.3,
    average_cost: 166.2,
    current_price: 179.45,
    currency: "EUR",
    total_cost: 3041.46,
    total_value: 3283.94,
    gain: 242.48,
    gain_percent: 0.0797,
    asset_type: "Stocks",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0.009,
    daily_change_amount: 29.4,
  },
  {
    id: "p-2",
    name: "Vanguard S&P 500 ETF",
    ticker: "VOO",
    shares: 7.9,
    average_cost: 430.55,
    current_price: 447.1,
    currency: "EUR",
    total_cost: 3401.35,
    total_value: 3532.09,
    gain: 130.74,
    gain_percent: 0.0384,
    asset_type: "Index Fund",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0.003,
    daily_change_amount: 11.8,
  },
  {
    id: "p-3",
    name: "Bitcoin",
    ticker: "BTC",
    shares: 0.045,
    average_cost: 60120,
    current_price: 62510,
    currency: "EUR",
    total_cost: 2705.4,
    total_value: 2812.95,
    gain: 107.55,
    gain_percent: 0.0398,
    asset_type: "Crypto",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: -0.006,
    daily_change_amount: -16.9,
  },
  {
    id: "p-4",
    name: "iShares Core Global Aggregate Bond",
    ticker: "AGGG",
    shares: 48,
    average_cost: 5.2,
    current_price: 5.12,
    currency: "EUR",
    total_cost: 249.6,
    total_value: 245.76,
    gain: -3.84,
    gain_percent: -0.0154,
    asset_type: "Fixed Income",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: -0.001,
    daily_change_amount: -0.24,
  },
  {
    id: "p-5",
    name: "SPDR Gold Shares",
    ticker: "GLD",
    shares: 4.2,
    average_cost: 193.8,
    current_price: 201.1,
    currency: "EUR",
    total_cost: 813.96,
    total_value: 844.62,
    gain: 30.66,
    gain_percent: 0.0377,
    asset_type: "Gold",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0.004,
    daily_change_amount: 3.1,
  },
  {
    id: "p-6",
    name: "Uninvested Cash",
    ticker: "EUR",
    shares: 1,
    average_cost: 1400,
    current_price: 1400,
    currency: "EUR",
    total_cost: 1400,
    total_value: 1400,
    gain: 0,
    gain_percent: 0,
    asset_type: "Cash",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0,
    daily_change_amount: 0,
  },
];

export const portfolioSummary = {
  total_cost: positions.reduce((acc, item) => acc + item.total_cost, 0),
  total_value: positions.reduce((acc, item) => acc + item.total_value, 0),
  total_gain: positions.reduce((acc, item) => acc + item.gain, 0),
  total_gain_percent: 0.0489,
  by_asset_type: {
    Stocks: { value: 3283.94, cost: 3041.46, gain: 242.48 },
    "Index Fund": { value: 3532.09, cost: 3401.35, gain: 130.74 },
    Crypto: { value: 2812.95, cost: 2705.4, gain: 107.55 },
    "Fixed Income": { value: 245.76, cost: 249.6, gain: -3.84 },
    Gold: { value: 844.62, cost: 813.96, gain: 30.66 },
    Cash: { value: 1400, cost: 1400, gain: 0 },
  },
};

export type Transaction = {
  id: string;
  trade_date: string;
  name: string;
  ticker: string;
  trade_type: "BUY" | "SELL";
  quantity: number;
  price: number;
  commission: number;
  total: number;
  currency: "EUR";
  asset_type: AssetType;
  notes?: string;
};

export const transactions: Transaction[] = [
  {
    id: "t-1",
    trade_date: "2026-03-13",
    name: "Apple Inc.",
    ticker: "AAPL",
    trade_type: "BUY",
    quantity: 4.1,
    price: 178.2,
    commission: 1.1,
    total: 731.72,
    currency: "EUR",
    asset_type: "Stocks",
    notes: "Added on dip",
  },
  {
    id: "t-2",
    trade_date: "2026-03-10",
    name: "Bitcoin",
    ticker: "BTC",
    trade_type: "SELL",
    quantity: 0.01,
    price: 63400,
    commission: 2,
    total: 632,
    currency: "EUR",
    asset_type: "Crypto",
    notes: "Partial take-profit",
  },
  {
    id: "t-3",
    trade_date: "2026-03-05",
    name: "Vanguard S&P 500 ETF",
    ticker: "VOO",
    trade_type: "BUY",
    quantity: 2,
    price: 441,
    commission: 1.2,
    total: 883.2,
    currency: "EUR",
    asset_type: "Index Fund",
    notes: "Monthly contribution",
  },
  {
    id: "t-4",
    trade_date: "2026-02-17",
    name: "SPDR Gold Shares",
    ticker: "GLD",
    trade_type: "BUY",
    quantity: 1.2,
    price: 198.1,
    commission: 0.9,
    total: 238.62,
    currency: "EUR",
    asset_type: "Gold",
    notes: "Inflation hedge",
  },
  {
    id: "t-5",
    trade_date: "2026-02-01",
    name: "iShares Core Global Aggregate Bond",
    ticker: "AGGG",
    trade_type: "BUY",
    quantity: 20,
    price: 5.3,
    commission: 0.7,
    total: 106.7,
    currency: "EUR",
    asset_type: "Fixed Income",
  },
];

export const snapshots = [
  { date: "2025-09-01", total_value: 9050, total_cost: 8800, total_gain: 250, gain_percent: 0.0284 },
  { date: "2025-10-01", total_value: 9320, total_cost: 9050, total_gain: 270, gain_percent: 0.0298 },
  { date: "2025-11-01", total_value: 9615, total_cost: 9300, total_gain: 315, gain_percent: 0.0339 },
  { date: "2025-12-01", total_value: 9980, total_cost: 9640, total_gain: 340, gain_percent: 0.0353 },
  { date: "2026-01-01", total_value: 10120, total_cost: 9880, total_gain: 240, gain_percent: 0.0243 },
  { date: "2026-02-01", total_value: 10690, total_cost: 10110, total_gain: 580, gain_percent: 0.0574 },
  { date: "2026-03-01", total_value: 11120, total_cost: 10611.77, total_gain: 508.23, gain_percent: 0.0479 },
];

export const performanceMetrics = {
  total_return: 0.162,
  annualized_return: 0.108,
  volatility: 0.176,
  sharpe_ratio: 1.48,
  max_drawdown: -0.081,
  daily_return: 0.003,
  monthly_return: 0.027,
  ytd_return: 0.044,
};

export const benchmarkSeries = {
  symbols: ["SPY", "VOO", "QQQ", "VTI"],
  performanceBySymbol: {
    SPY: [1, 1.01, 0.998, 1.02, 1.034, 1.046, 1.052],
    VOO: [1, 1.009, 1.001, 1.022, 1.037, 1.05, 1.058],
    QQQ: [1, 1.014, 0.996, 1.028, 1.045, 1.061, 1.071],
    VTI: [1, 1.008, 1.0, 1.019, 1.033, 1.045, 1.053],
  },
  portfolio: [1, 1.012, 1.004, 1.031, 1.049, 1.059, 1.068],
  dates: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  metrics: {
    portfolio_return: 0.068,
    benchmark_return: 0.052,
    alpha: 0.016,
    beta: 1.03,
    portfolio_sharpe: 1.48,
    benchmark_sharpe: 1.31,
    correlation: 0.91,
    tracking_error: 0.037,
    information_ratio: 0.42,
  },
  riskRows: [
    { label: "Volatility", portfolio: "17.6%", benchmark: "16.9%" },
    { label: "Max Drawdown", portfolio: "-8.1%", benchmark: "-9.2%" },
    { label: "Downside Deviation", portfolio: "10.7%", benchmark: "11.4%" },
    { label: "Sortino Ratio", portfolio: "1.90", benchmark: "1.62" },
  ],
};

export const taxData = {
  years: [2024, 2025, 2026],
  summaryByYear: {
    2024: {
      total_realized_gain: 412.5,
      total_realized_loss: -184.2,
      net_realized_gain: 228.3,
      short_term_gains: 146.8,
      long_term_gains: 81.5,
      total_dividend_income: 52.4,
    },
    2025: {
      total_realized_gain: 632.1,
      total_realized_loss: -205.9,
      net_realized_gain: 426.2,
      short_term_gains: 251.9,
      long_term_gains: 174.3,
      total_dividend_income: 89.7,
    },
    2026: {
      total_realized_gain: 218.2,
      total_realized_loss: -112.4,
      net_realized_gain: 105.8,
      short_term_gains: 90.1,
      long_term_gains: 15.7,
      total_dividend_income: 33.2,
    },
  },
  realizedGains: [
    {
      ticker: "BTC",
      quantity: 0.01,
      cost_basis: 581,
      sale_price: 632,
      gain_loss: 51,
      purchase_date: "2025-11-05",
      sale_date: "2026-03-10",
      holding_period: "126 days",
      is_short_term: true,
    },
    {
      ticker: "AAPL",
      quantity: 3,
      cost_basis: 475.2,
      sale_price: 522,
      gain_loss: 46.8,
      purchase_date: "2025-08-14",
      sale_date: "2026-01-22",
      holding_period: "161 days",
      is_short_term: true,
    },
  ],
  unrealizedGains: [
    {
      ticker: "AAPL",
      shares: 18.3,
      average_cost: 166.2,
      current_price: 179.45,
      unrealized_gain: 242.48,
      gain_percent: 0.0797,
      holding_period: "10 months",
    },
    {
      ticker: "AGGG",
      shares: 48,
      average_cost: 5.2,
      current_price: 5.12,
      unrealized_gain: -3.84,
      gain_percent: -0.0154,
      holding_period: "5 months",
    },
  ],
  harvestingOpportunities: [
    {
      ticker: "AGGG",
      unrealized_loss: -3.84,
      recommendation: "Harvest loss and rotate into a similar aggregate bond ETF.",
    },
  ],
  dividends: [
    { ticker: "VOO", amount: 21.2, payment_date: "2026-03-01", is_qualified: true },
    { ticker: "AAPL", amount: 14.1, payment_date: "2026-02-14", is_qualified: true },
  ],
};

export const historicReturns = {
  cumulative: [
    { period: "Sep", value: 9050, exContributions: 9050 },
    { period: "Oct", value: 9470, exContributions: 9330 },
    { period: "Nov", value: 9780, exContributions: 9580 },
    { period: "Dec", value: 10150, exContributions: 9930 },
    { period: "Jan", value: 10320, exContributions: 10060 },
    { period: "Feb", value: 10880, exContributions: 10540 },
    { period: "Mar", value: 11120, exContributions: 10680 },
  ],
  monthlyReturns: [
    { month: "Jan", return: 0.012 },
    { month: "Feb", return: 0.028 },
    { month: "Mar", return: 0.017 },
    { month: "Apr", return: -0.006 },
    { month: "May", return: 0.013 },
    { month: "Jun", return: 0.009 },
    { month: "Jul", return: -0.011 },
    { month: "Aug", return: 0.02 },
    { month: "Sep", return: 0.016 },
    { month: "Oct", return: 0.01 },
    { month: "Nov", return: 0.014 },
    { month: "Dec", return: 0.019 },
  ],
  contributions: [
    { period: "Sep", value: 0 },
    { period: "Oct", value: 140 },
    { period: "Nov", value: 200 },
    { period: "Dec", value: 220 },
    { period: "Jan", value: 260 },
    { period: "Feb", value: 340 },
    { period: "Mar", value: 280 },
  ],
  assetClass: [
    { period: "Sep", stocks: 3200, index: 2900, crypto: 1700, fixedIncome: 750 },
    { period: "Oct", stocks: 3320, index: 3000, crypto: 1770, fixedIncome: 760 },
    { period: "Nov", stocks: 3380, index: 3090, crypto: 1830, fixedIncome: 770 },
    { period: "Dec", stocks: 3490, index: 3180, crypto: 1920, fixedIncome: 780 },
    { period: "Jan", stocks: 3500, index: 3260, crypto: 1980, fixedIncome: 790 },
    { period: "Feb", stocks: 3620, index: 3410, crypto: 2060, fixedIncome: 800 },
    { period: "Mar", stocks: 3690, index: 3530, crypto: 2100, fixedIncome: 810 },
  ],
  drawdown: [
    { period: "Sep", value: 0 },
    { period: "Oct", value: -0.01 },
    { period: "Nov", value: -0.023 },
    { period: "Dec", value: -0.015 },
    { period: "Jan", value: -0.038 },
    { period: "Feb", value: -0.012 },
    { period: "Mar", value: -0.008 },
  ],
};

export const settingsMock = {
  portfolio: {
    name: "Global Growth Portfolio",
    base_currency: "EUR",
  },
  notifications: {
    dailyPriceUpdate: true,
    weeklySummary: true,
    significantMoves: true,
    dividendPayments: false,
  },
  integrations: [
    { name: "Interactive Brokers", status: "Planned" },
    { name: "TaxDown", status: "Planned" },
    { name: "Google Sheets", status: "Draft" },
  ],
};

export const portfolioMeta = [
  { id: "portfolio-1", name: "Global Growth Portfolio", base_currency: "EUR" },
  { id: "portfolio-2", name: "Retirement Shield Portfolio", base_currency: "EUR" },
];

const positionsPortfolio2: Position[] = [
  {
    id: "p2-1",
    name: "Microsoft Corp.",
    ticker: "MSFT",
    shares: 11.2,
    average_cost: 318.4,
    current_price: 331.1,
    currency: "EUR",
    total_cost: 3566.08,
    total_value: 3708.32,
    gain: 142.24,
    gain_percent: 0.0399,
    asset_type: "Stocks",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0.004,
    daily_change_amount: 14.1,
  },
  {
    id: "p2-2",
    name: "Vanguard Total Market ETF",
    ticker: "VTI",
    shares: 14.6,
    average_cost: 247.5,
    current_price: 259.9,
    currency: "EUR",
    total_cost: 3613.5,
    total_value: 3794.54,
    gain: 181.04,
    gain_percent: 0.0501,
    asset_type: "Index Fund",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0.002,
    daily_change_amount: 7.6,
  },
  {
    id: "p2-3",
    name: "Ethereum",
    ticker: "ETH",
    shares: 0.82,
    average_cost: 2610,
    current_price: 2495,
    currency: "EUR",
    total_cost: 2140.2,
    total_value: 2045.9,
    gain: -94.3,
    gain_percent: -0.0441,
    asset_type: "Crypto",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: -0.011,
    daily_change_amount: -22.6,
  },
  {
    id: "p2-4",
    name: "Euro Bond Fund",
    ticker: "EUBD",
    shares: 90,
    average_cost: 4.95,
    current_price: 5.02,
    currency: "EUR",
    total_cost: 445.5,
    total_value: 451.8,
    gain: 6.3,
    gain_percent: 0.0141,
    asset_type: "Fixed Income",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0.001,
    daily_change_amount: 0.45,
  },
  {
    id: "p2-5",
    name: "Cash Reserve",
    ticker: "EUR",
    shares: 1,
    average_cost: 2200,
    current_price: 2200,
    currency: "EUR",
    total_cost: 2200,
    total_value: 2200,
    gain: 0,
    gain_percent: 0,
    asset_type: "Cash",
    last_price_update: "2026-03-14 10:42",
    daily_change_percent: 0,
    daily_change_amount: 0,
  },
];

const summaryPortfolio2 = {
  total_cost: positionsPortfolio2.reduce((acc, item) => acc + item.total_cost, 0),
  total_value: positionsPortfolio2.reduce((acc, item) => acc + item.total_value, 0),
  total_gain: positionsPortfolio2.reduce((acc, item) => acc + item.gain, 0),
  total_gain_percent: 0.022,
  by_asset_type: {
    Stocks: { value: 3708.32, cost: 3566.08, gain: 142.24 },
    "Index Fund": { value: 3794.54, cost: 3613.5, gain: 181.04 },
    Crypto: { value: 2045.9, cost: 2140.2, gain: -94.3 },
    "Fixed Income": { value: 451.8, cost: 445.5, gain: 6.3 },
    Gold: { value: 0, cost: 0, gain: 0 },
    Cash: { value: 2200, cost: 2200, gain: 0 },
  },
};

const transactionsPortfolio2: Transaction[] = [
  {
    id: "t2-1",
    trade_date: "2026-03-12",
    name: "Microsoft Corp.",
    ticker: "MSFT",
    trade_type: "BUY",
    quantity: 2,
    price: 329.1,
    commission: 1.2,
    total: 659.4,
    currency: "EUR",
    asset_type: "Stocks",
    notes: "Quarterly top-up",
  },
  {
    id: "t2-2",
    trade_date: "2026-03-01",
    name: "Ethereum",
    ticker: "ETH",
    trade_type: "BUY",
    quantity: 0.12,
    price: 2520,
    commission: 1,
    total: 303.4,
    currency: "EUR",
    asset_type: "Crypto",
    notes: "DCA",
  },
  {
    id: "t2-3",
    trade_date: "2026-02-11",
    name: "Vanguard Total Market ETF",
    ticker: "VTI",
    trade_type: "BUY",
    quantity: 3,
    price: 255,
    commission: 1.2,
    total: 766.2,
    currency: "EUR",
    asset_type: "Index Fund",
  },
  {
    id: "t2-4",
    trade_date: "2026-01-23",
    name: "Euro Bond Fund",
    ticker: "EUBD",
    trade_type: "BUY",
    quantity: 25,
    price: 5,
    commission: 0.7,
    total: 125.7,
    currency: "EUR",
    asset_type: "Fixed Income",
  },
];

const snapshotsPortfolio2 = snapshots.map((item) => ({
  ...item,
  total_value: Number((item.total_value * 1.12).toFixed(2)),
  total_cost: Number((item.total_cost * 1.1).toFixed(2)),
  total_gain: Number((item.total_gain * 1.35).toFixed(2)),
}));

const performanceMetricsPortfolio2 = {
  ...performanceMetrics,
  total_return: 0.121,
  annualized_return: 0.091,
  volatility: 0.142,
  sharpe_ratio: 1.36,
  max_drawdown: -0.052,
  daily_return: 0.002,
  monthly_return: 0.019,
  ytd_return: 0.031,
};

const benchmarkSeriesPortfolio2 = {
  ...benchmarkSeries,
  portfolio: [1, 1.008, 1.011, 1.018, 1.024, 1.031, 1.038],
  metrics: {
    ...benchmarkSeries.metrics,
    portfolio_return: 0.038,
    benchmark_return: 0.052,
    alpha: -0.014,
    beta: 0.88,
    portfolio_sharpe: 1.22,
  },
  riskRows: [
    { label: "Volatility", portfolio: "14.2%", benchmark: "16.9%" },
    { label: "Max Drawdown", portfolio: "-5.2%", benchmark: "-9.2%" },
    { label: "Downside Deviation", portfolio: "8.8%", benchmark: "11.4%" },
    { label: "Sortino Ratio", portfolio: "1.62", benchmark: "1.62" },
  ],
};

const taxDataPortfolio2 = {
  ...taxData,
  summaryByYear: {
    ...taxData.summaryByYear,
    2026: {
      total_realized_gain: 102.1,
      total_realized_loss: -68.2,
      net_realized_gain: 33.9,
      short_term_gains: 23.5,
      long_term_gains: 10.4,
      total_dividend_income: 27.8,
    },
  },
};

const historicReturnsPortfolio2 = {
  ...historicReturns,
  cumulative: historicReturns.cumulative.map((item) => ({
    ...item,
    value: Number((item.value * 1.08).toFixed(2)),
    exContributions: Number((item.exContributions * 1.05).toFixed(2)),
  })),
  monthlyReturns: [
    { month: "Jan", return: 0.008 },
    { month: "Feb", return: 0.014 },
    { month: "Mar", return: 0.012 },
    { month: "Apr", return: 0.002 },
    { month: "May", return: 0.006 },
    { month: "Jun", return: 0.004 },
    { month: "Jul", return: -0.005 },
    { month: "Aug", return: 0.011 },
    { month: "Sep", return: 0.009 },
    { month: "Oct", return: 0.007 },
    { month: "Nov", return: 0.01 },
    { month: "Dec", return: 0.013 },
  ],
};

const settingsPortfolio2 = {
  ...settingsMock,
  portfolio: {
    name: "Retirement Shield Portfolio",
    base_currency: "EUR",
  },
};

export const portfolioDataById = {
  "portfolio-1": {
    positions,
    portfolioSummary,
    transactions,
    snapshots,
    performanceMetrics,
    benchmarkSeries,
    taxData,
    historicReturns,
    settings: settingsMock,
  },
  "portfolio-2": {
    positions: positionsPortfolio2,
    portfolioSummary: summaryPortfolio2,
    transactions: transactionsPortfolio2,
    snapshots: snapshotsPortfolio2,
    performanceMetrics: performanceMetricsPortfolio2,
    benchmarkSeries: benchmarkSeriesPortfolio2,
    taxData: taxDataPortfolio2,
    historicReturns: historicReturnsPortfolio2,
    settings: settingsPortfolio2,
  },
};

export function getPortfolioData(portfolioId: string) {
  if (portfolioId in portfolioDataById) {
    return portfolioDataById[portfolioId as keyof typeof portfolioDataById];
  }
  return portfolioDataById[portfolioMeta[0].id as keyof typeof portfolioDataById];
}
