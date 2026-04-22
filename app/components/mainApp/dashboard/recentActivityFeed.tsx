import type { Transaction } from "@/lib/api/types";
import { Skeleton } from "@/app/components/ui/skeleton";

type Props = {
  transactions: Transaction[];
  loading?: boolean;
};

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export default function RecentActivityFeed({ transactions, loading }: Props) {
  const recent = transactions.slice(0, 10);

  return (
    <section className="rounded-md bg-transparent border border-surface p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Recent activity</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Latest Transactions</h3>
      </header>

      {loading && recent.length === 0 && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-surface p-3">
              <div className="flex flex-col gap-2 w-1/2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </div>
              <Skeleton className="h-3 w-1/5" />
            </div>
          ))}
        </div>
      )}

      {!loading && recent.length === 0 && (
        <p className="text-sm text-neutral-500">No transactions yet.</p>
      )}

      <ul className="space-y-3">
        {recent.map((tx) => {
          const isBuy = tx.trade_type === "buy";
          return (
            <li key={tx.id} className="rounded-md bg-transparent border border-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{tx.name} <span className="text-neutral-400">({tx.ticker})</span></p>
                  <p className="text-xs text-neutral-400">{tx.trade_date.slice(0, 10)} · Qty {tx.quantity} · {eur.format(tx.price)}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${isBuy ? "bg-violet-500/20 text-violet-300" : "bg-orange-500/20 text-orange-300"}`}>
                    {tx.trade_type.toUpperCase()}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white">{eur.format(tx.total)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
