"use client"

import { useTransactionsControllerListMonths } from "@/lib/api/transactions/hooks/useTransactionsControllerListMonths"

export function useAvailableMonths() {
  const monthsQuery = useTransactionsControllerListMonths()

  return {
    months: (monthsQuery.data ?? []) as string[],
    isLoading: monthsQuery.isLoading,
    error: monthsQuery.error as Error | null,
  }
}
