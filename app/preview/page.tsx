"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardSummary } from "@/components/dashboard-summary";
import FinancialOverview from "@/components/financial-overview";
import ExpensesByCategory from "@/components/expenses-by-category";
import RecentTransactions from "@/components/recent-transactions";
import { previewDashboardData } from "@/lib/preview-fixtures";
import { formatCurrency } from "@/lib/utils";
import { getBudgetStatusColors } from "@/lib/budget-status-colors";

/**
 * Só usa `previewDashboardData` (dados fixos) — nenhum hook do Kubb é importado aqui,
 * então nenhuma requisição real sai para a API.
 */
export default function PreviewDashboardPage() {
  const data = previewDashboardData;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-14 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <span className="font-display text-lg">Painel</span>
          <Button asChild size="sm" className="ml-auto">
            <Link href="/login">
              <Plus className="mr-1 h-4 w-4" />
              Nova Transação
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-[18px] p-4">
        <DashboardSummary dashboardData={data} isLoading={false} error={null} />

        <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-display">Visão Financeira</CardTitle>
              <CardDescription>Sua atividade financeira nos últimos 6 meses:</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialOverview dashboardData={data} isLoading={false} error={null} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-display">Gastos por Categoria</CardTitle>
              <CardDescription>Detalhamento dos seus gastos mensais:</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesByCategory dashboardData={data} isLoading={false} error={null} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-[18px] md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Progresso do Orçamento</CardTitle>
              <CardDescription>Acompanhe suas metas de orçamento:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.budgets.map((budget: any) => {
                const percentage = Math.min(Math.round((budget.current / budget.max) * 100), 100);
                const { track, indicator, text, showOverBudgetWarning } = getBudgetStatusColors(
                  budget.categoryType,
                  budget.current > budget.max,
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
                    <Progress value={percentage} className={`h-[7px] ${track}`} indicatorClassName={indicator} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Transações Recentes</CardTitle>
              <CardDescription>Suas últimas atividades financeiras:</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions dashboardData={data} isLoading={false} error={null} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
