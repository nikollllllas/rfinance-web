"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { DashboardData } from "@/lib/api-types";
import { formatCurrency } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { getBudgetStatusColors } from "@/lib/budget-status-colors";

interface BudgetProgressProps {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
}

export default function BudgetProgress({
  dashboardData,
  isLoading,
  error,
}: BudgetProgressProps) {
  const { categories } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando orçamentos...</span>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-destructive">Erro ao carregar dados de orçamento.</p>
      </div>
    );
  }

  if (dashboardData.budgets.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-muted-foreground">Nenhum orçamento definido.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dashboardData.budgets.map((budget: any) => {
        const percentage = Math.min(
          Math.round((budget.current / budget.max) * 100),
          100,
        );
        const isOverBudget = budget.current > budget.max;
        const categoryType = (budget.categoryType ??
          categories.find((category) => category.name === budget.category)
            ?.type) as "GANHO" | "GASTO" | "AMBOS" | undefined;
        const { track, indicator, text, showOverBudgetWarning } = getBudgetStatusColors(
          categoryType,
          isOverBudget,
        );

        return (
          <div key={budget.id} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{budget.category}</span>
              <span className={text}>
                {formatCurrency(budget.current)} / {formatCurrency(budget.max)}
                {showOverBudgetWarning && " (Acima do orçamento)"}
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-[7px] ${track}`}
              indicatorClassName={indicator}
            />
          </div>
        );
      })}
    </div>
  );
}
