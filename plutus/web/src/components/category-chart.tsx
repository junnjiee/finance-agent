import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { Expense } from "@/lib/api";

interface CategoryChartProps {
  expenses: Expense[];
  selectedCategories: string[];
}

const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
  "var(--color-chart-7)",
  "var(--color-chart-8)",
];

function categoryName(expense: Expense) {
  return expense.category ?? "Uncategorized";
}

function categoryKey(index: number) {
  return `category-${index}`;
}

function getCategoryColor(category: string, categories: string[]) {
  const index = categories.indexOf(category);
  return PALETTE[(index < 0 ? 0 : index) % PALETTE.length];
}

function buildChartData(
  expenses: Expense[],
  selectedCategories: string[],
  allCategories: string[]
) {
  const filtered = expenses.filter(
    (e) => selectedCategories.includes(categoryName(e))
  );
  const categories = [...new Set(filtered.map(categoryName))];
  const keys = new Map(allCategories.map((cat, i) => [cat, categoryKey(i)]));
  const days = new Map<string, Record<string, number | string>>();

  for (const e of filtered) {
    const day = e.date.slice(8, 10);
    const cat = categoryName(e);
    const key = keys.get(cat);
    if (!key) continue;
    if (!days.has(day)) days.set(day, { day: parseInt(day, 10) });
    const entry = days.get(day)!;
    entry[key] = ((entry[key] as number) ?? 0) + e.amount;
  }

  const sorted = [...days.entries()].sort(([a], [b]) => a.localeCompare(b));
  return {
    data: sorted.map(([, v]) => v),
    categories: categories.map((cat) => ({
      key: keys.get(cat)!,
      label: cat,
    })),
  };
}

function buildChartConfig(
  categories: { key: string; label: string }[],
  allCategories: string[]
): ChartConfig {
  const config: ChartConfig = {};
  categories.forEach((cat) => {
    config[cat.key] = {
      label: cat.label,
      color: getCategoryColor(cat.label, allCategories),
    };
  });
  return config;
}

export function CategoryChart({ expenses, selectedCategories }: CategoryChartProps) {
  const allCategories = [...new Set(expenses.map(categoryName))];
  const { data, categories } = buildChartData(expenses, selectedCategories, allCategories);
  const chartConfig = buildChartConfig(categories, allCategories);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
        No expenses for this month
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#62666D", fontSize: 12 }}
            tickFormatter={(v: string) => String(parseInt(v, 10))}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#62666D", fontSize: 12 }}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            content={<ChartTooltipContent labelFormatter={() => "Category"} />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          {categories.map((cat) => (
            <Bar
              key={cat.key}
              dataKey={cat.key}
              stackId="a"
              fill={`var(--color-${cat.key})`}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export { PALETTE };
