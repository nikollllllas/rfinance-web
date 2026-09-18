"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatBudgetMonth, formatCurrency } from "@/lib/utils";
import { getBudgetStatusColors } from "@/lib/budget-status-colors";
import { previewBudgets } from "@/lib/preview-fixtures";

export default function PreviewBudgetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-14 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <span className="font-display text-lg">Orçamentos</span>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {previewBudgets.map((budget) => {
            const percentage = Math.min(Math.round((budget.current / budget.amount) * 100), 100);
            const { track, indicator, text, showOverBudgetWarning } = getBudgetStatusColors(
              budget.category.type as "GANHO" | "GASTO" | "AMBOS",
              budget.isOverBudget,
            );
            return (
              <Card key={budget.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-display text-lg capitalize">
                      {budget.category.name}
                    </CardTitle>
                    <span className={`text-sm font-medium ${text}`}>{percentage}%</span>
                  </div>
                  <CardDescription>
                    {formatCurrency(budget.amount)} • {formatBudgetMonth(budget.budgetMonth)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={percentage} className={`h-[7px] ${track}`} indicatorClassName={indicator} />
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>Mês: {formatBudgetMonth(budget.budgetMonth)}</span>
                    {showOverBudgetWarning && <span className="text-destructive">Acima do orçamento</span>}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className={text}>
                      {formatCurrency(budget.current)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled title="Faça login para editar">
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" disabled title="Faça login para excluir">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
