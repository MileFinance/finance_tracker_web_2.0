type DateRange = "3M" | "6M" | "1Y";

type DateRangePickerProps = {
  selected: DateRange;
  onSelect: (range: DateRange) => void;
};

const options: DateRange[] = ["3M", "6M", "1Y"];

export default function DateRangePicker({ selected, onSelect }: DateRangePickerProps) {
  return (
    <div className="inline-flex rounded-sm bg-transparent border border-surface p-1 text-xs font-medium text-neutral-300">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-sm px-3 py-1 ${selected === option ? "bg-[#1e1e35] text-white" : "text-neutral-300"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
