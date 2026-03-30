import type { PositionViewModel } from "@/app/components/mainApp/positions/types";
import PositionCard from "@/app/components/mainApp/positions/positionCard";

type PositionsListProps = {
  positions: PositionViewModel[];
};

export default function PositionsList({ positions }: PositionsListProps) {
  return (
    <section className="grid gap-3 lg:grid-cols-2">
      {positions.map((position) => (
        <PositionCard key={position.id} position={position} />
      ))}
    </section>
  );
}
