"use client";

import { ArrowDown, ArrowUp, PiggyBank, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatChange } from "@/lib/utils";
import { DashboardData } from "@/lib/api-types";

interface DashboardSummaryProps {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
  valueClassName,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof Wallet;
  tone: "neutral" | "success" | "destructive";
  valueClassName?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-[9px]",
            tone === "neutral" && "bg-foreground text-background",
            tone === "success" && "bg-success/15 text-success",
            tone === "destructive" && "bg-destructive/15 text-destructive"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </div>
      <p className={cn("font-display mb-1.5 text-[26px] font-semibold tracking-tight", valueClassName)}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{change}</p>
    </Card>
  );
}

export function DashboardSummary({ dashboardData, isLoading, error }: DashboardSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[128px] rounded-2xl" />
        <Skeleton className="h-[128px] rounded-2xl" />
        <Skeleton className="h-[128px] rounded-2xl" />
        <Skeleton className="h-[128px] rounded-2xl" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-center">
        <p className="text-destructive">
          Erro ao carregar dados do painel. Por favor, tente novamente.
        </p>
      </div>
    );
  }

  const savingsAmount = Number(dashboardData.summary.savings.amount ?? 0);
  const isPositiveSavings = savingsAmount >= 0;

  return (
    <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Saldo Total"
        value={formatCurrency(dashboardData.summary.balance)}
        change={`${formatChange(dashboardData.summary.savings.change)} em relação ao mês anterior`}
        icon={Wallet}
        tone="neutral"
      />
      <StatCard
        label="Ganhos"
        value={formatCurrency(dashboardData.summary.income.amount)}
        change={`${formatChange(dashboardData.summary.income.change)} em relação ao mês anterior`}
        icon={ArrowUp}
        tone="success"
      />
      <StatCard
        label="Gastos"
        value={formatCurrency(dashboardData.summary.expenses.amount)}
        change={`${formatChange(dashboardData.summary.expenses.change)} em relação ao mês anterior`}
        icon={ArrowDown}
        tone="destructive"
      />
      <StatCard
        label="Economia"
        value={formatCurrency(Math.abs(savingsAmount))}
        change={`${isPositiveSavings ? "Economizou" : "Devendo"} · ${formatChange(dashboardData.summary.savings.change)} vs. mês anterior`}
        icon={PiggyBank}
        tone={isPositiveSavings ? "success" : "destructive"}
        valueClassName={isPositiveSavings ? "text-success" : "text-destructive"}
      />
    </div>
  );
}
