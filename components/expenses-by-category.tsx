"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Loader2 } from "lucide-react";
import { DashboardData } from "@/lib/api-types";
import { formatCurrency } from "@/lib/utils";

interface ExpensesByCategoryProps {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
}

export default function ExpensesByCategory({dashboardData, isLoading, error}: ExpensesByCategoryProps) {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados de gastos...</span>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-destructive">Erro ao carregar dados de gastos.</p>
      </div>
    );
  }

  if (dashboardData.expensesByCategory.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-muted-foreground">
          Nenhuma gasto registrada neste período.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dashboardData.expensesByCategory}
          cx="50%"
          cy="50%"
          innerRadius={64}
          outerRadius={92}
          paddingAngle={2}
          cornerRadius={4}
          dataKey="value"
          stroke="hsl(var(--card))"
          strokeWidth={2}
        >
          {dashboardData.expensesByCategory.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Valor"]}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
          }}
        />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
