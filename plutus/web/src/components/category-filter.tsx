import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CategoryFilterProps {
  categories: string[];
  selected: string[];
  onToggle: (category: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export function CategoryFilter({
  categories,
  selected,
  onToggle,
  onSelectAll,
  onClear,
}: CategoryFilterProps) {
  const allSelected = selected.length === categories.length;

  return (
    <Popover>
      <PopoverTrigger
        render={
           <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-transparent hover:bg-transparent">
            <ChevronsUpDown className="h-3.5 w-3.5" />
            <span className="text-sm">
              {allSelected
                ? "All categories"
                : `${selected.length} categor${selected.length === 1 ? "y" : "ies"}`}
            </span>
          </Button>
        }
      />
      <PopoverContent align="end" className="w-52 p-2">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <button
            onClick={onSelectAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Select all
          </button>
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="grid gap-0.5">
          {categories.map((cat) => {
            const isSelected = selected.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => onToggle(cat)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors cursor-pointer"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-input"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
                <span className={isSelected ? "" : "text-muted-foreground"}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
