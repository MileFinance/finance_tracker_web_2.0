const actions = [
  "Add Transaction",
  "Update Prices",
  "Record Dividend",
  "Create Snapshot",
  "View Full Report",
];

export default function QuickActionsPanel() {
  return (
    <section className="rounded-md bg-neutral-900 p-4 shadow-lg">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#b6f55a]">ACTIONS</p>
      <p className="mt-2 text-sm text-neutral-300">Actions are handled in their respective sections:</p>
      <p className="mt-2 text-xs text-neutral-400">{actions.join(" • ")}</p>
    </section>
  );
}
