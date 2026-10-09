"use client"

import { useCallback } from "react"
import { type Budget, type BudgetData } from "@/lib/api-types"
import { useBudgetsControllerList } from "@/lib/api/budgets/hooks/useBudgetsControllerList"
import { useBudgetsControllerCreate } from "@/lib/api/budgets/hooks/useBudgetsControllerCreate"
import { useBudgetsControllerUpdate } from "@/lib/api/budgets/hooks/useBudgetsControllerUpdate"
import { useBudgetsControllerRemove } from "@/lib/api/budgets/hooks/useBudgetsControllerRemove"
import { useBudgetsControllerReplicate } from "@/lib/api/budgets/hooks/useBudgetsControllerReplicate"
import { useBudgetsControllerProgress } from "@/lib/api/budgets/hooks/useBudgetsControllerProgress"
import { useToast } from "@/hooks/use-toast"

export function useBudgets() {
  const { toast } = useToast()
  const budgetsQuery = useBudgetsControllerList(undefined)
  const createMutation = useBudgetsControllerCreate()
  const updateMutation = useBudgetsControllerUpdate()
  const removeMutation = useBudgetsControllerRemove()
  const replicateMutation = useBudgetsControllerReplicate()
  const budgets = (budgetsQuery.data ?? []) as Budget[]

  const addBudget = useCallback(
    async (data: BudgetData) => {
      try {
        const newBudget = await createMutation.mutateAsync({ body: data })
        await budgetsQuery.refetch()
        toast({
          title: "Sucesso",
          description: "Orçamento criado com sucesso",
        })
        return newBudget
      } catch (err) {
        toast({
          title: "Erro",
          description: err instanceof Error ? err.message : "Falha ao criar orçamento",
          variant: "destructive",
        })
        throw err
      }
    },
    [createMutation, budgetsQuery, toast],
  )

  const editBudget = useCallback(
    async (id: string, data: Partial<BudgetData>) => {
      try {
        const updatedBudget = await updateMutation.mutateAsync({ path: { id }, body: data })
        await budgetsQuery.refetch()
        toast({
          title: "Sucesso",
          description: "Orçamento atualizado com sucesso",
        })
        return updatedBudget
      } catch (err) {
        toast({
          title: "Erro",
          description: err instanceof Error ? err.message : "Falha ao atualizar orçamento",
          variant: "destructive",
        })
        throw err
      }
    },
    [updateMutation, budgetsQuery, toast],
  )

  // Sem toast: quem chama mostra o feedback (evita toast duplicado).
  const removeBudget = useCallback(
    async (id: string) => {
      await removeMutation.mutateAsync({ path: { id } })
      await budgetsQuery.refetch()
    },
    [removeMutation, budgetsQuery],
  )

  const replicateBudgetsFromPreviousMonth = useCallback(
    async (targetMonth: string) => {
      try {
        const result = await replicateMutation.mutateAsync({
          body: { action: "replicate", targetMonth },
        })
        await budgetsQuery.refetch()
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        return (result.budgets ?? []) as Budget[]
      } catch (err) {
        toast({
          title: "Erro...",
          description: err instanceof Error ? err.message : "Failed to replicate budgets",
          variant: "destructive",
        })
        throw err
      }
    },
    [replicateMutation, budgetsQuery, toast],
  )

  return {
    budgets,
    isLoading: budgetsQuery.isLoading,
    error: (budgetsQuery.error as Error | null) ?? null,
    refreshBudgets: async () => {
      await budgetsQuery.refetch()
    },
    addBudget,
    editBudget,
    removeBudget,
    replicateBudgetsFromPreviousMonth,
    getBudgetById: useCallback((id: string) => budgets.find((b) => b.id === id), [budgets]),
    getBudgetsByCategory: useCallback(
      (categoryId: string) => budgets.filter((b) => b.categoryId === categoryId),
      [budgets],
    ),
  }
}

export function useBudgetProgress(budgetId: string) {
  const progressQuery = useBudgetsControllerProgress({ path: { id: budgetId } }, {
    query: {
      enabled: Boolean(budgetId),
    },
  })
  const progressData = (progressQuery.data ?? { current: 0, max: 0, transactionCount: 0 }) as {
    current: number
    max: number
    transactionCount?: number
  }
  const percentage =
    progressData.max > 0
      ? Math.min(Math.round((progressData.current / progressData.max) * 100), 100)
      : 0

  return {
    progress: {
      current: progressData.current ?? 0,
      percentage,
      isOverBudget: (progressData.current ?? 0) > (progressData.max ?? 0),
      transactionCount: progressData.transactionCount ?? 0,
    },
    isLoading: progressQuery.isLoading,
    error: (progressQuery.error as Error | null) ?? null,
  }
}

