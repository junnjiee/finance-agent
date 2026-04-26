import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Expense, CreateExpense, UpdateExpense } from "@/lib/api";

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
  onSubmit: (data: CreateExpense | UpdateExpense) => Promise<void>;
}

function emptyForm(): CreateExpense {
  return {
    amount: 0,
    currency: "SGD",
    name: "",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    merchant: "",
    description: "",
    account: "",
  };
}

function toForm(e: Expense | null | undefined): CreateExpense {
  if (!e) return emptyForm();
  return {
    amount: e.amount,
    currency: e.currency,
    name: e.name,
    date: e.date,
    category: e.category ?? "",
    merchant: e.merchant ?? "",
    description: e.description ?? "",
    account: e.account ?? "",
  };
}

export function ExpenseFormModal({ open, onOpenChange, expense, onSubmit }: ExpenseFormModalProps) {
  const isEdit = !!expense;
  const [formState, setFormState] = useState(() => ({
    form: toForm(expense),
    open,
    expense,
  }));
  const [saving, setSaving] = useState(false);
  let form = formState.form;

  if (open && (!formState.open || formState.expense !== expense)) {
    const next = { form: toForm(expense), open, expense };
    setFormState(next);
    form = next.form;
  } else if (!open && formState.open) {
    setFormState({ ...formState, open });
  }

  const set = (key: keyof CreateExpense, value: string | number) =>
    setFormState((state) => ({
      ...state,
      form: { ...state.form, [key]: value },
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const cleaned = { ...form };
      for (const k of ["category", "merchant", "description", "account"] as const) {
        if (!cleaned[k]) (cleaned as Record<string, unknown>)[k] = null;
      }
      if (isEdit) {
        await onSubmit(cleaned as UpdateExpense);
      } else {
        await onSubmit(cleaned as CreateExpense);
      }
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category ?? ""}
                onChange={(e) => set("category", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                value={form.merchant ?? ""}
                onChange={(e) => set("merchant", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
