import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthNavigatorProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthNavigator({ year, month, onPrev, onNext }: MonthNavigatorProps) {
  return (
    <div className="flex items-center gap-1 border border-border px-1 py-0.5">
      <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[140px] text-center tabular-nums">
        {MONTHS[month - 1]} {year}
      </span>
      <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
