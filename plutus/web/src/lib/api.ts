export interface Expense {
  id: number;
  date: string;
  amount: number;
  currency: string;
  name: string;
  category: string | null;
  merchant: string | null;
  description: string | null;
  account: string | null;
  email_id: string | null;
  created_at: string;
}

export interface CreateExpense {
  amount: number;
  currency: string;
  name: string;
  date?: string;
  category?: string;
  merchant?: string;
  description?: string;
  account?: string;
}

export interface UpdateExpense {
  amount?: number;
  currency?: string;
  name?: string;
  date?: string;
  category?: string;
  merchant?: string;
  description?: string;
  account?: string;
}

export interface ListParams {
  date_from?: string;
  date_to?: string;
  category?: string;
  currency?: string;
  merchant?: string;
  amount_min?: number;
  amount_max?: number;
  limit?: number;
}

const API = "/api/expenses/";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function listExpenses(params: ListParams = {}): Promise<Expense[]> {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.set(k, String(v));
  }
  const qs = sp.toString();
  const res = await fetch(qs ? `${API}?${qs}` : API);
  return handle<Expense[]>(res);
}

export async function createExpense(data: CreateExpense): Promise<Expense> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle<Expense>(res);
}

export async function updateExpense(id: number, data: UpdateExpense): Promise<Expense> {
  const res = await fetch(`${API}${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle<Expense>(res);
}

export async function deleteExpense(id: number): Promise<void> {
  const res = await fetch(`${API}${id}`, { method: "DELETE" });
  return handle<void>(res);
}
