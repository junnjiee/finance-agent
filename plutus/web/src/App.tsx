import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
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
  const pageSize = 15;

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
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const filteredTotal = expenses
    .filter((e) => selectedCategories.includes(e.category ?? "Uncategorized"))
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[260px] flex-1 p-12 max-w-[1100px]">
        <div className="mb-8">
          <h1 className="text-[1.75rem] font-[590] tracking-[-0.48px] text-foreground leading-[1.2]">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your expenses
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MonthNavigator
                year={year}
                month={month}
                onPrev={() => changeMonth(-1)}
                onNext={() => changeMonth(1)}
              />
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
            </div>
            <span className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-mono tabular-nums font-medium text-foreground">
                ${filteredTotal.toFixed(2)}
              </span>
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[1.25rem] font-[510] tracking-[-0.2px] text-foreground">
              Expenses
            </h2>
            <span className="text-sm text-muted-foreground">
              Total: <span className="font-mono tabular-nums font-medium text-foreground">${total.toFixed(2)}</span>
            </span>
          </div>
        </div>

        <ExpenseTable
          expenses={expenses}
          page={page}
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
