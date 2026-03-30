"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import TransactionsTable from "@/app/components/mainApp/transactions/transactionsTable";
import TransactionFilters from "@/app/components/mainApp/transactions/transactionFilters";
import TransactionStats from "@/app/components/mainApp/transactions/transactionStats";
import TransactionsMonthlyHeatmap from "@/app/components/mainApp/transactions/transactionsMonthlyHeatmap";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import type { AssetType } from "@/app/components/mainApp/positions/types";
import type { TransactionFiltersState, TransactionViewModel } from "@/app/components/mainApp/transactions/types";
import { useTransactions } from "@/app/hooks/api/useTransactions";
import { useIbkrConnections } from "@/app/hooks/api/useIbkrConnections";

const ASSET_TYPES = ["Stocks", "Index Fund", "Crypto", "Fixed Income", "Gold", "Cash", "Other"] as const;

type AddTxForm = {
  name: string;
  ticker: string;
  trade_type: "buy" | "sell";
  quantity: string;
  price: string;
  commission: string;
  currency: string;
  trade_date: string;
  asset_type: string;
  notes: string;
};

const EMPTY_TX: AddTxForm = {
  name: "",
  ticker: "",
  trade_type: "buy",
  quantity: "",
  price: "",
  commission: "",
  currency: "USD",
  trade_date: new Date().toISOString().slice(0, 10),
  asset_type: "Stocks",
  notes: "",
};

function AddTransactionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (form: AddTxForm) => Promise<void>;
}) {
  const [form, setForm] = useState<AddTxForm>(EMPTY_TX);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function setField(field: keyof AddTxForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.name || !form.ticker || !form.quantity || !form.price || !form.currency || !form.trade_date) {
      setFormError("Name, ticker, quantity, price, currency and trade date are required.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create transaction.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#1e1e35] bg-[#07070e] p-6">
        <h2 className="mb-5 text-lg font-semibold text-white">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            { label: "Name", field: "name" as const, placeholder: "Apple Inc." },
            { label: "Ticker", field: "ticker" as const, placeholder: "AAPL" },
            { label: "Quantity", field: "quantity" as const, placeholder: "10", type: "number" },
            { label: "Price", field: "price" as const, placeholder: "150.00", type: "number" },
            { label: "Commission", field: "commission" as const, placeholder: "0.00", type: "number" },
            { label: "Currency", field: "currency" as const, placeholder: "USD" },
            { label: "Trade Date", field: "trade_date" as const, type: "date" },
          ].map(({ label, field, placeholder, type }) => (
            <label key={field} className="flex flex-col gap-1 text-xs text-neutral-400">
              {label}
              <input
                type={type ?? "text"}
                value={form[field]}
                onChange={(e) => setField(field, e.target.value)}
                placeholder={placeholder}
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "any" : undefined}
                className="rounded-lg border border-[#252545] bg-[#04040a] px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#14b8a6]"
              />
            </label>
          ))}

          <label className="flex flex-col gap-1 text-xs text-neutral-400">
            Trade Type
            <select
              value={form.trade_type}
              onChange={(e) => setField("trade_type", e.target.value)}
              className="rounded-lg border border-[#252545] bg-[#04040a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#14b8a6]"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-neutral-400">
            Asset Type
            <select
              value={form.asset_type}
              onChange={(e) => setField("asset_type", e.target.value)}
              className="rounded-lg border border-[#252545] bg-[#04040a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#14b8a6]"
            >
              {ASSET_TYPES.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-neutral-400">
            Notes (optional)
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={2}
              className="rounded-lg border border-[#252545] bg-[#04040a] px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#14b8a6]"
            />
          </label>

          {formError && <p className="text-xs text-rose-400">{formError}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[#252545] px-4 py-2 text-sm text-neutral-400 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#14b8a6] px-4 py-2 text-sm font-semibold text-black hover:bg-[#2dd4bf] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toAssetTypeLabel(input: string): AssetType {
  const value = input.trim().toLowerCase();
  if (value.includes("stock") || value.includes("equity")) return "Stocks";
  if (value.includes("index") || value.includes("etf") || value.includes("fund")) return "Index Fund";
  if (value.includes("crypto")) return "Crypto";
  if (value.includes("fixed") || value.includes("bond")) return "Fixed Income";
  if (value.includes("gold")) return "Gold";
  if (value.includes("cash")) return "Cash";
  return "Other";
}

export default function TransactionsView() {
  const { selectedPortfolioId } = usePortfolio();
  const { items, loading, error, load, create, importFromIbkr, lastImport } = useTransactions();
  const {
    items: ibkrConnections,
    loading: ibkrLoading,
    error: ibkrError,
    load: loadIbkrConnections,
    getStatus: getIbkrStatus,
  } = useIbkrConnections();
  const [filters, setFilters] = useState<TransactionFiltersState>({
    tradeType: "All",
    assetType: "All",
    year: "All",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const handleAddTransaction = useCallback(
    async (form: AddTxForm) => {
      if (!selectedPortfolioId) return;

      await create(selectedPortfolioId, {
        name: form.name,
        ticker: form.ticker,
        trade_type: form.trade_type,
        quantity: parseFloat(form.quantity),
        price: parseFloat(form.price),
        commission: form.commission ? parseFloat(form.commission) : undefined,
        currency: form.currency.toUpperCase(),
        trade_date: form.trade_date,
        asset_type: form.asset_type,
        notes: form.notes || undefined,
      });
    },
    [selectedPortfolioId, create],
  );

  useEffect(() => {
    if (!selectedPortfolioId) return;
    void load(selectedPortfolioId);
  }, [selectedPortfolioId, load]);

  useEffect(() => {
    void loadIbkrConnections();
  }, [loadIbkrConnections]);

  useEffect(() => {
    if (ibkrConnections.length === 0) {
      setSelectedConnectionId(null);
      return;
    }

    const exists = ibkrConnections.some((connection) => connection.id === selectedConnectionId);
    if (!exists) {
      setSelectedConnectionId(ibkrConnections[0].id);
    }
  }, [ibkrConnections, selectedConnectionId]);

  const loadConnectionStatus = useCallback(async () => {
    if (!selectedConnectionId) return;

    try {
      const status = await getIbkrStatus(selectedConnectionId);
      if (status.message) {
        setConnectionStatus(status.message);
        return;
      }
      if (status.status) {
        setConnectionStatus(`Status: ${status.status}`);
        return;
      }
      setConnectionStatus("Status endpoint returned no details.");
    } catch {
      // Hook error banner is shown in UI.
    }
  }, [selectedConnectionId, getIbkrStatus]);

  const handleImportIbkr = useCallback(async () => {
    if (!selectedPortfolioId || !selectedConnectionId) return;

    setImporting(true);
    setImportNotice(null);
    try {
      const summary = await importFromIbkr(selectedPortfolioId, selectedConnectionId);
      const baseMessage = summary.message ?? "IBKR import finished.";
      setImportNotice(
        `${baseMessage} Imported: ${summary.imported}, skipped: ${summary.skipped}, failed: ${summary.failed}.`,
      );
      await loadConnectionStatus();
    } catch {
      // The hook surfaces an error banner; this block avoids unhandled rejections.
    } finally {
      setImporting(false);
    }
  }, [selectedPortfolioId, selectedConnectionId, importFromIbkr, loadConnectionStatus]);

  const rows = useMemo<TransactionViewModel[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        trade_date: item.trade_date.slice(0, 10),
        name: item.name,
        ticker: item.ticker,
        trade_type: item.trade_type.toUpperCase() as "BUY" | "SELL",
        quantity: item.quantity,
        price: item.price,
        commission: item.commission,
        total: item.total,
        currency: item.currency,
        asset_type: toAssetTypeLabel(item.asset_type),
        notes: item.notes,
      })),
    [items],
  );

  const years = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((row) => set.add(row.trade_date.slice(0, 4)));
    return Array.from(set).sort();
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const typeMatch = filters.tradeType === "All" || row.trade_type === filters.tradeType;
        const assetMatch = filters.assetType === "All" || row.asset_type === filters.assetType;
        const yearMatch = filters.year === "All" || row.trade_date.startsWith(filters.year);
        return typeMatch && assetMatch && yearMatch;
      }),
    [filters, rows],
  );

  return (
    <>
      <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#16162a] bg-[#04040a] p-3 sm:p-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <header className="flex flex-col gap-3 rounded-2xl border border-[#1e1e35] bg-[#07070e] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Investments</p>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">Transactions</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedConnectionId ?? ""}
                onChange={(event) => setSelectedConnectionId(Number(event.target.value))}
                disabled={ibkrLoading || ibkrConnections.length === 0}
                className="rounded-xl border border-[#2a3b73] bg-[#0f1633] px-3 py-2 text-sm text-[#b7c8ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ibkrConnections.length === 0 ? (
                  <option value="">No IBKR connections</option>
                ) : (
                  ibkrConnections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
                      {connection.name ?? connection.account_id ?? `Connection ${connection.id}`}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => void loadConnectionStatus()}
                disabled={!selectedConnectionId}
                className="rounded-xl border border-[#2a3b73] bg-[#0f1633] px-4 py-2 text-sm font-semibold text-[#9bb5ff] hover:bg-[#16204a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check Status
              </button>
              <button
                type="button"
                onClick={handleImportIbkr}
                disabled={importing || !selectedPortfolioId || !selectedConnectionId}
                className="rounded-xl border border-[#2a3b73] bg-[#0f1633] px-4 py-2 text-sm font-semibold text-[#9bb5ff] hover:bg-[#16204a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing ? "Importing IBKR..." : "Import from IBKR"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf] hover:bg-[#14b8a6]/20"
              >
                Add Transaction
              </button>
            </div>
          </header>

          {loading ? <p className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-4 text-sm text-neutral-300">Loading transactions...</p> : null}
          {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}
          {ibkrError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{ibkrError}</p> : null}
          {connectionStatus ? (
            <p className="rounded-2xl border border-[#2a3b73]/60 bg-[#0f1633] p-4 text-sm text-[#b7c8ff]">{connectionStatus}</p>
          ) : null}
          {importNotice ? (
            <p className="rounded-2xl border border-[#2a3b73]/60 bg-[#0f1633] p-4 text-sm text-[#b7c8ff]">{importNotice}</p>
          ) : null}
          {!importNotice && lastImport ? (
            <p className="rounded-2xl border border-[#2a3b73]/60 bg-[#0f1633] p-4 text-sm text-[#b7c8ff]">
              Last IBKR import: Imported {lastImport.imported}, skipped {lastImport.skipped}, failed {lastImport.failed}.
            </p>
          ) : null}

          <TransactionStats rows={filteredRows} />
          <TransactionsMonthlyHeatmap rows={filteredRows} />
          <TransactionFilters filters={filters} years={years} onChange={setFilters} />

          {!loading && !error && filteredRows.length === 0 ? (
            <p className="rounded-2xl border border-[#1e1e35] bg-[#07070e] p-4 text-sm text-neutral-300">No transactions match the selected filters.</p>
          ) : null}

          <TransactionsTable rows={filteredRows} />
        </div>
      </div>

      {showAddModal && <AddTransactionModal onClose={() => setShowAddModal(false)} onSave={handleAddTransaction} />}
    </>
  );
}
