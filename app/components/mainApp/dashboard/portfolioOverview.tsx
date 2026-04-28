
import type { PortfolioSummary } from "@/lib/api/types";
import { Skeleton, SkeletonCard } from "@/app/components/ui/skeleton";

type Props = {
    summary: PortfolioSummary | null;
    loading?: boolean;
};

export default function PortfolioOverview({ summary, loading }: Props) {
    const currency = summary?.base_currency ?? "EUR";

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    return (
        <section className="w-full rounded-md bg-transparent border border-surface p-5">
            <div className="space-y-5">
                <header className="space-y-2">
                    <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Portfolio overview</p>
                    <h2 className="text-xl font-semibold text-white sm:text-2xl">Current Snapshot</h2>
                    <p className="text-sm text-neutral-300">A compact summary of your invested capital and performance.</p>
                </header>

                {loading && !summary && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard className="sm:col-span-2" />
                    </div>
                )}

                {!loading && !summary && (
                    <p className="text-sm text-neutral-500">No summary available.</p>
                )}

                {summary && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <article className="rounded-md bg-transparent border border-surface p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Total Value</p>
                            <p className="mt-2 text-2xl font-black text-white">{formatCurrency(summary.total_value)}</p>
                        </article>

                        <article className="rounded-md bg-transparent border border-surface p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Total Cost</p>
                            <p className="mt-2 text-2xl font-black text-white">{formatCurrency(summary.total_cost)}</p>
                        </article>

                        <article className="rounded-md border bg-transparent border border-surface p-4 sm:col-span-2">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Total Gain</p>
                                    <p className="mt-2 text-2xl font-semibold text-[#2dd4bf]">{formatCurrency(summary.total_gain)}</p>
                                </div>
                                <span className="rounded-full border bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf]">
                                    {(summary.total_gain_percent * 100).toFixed(2)}%
                                </span>
                            </div>
                        </article>
                    </div>
                )}
            </div>
        </section>
    );
}