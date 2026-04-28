type ReturnsPeriodSelectorProps = {
  selected: "Daily" | "Weekly" | "Monthly" | "Yearly";
  onSelect: (period: "Daily" | "Weekly" | "Monthly" | "Yearly") => void;
};

const periods: Array<"Daily" | "Weekly" | "Monthly" | "Yearly"> = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function ReturnsPeriodSelector({ selected, onSelect }: ReturnsPeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-sm bg-transparent border border-surface p-1 text-xs font-medium text-neutral-300">
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onSelect(period)}
          className={`rounded-sm px-3 py-1 ${selected === period ? "bg-[#1e1e35] text-white" : "text-neutral-300"}`}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
