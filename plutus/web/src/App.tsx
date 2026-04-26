import { useEffect, useState } from "react";
import { MonthNavigator } from "@/components/month-navigator";
import { CategoryChart, PALETTE } from "@/components/category-chart";
import { CategoryFilter } from "@/components/category-filter";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseFormModal } from "@/components/expense-form-modal";
import {
  type Expense,
  type CreateExpense,
  type UpdateExpense,
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/api";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function todayYm() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function App() {
  const { year: initY, month: initM } = todayYm();
  const [year, setYear] = useState(initY);
  const [month, setMonth] = useState(initM);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const pageSize = 10;

  const dateFrom = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const dateTo = `${year}-${pad(month)}-${pad(lastDay)}`;

  useEffect(() => {
    let cancelled = false;
    listExpenses({ date_from: dateFrom, date_to: dateTo, limit: 1000 })
      .then((data) => {
        if (!cancelled) {
          setExpenses(data);
          const cats = [...new Set(data.map((e: Expense) => e.category ?? "Uncategorized"))];
          setSelectedCategories(cats);
        }
      })
      .catch((err) => console.error("Failed to load expenses", err));
    return () => { cancelled = true; };
  }, [dateFrom, dateTo, refreshKey]);

  function changeMonth(delta: number) {
    setPage(1);
    setMonth((m) => {
      const next = m + delta;
      if (next < 1) { setYear((y) => y - 1); return 12; }
      if (next > 12) { setYear((y) => y + 1); return 1; }
      return next;
    });
  }

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(id);
    setRefreshKey((k) => k + 1);
  }

  async function handleSubmit(data: CreateExpense | UpdateExpense) {
    if (editing) {
      await updateExpense(editing.id, data as UpdateExpense);
    } else {
      await createExpense(data as CreateExpense);
    }
    setRefreshKey((k) => k + 1);
  }

  const categories = [...new Set(expenses.map((e) => e.category ?? "Uncategorized"))];
  const filteredTotal = expenses
    .filter((e) => selectedCategories.includes(e.category ?? "Uncategorized"))
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPages = Math.max(1, Math.ceil(expenses.length / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  return (
    <div className="min-h-screen flex justify-center">
      <header className="fixed top-0 left-0 right-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center h-12 px-4 md:px-8 lg:px-12 max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary flex items-center justify-center text-xs font-[590] text-primary-foreground">
              ₱
            </div>
            <span className="text-base font-[590] text-foreground tracking-[-0.02em]">Plutus</span>
          </div>
        </div>
      </header>
      <main className="px-4 pt-20 pb-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12 max-w-[1100px] w-full">
        <div className="mb-8">
          <div className="mb-2">
            <h2 className="text-[1.25rem] font-[510] tracking-[-0.2px] text-foreground">
              Expenses
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monthly spending broken down by category.
            </p>
          </div>

          <div className="mb-4 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex justify-center md:justify-start">
              <MonthNavigator
                year={year}
                month={month}
                onPrev={() => changeMonth(-1)}
                onNext={() => changeMonth(1)}
              />
            </div>
            <div className="flex items-center justify-between md:justify-end md:gap-3">
              {categories.length > 1 && (
                <CategoryFilter
                  categories={categories}
                  selected={selectedCategories}
                  onToggle={(cat) =>
                    setSelectedCategories((prev) =>
                      prev.includes(cat)
                        ? prev.filter((c) => c !== cat)
                        : [...prev, cat]
                    )
                  }
                  onSelectAll={() => setSelectedCategories(categories)}
                  onClear={() => setSelectedCategories([])}
                />
              )}
              <span className="text-sm text-muted-foreground">
                Total:{" "}
                <span className="font-mono tabular-nums font-medium text-foreground">
                  ${filteredTotal.toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          <div className="border border-border p-3 md:p-5">
            <CategoryChart expenses={expenses} selectedCategories={selectedCategories} />
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                {categories.map((cat) => {
                  const catTotal = expenses
                    .filter((e) => (e.category ?? "Uncategorized") === cat)
                    .reduce((s, e) => s + e.amount, 0);
                  return (
                    <div key={cat} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PALETTE[categories.indexOf(cat) % PALETTE.length] }}
                      />
                      <span className="text-muted-foreground">{cat}</span>
                      <span className="font-mono tabular-nums font-medium text-foreground">
                        ${catTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[1.25rem] font-[510] tracking-[-0.2px] text-foreground">
            History
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your expense logs.
          </p>
        </div>

        <ExpenseTable
          expenses={expenses}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      <ExpenseFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        expense={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
