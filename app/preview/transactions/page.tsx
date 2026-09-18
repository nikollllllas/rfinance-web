"use client";

import { ArrowDownIcon, ArrowUpIcon, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { getInstallmentSuffix, getPaymentMethodLabel } from "@/lib/installment-utils";
import { previewTransactions } from "@/lib/preview-fixtures";

const TAG_LABEL: Record<string, string> = {
  FALTA: "Falta",
  PAGO: "Pago",
  RECEBIDO: "Recebido",
  DEVOLVER: "Devolver",
  ECONOMIA: "Economia",
};

const TAG_VARIANT: Record<string, "destructive" | "success" | "received" | "warning"> = {
  FALTA: "destructive",
  PAGO: "success",
  RECEBIDO: "received",
  DEVOLVER: "warning",
  ECONOMIA: "success",
};

export default function PreviewTransactionsPage() {
  const totalExpenses = previewTransactions.reduce(
    (acc, t) => acc + (t.type === "GASTO" ? t.amount : 0),
    0,
  );
  const totalIncome = previewTransactions.reduce(
    (acc, t) => acc + (t.type === "GANHO" ? t.amount : 0),
    0,
  );
  const monthlyBalance = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-14 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <span className="font-display text-lg">Transações</span>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewTransactions.map((transaction) => {
                const installmentSuffix = getInstallmentSuffix(
                  (transaction as any).installmentIndex,
                  (transaction as any).installmentCount,
                );
                const paymentLabel = getPaymentMethodLabel((transaction as any).paymentMethod);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-0.5">
                        <span>
                          {transaction.description}
                          {installmentSuffix ? ` ${installmentSuffix}` : ""}
                        </span>
                        {transaction.type === "GASTO" && paymentLabel ? (
                          <span className="text-xs font-normal text-muted-foreground">
                            {paymentLabel}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.category.name}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      {transaction.tag ? (
                        <Badge variant={TAG_VARIANT[transaction.tag]}>
                          {TAG_LABEL[transaction.tag]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem status</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {transaction.type === "GANHO" ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-500" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-destructive" />
                        )}
                        <span
                          className={cn(
                            "font-medium",
                            transaction.type === "GANHO"
                              ? "text-green-600 dark:text-green-500"
                              : "text-destructive",
                          )}
                        >
                          {transaction.type === "GANHO" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" disabled title="Faça login para editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled
                          className="text-destructive"
                          title="Faça login para excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={4} className="text-right">
                  <span className="font-medium">Total de Gastos: </span>
                  <span>{formatCurrency(totalExpenses)}</span>
                </TableCell>
                <TableCell colSpan={2} className="text-right">
                  <span className="font-medium">Saldo do mês: </span>
                  <span
                    className={cn(
                      "font-medium",
                      monthlyBalance < 0 ? "text-destructive" : "text-green-600 dark:text-green-500",
                    )}
                  >
                    {formatCurrency(monthlyBalance)}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
