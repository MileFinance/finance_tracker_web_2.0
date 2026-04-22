export default function DataManagement() {
  return (
    <section className="rounded-md bg-transparent border border-surface p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Data management</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Data Actions</h2>
      </header>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-sm bg-transparent border border-surface px-4 py-2 text-sm font-semibold text-white"
        >
          Export All Data
        </button>
        <button
          type="button"
          className="rounded-sm bg-transparent border border-surface px-4 py-2 text-sm font-semibold text-white"
        >
          Archive Old Transactions
        </button>
        <button
          type="button"
          className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300"
        >
          Delete Portfolio
        </button>
      </div>
    </section>
  );
}
