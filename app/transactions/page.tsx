"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonthSelect } from "@/components/month-select";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Plus,
  Search,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatCurrency, formatDate, formatMonthDisplay } from "@/lib/utils"
import {
  getInstallmentSuffix,
  getPaymentMethodLabel,
} from "@/lib/installment-utils"
import { useTransactions } from "@/hooks/use-transactions"
import { useAvailableMonths } from "@/hooks/use-available-months";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TransactionEditDialog } from "@/components/transaction-edit-dialog";
import { Badge } from "@/components/ui/badge";
import { TransactionCreateDialog } from "@/components/transaction-create-dialog";
import { InlineTagEditor } from "@/components/inline-tag-editor";

export default function TransactionsPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const {
    transactions,
    isLoading,
    error,
    removeTransaction,
    refreshTransactions,
  } = useTransactions(selectedMonth)
  
  const { months: availableMonths } = useAvailableMonths()
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null)
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTransactionChanged = () => {
    refreshTransactions();
    setRefreshKey((prev) => prev + 1);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
  }

  const totalExpenses = transactions.reduce(
    (acc, transaction) =>
      acc + Number(transaction.type === "GASTO" ? transaction.amount : 0),
    0
  )
  const totalIncome = transactions.reduce(
    (acc, transaction) =>
      acc + Number(transaction.type === "GANHO" ? transaction.amount : 0),
    0
  )
  const monthlyBalance = totalIncome - totalExpenses
  const monthlyBalanceDisplay =
    monthlyBalance < 0
      ? `-${formatCurrency(Math.abs(monthlyBalance))}`
      : formatCurrency(monthlyBalance)

  const SkeletonTable = () => (
    <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-[1] min-w-[200px] border-r bg-card md:static md:min-w-0 md:border-r-0">Descrição</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-px text-right md:w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="sticky left-0 z-[1] min-w-[200px] border-r bg-card md:static md:min-w-0 md:border-r-0"><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
              <TableCell>
                <div className="flex justify-end gap-1 md:gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="hidden h-8 w-8 rounded md:block" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="flex min-h-14 items-center gap-2 px-4 py-2 md:px-6">
          <div className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="truncate font-display text-lg">Transações</span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <MonthSelect
              value={selectedMonth}
              onValueChange={handleMonthChange}
              months={availableMonths}
            />
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)} aria-label="Nova Transação">
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Nova Transação</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {isLoading && transactions.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando transações...</span>
            </div>
          ) : error ? (
            <div className="rounded-md border border-destructive p-4 text-center">
              <p className="text-destructive">
                Erro ao carregar transações. Por favor, tente novamente.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhuma transação encontrada para {formatMonthDisplay(selectedMonth)}.
              </p>
              <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                Adicionar Nova Transação
              </Button>
            </div>
          ) : (
            <>
              {isLoading ? <SkeletonTable /> : (
                <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 z-[1] min-w-[200px] border-r bg-card md:static md:min-w-0 md:border-r-0">Descrição</TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-px text-right md:w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const installmentSuffix = getInstallmentSuffix(
                        transaction.installmentIndex,
                        transaction.installmentCount
                      );
                      const paymentLabel = getPaymentMethodLabel(
                        transaction.paymentMethod
                      );
                      return (
                      <TableRow key={`${transaction.id}-${refreshKey}`}>
                        <TableCell className="sticky left-0 z-[1] min-w-[200px] border-r bg-card md:static md:min-w-0 md:border-r-0 font-medium">
                          <div className="flex flex-col gap-0.5 wrap-anywhere">
                            <Link
                              href={`/transactions/${transaction.id}`}
                              className="hover:underline"
                            >
                              {transaction.description}
                              {installmentSuffix
                                ? ` ${installmentSuffix}`
                                : ""}
                            </Link>
                            {transaction.type === "GASTO" && paymentLabel ? (
                              <span className="text-xs font-normal text-muted-foreground">
                                {paymentLabel}
                              </span>
                            ) : null}
                            {/* No mobile, categoria e data saem das colunas e vêm pra cá */}
                            <span className="text-xs font-normal text-muted-foreground md:hidden">
                              {transaction.category?.name || "Sem categoria"} • {formatDate(transaction.date.toString())}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.category?.name || "Sem categoria"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(transaction.date.toString())}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <InlineTagEditor
                            transactionId={transaction.id}
                            currentTag={transaction.tag ?? null}
                            onSuccess={handleTransactionChanged}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {transaction.type === "GANHO" ? (
                              <ArrowUpIcon className="hidden h-4 w-4 text-green-600 dark:text-green-500 sm:block" />
                            ) : (
                              <ArrowDownIcon className="hidden h-4 w-4 text-destructive sm:block" />
                            )}
                            <span
                              className={cn(
                                "whitespace-nowrap font-medium",
                                transaction.type === "GANHO"
                                  ? "text-green-600 dark:text-green-500"
                                  : "text-destructive"
                              )}
                            >
                              {transaction.type === "GANHO" ? "+" : "-"}
                              {formatCurrency(Number(transaction.amount))}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="md:hidden">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Mais ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/transactions/${transaction.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => setEditingTransactionId(transaction.id)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => setDeletingTransactionId(transaction.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Apagar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div className="hidden justify-end gap-2 md:flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setEditingTransactionId(transaction.id)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingTransactionId(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex flex-wrap justify-end gap-x-6 gap-y-1 border-t p-4 text-sm">
                  <span>
                    <span className="font-medium">Total de Gastos:</span>{" "}
                    {formatCurrency(totalExpenses)}
                  </span>
                  <span>
                    <span className="font-medium">Saldo do mês:</span>{" "}
                    <span
                      className={cn(
                        "font-medium",
                        monthlyBalance < 0 ? "text-destructive" : "text-green-600 dark:text-green-500"
                      )}
                    >
                      {monthlyBalanceDisplay}
                    </span>
                  </span>
                </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {editingTransactionId && (
        <TransactionEditDialog
          transactionId={editingTransactionId}
          open={!!editingTransactionId}
          onOpenChange={(open) => {
            if (!open) setEditingTransactionId(null);
          }}
          onSuccess={handleTransactionChanged}
        />
      )}

      <AlertDialog
        open={!!deletingTransactionId}
        onOpenChange={(open) => {
          if (!open) setDeletingTransactionId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá
              permanentemente esta transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingTransactionId) removeTransaction(deletingTransactionId);
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TransactionCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleTransactionChanged}
      />
    </div>
  );
}
