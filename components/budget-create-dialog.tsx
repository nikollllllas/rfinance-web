"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCategories } from "@/hooks/use-categories"
import { budgetsControllerCreate } from "@/lib/api/budgets/budgets-controller-create"
import { kubbClientConfig } from "@/lib/kubb-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MonthPicker } from "./ui/monthpicker"
import { CategoryCreateDialog } from "@/components/category-create-dialog"

interface BudgetCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialMonth?: string // "YYYY-MM"
}

const parseMonth = (value?: string) => {
  if (!value) return new Date()
  const [year, month] = value.split("-").map(Number)
  return new Date(year, month - 1)
}

const toBudgetMonth = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

export function BudgetCreateDialog({ open, onOpenChange, onSuccess, initialMonth }: BudgetCreateDialogProps) {
  const { toast } = useToast()
  const { categories, isLoading: categoriesLoading, refreshCategories } = useCategories()
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [month, setMonth] = useState<Date>(() => parseMonth(initialMonth))
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    if (open) setMonth(parseMonth(initialMonth))
  }, [open, initialMonth])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const incomeCategories = categories.filter((c) => c.type === "GANHO")
  const expenseCategories = categories.filter((c) => c.type === "GASTO")
  const bothCategories = categories.filter((c) => c.type === "AMBOS")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const budgetData = {
        amount: Number.parseFloat(amount),
        budgetMonth: toBudgetMonth(month),
        categoryId,
      }

      await budgetsControllerCreate(budgetData as any, kubbClientConfig)

      toast({
        title: "Orçamento criado",
        description: "Seu orçamento foi criado com sucesso.",
      })

      setAmount("")
      setCategoryId("")

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erro ao criar orçamento:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao criar orçamento",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
          <DialogDescription>Defina um orçamento para uma categoria</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="category">Categoria</Label>
              <Select required name="category" value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Carregando categorias...
                    </SelectItem>
                  ) : incomeCategories.length === 0 && expenseCategories.length === 0 && bothCategories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
                  ) : (
                    <>
                      {expenseCategories.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Gasto</SelectLabel>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                      {bothCategories.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Ganho e Gasto</SelectLabel>
                          {bothCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                      {incomeCategories.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Ganho</SelectLabel>
                          {incomeCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={() => setIsCategoryDialogOpen(true)}
              >
                + Nova categoria
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor do Orçamento</Label>
              <CurrencyInput
                id="amount"
                name="amount"
                required
                value={amount}
                onValueChange={setAmount}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="budgetMonth">Mês do Orçamento</Label>
              <MonthPicker
                selectedMonth={month}
                onMonthSelect={(newMonth) => setMonth(newMonth)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || categoriesLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Orçamento"
              )}
            </Button>
          </DialogFooter>
        </form>
        {/* Dentro do DialogContent (fora do <form>) para o Radix empilhar os diálogos. */}
        <CategoryCreateDialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
          defaultType="GASTO"
          onSuccess={async (category) => {
            await refreshCategories()
            setCategoryId(category.id)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
