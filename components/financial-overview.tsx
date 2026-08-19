"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { DashboardData } from "@/lib/api-types";
import { formatCurrency } from "@/lib/utils";

interface FinancialOverviewProps {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
}

const COLOR_INCOME = "hsl(var(--success))";
const COLOR_EXPENSES = "hsl(var(--destructive))";
const COLOR_SAVINGS = "hsl(var(--warning))";

export default function FinancialOverview({dashboardData, isLoading, error}: FinancialOverviewProps) {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados financeiros...</span>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-destructive">Erro ao carregar dados financeiros.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={dashboardData.monthlyData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={(value) => `R$${value}`}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), undefined]}
          labelFormatter={(label) => `Mês: ${label}`}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
          }}
        />
        <Legend
          payload={[
            { value: "Ganhos", type: "line", color: COLOR_INCOME },
            { value: "Gastos", type: "line", color: COLOR_EXPENSES },
            { value: "Economia", type: "line", color: COLOR_SAVINGS },
          ]}
        />
        <Line
          type="monotone"
          dataKey="income"
          name="Ganhos"
          stroke={COLOR_INCOME}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          name="Gastos"
          stroke={COLOR_EXPENSES}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="savings"
          name="Economia"
          stroke={COLOR_SAVINGS}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
