import type { PositionWithMetrics } from "@/lib/api/types";
import { Skeleton } from "@/app/components/ui/skeleton";

type Props = {
  positions: PositionWithMetrics[];
  loading?: boolean;
};

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

export default function TopPositionsTable({ positions, loading }: Props) {
  const sorted = [...positions].sort((a, b) => b.total_value - a.total_value).slice(0, 10);

  if (loading && sorted.length === 0) {
    return (
      <section className="rounded-md bg-transparent border border-surface p-5">
        <Skeleton className="mb-4 h-3 w-1/4" />
        <Skeleton className="mb-6 h-6 w-1/2" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-md bg-transparent border border-surface p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Top positions</p>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">Holdings by Value</h3>
        </div>
        <p className="text-xs text-neutral-400">Sorted by total value</p>
      </header>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-500">No positions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-transparent border border-surface text-xs uppercase tracking-[0.12em] text-neutral-400">
              <tr>
                <th className="px-4 py-3">Ticker / Name</th>
                <th className="px-4 py-3">Shares</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Gain / Loss</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const positive = row.gain >= 0;
                return (
                  <tr key={row.id} className="border-t text-neutral-200">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{row.ticker}</p>
                      <p className="text-xs text-neutral-400">{row.name}</p>
                    </td>
                    <td className="px-4 py-3">{row.shares.toFixed(4)}</td>
                    <td className="px-4 py-3">{eur.format(row.current_price)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{eur.format(row.total_value)}</td>
                    <td className={`px-4 py-3 font-semibold ${positive ? "text-[#2dd4bf]" : "text-rose-400"}`}>
                      {`${positive ? "+" : ""}${eur.format(row.gain)} (${(row.gain_percent * 100).toFixed(2)}%)`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
