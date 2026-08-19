"use client";

import { ArrowDownIcon, ArrowUpIcon, Loader2 } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  getInstallmentSuffix,
  getPaymentMethodLabel,
} from "@/lib/installment-utils";
import { DashboardData } from "@/lib/api-types";

interface RecentTransactionsProps {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
}

export default function RecentTransactions({dashboardData, isLoading, error}: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Carregando transações...</span>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Erro ao carregar transações.</p>
      </div>
    );
  }

  const recentTransactions = dashboardData.recentTransactions;

  if (recentTransactions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {recentTransactions.map((transaction: any) => {
        const installmentSuffix = getInstallmentSuffix(
          transaction.installmentIndex,
          transaction.installmentCount
        );
        const paymentLabel = getPaymentMethodLabel(transaction.paymentMethod);
        const isIncome = transaction.type === "GANHO";
        return (
        <div
          key={transaction.id}
          className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-muted/60"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px]",
                isIncome ? "bg-success/15" : "bg-destructive/15"
              )}
            >
              {isIncome ? (
                <ArrowUpIcon className="h-4 w-4 text-success" strokeWidth={2.2} />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-destructive" strokeWidth={2.2} />
              )}
            </div>
            <div>
              <p className="text-[13.5px] font-medium">
                {transaction.description}
                {installmentSuffix ? ` ${installmentSuffix}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.category?.name || "Sem categoria"} •{" "}
                {formatDate(transaction.date.toString())}
                {transaction.type === "GASTO" && paymentLabel
                  ? ` • ${paymentLabel}`
                  : ""}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "text-[13.5px] font-semibold",
              isIncome ? "text-success" : "text-destructive"
            )}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(Number(transaction.amount))}
          </div>
        </div>
      );
      })}
    </div>
  );
}
