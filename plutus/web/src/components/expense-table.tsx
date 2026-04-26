import { Plus, MoreVertical, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/lib/api";

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d} ${SHORT_MONTHS[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

interface ExpenseTableProps {
  expenses: Expense[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export function ExpenseTable({
  expenses,
  page,
  pageSize,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const totalPages = Math.max(1, Math.ceil(expenses.length / pageSize));
  const paged = expenses.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Expense
        </Button>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[0.6875rem] font-[510] uppercase tracking-[0.06em]">
                Date
              </TableHead>
              <TableHead className="text-[0.6875rem] font-[510] uppercase tracking-[0.06em]">
                Name
              </TableHead>
              <TableHead className="text-[0.6875rem] font-[510] uppercase tracking-[0.06em]">
                Category
              </TableHead>
              <TableHead className="text-[0.6875rem] font-[510] uppercase tracking-[0.06em]">
                Merchant
              </TableHead>
              <TableHead className="text-right text-[0.6875rem] font-[510] uppercase tracking-[0.06em]">
                Amount
              </TableHead>
              <TableHead className="text-[0.6875rem] font-[510] uppercase tracking-[0.06em]" />
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((e) => (
                <TableRow key={e.id} className="group">
                  <TableCell className="font-mono text-[0.8125rem] tabular-nums">
                    {formatDate(e.date)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{e.name}</TableCell>
                  <TableCell>
                    {e.category ? (
                      <Badge variant="secondary" className="font-[510] rounded-full">
                        {e.category}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[150px] truncate">
                    {e.merchant ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums font-medium text-[0.875rem]">
                    {e.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono text-[0.8125rem] tabular-nums text-muted-foreground">
                    {e.currency}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 hover:bg-secondary transition-colors">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(e)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => onDelete(e.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
