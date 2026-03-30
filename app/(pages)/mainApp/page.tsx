"use client";

import { useSearchParams } from "next/navigation";
import Dashboard from "../dashboard/page";
import PositionsView from "@/app/components/mainApp/positions/positionsView";
import TransactionsView from "@/app/components/mainApp/transactions/transactionsView";
import AnalyticsView from "@/app/components/mainApp/analytics/analyticsView";
import BenchmarksView from "@/app/components/mainApp/benchmarks/benchmarksView";
import TaxView from "@/app/components/mainApp/tax/taxView";
import HistoricReturnsView from "@/app/components/mainApp/returns/historicReturnsView";
import SettingsView from "@/app/components/mainApp/settings/settingsView";

function renderView(view: string) {
  switch (view) {
    case "dashboard":
      return <Dashboard />;
    case "positions":
      return <PositionsView />;
    case "transactions":
      return <TransactionsView />;
    case "analytics-performance":
      return <AnalyticsView />;
    case "analytics-benchmarks":
      return <BenchmarksView />;
    case "tax-report":
      return <TaxView />;
    case "returns-history":
      return <HistoricReturnsView />;
    case "settings":
      return <SettingsView />;
    default:
      return <Dashboard />;
  }
}

export default function MainAppPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "dashboard";

  return (
    <main className="flex h-screen w-full gap-4 bg-black">
      {renderView(view)}
    </main>
  );
}