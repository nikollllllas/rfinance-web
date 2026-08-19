export type BudgetCategoryType = "GANHO" | "GASTO" | "AMBOS" | undefined

export function getBudgetStatusColors(categoryType: BudgetCategoryType, isOverBudget: boolean) {
  if (categoryType === "GASTO") {
    return {
      track: "bg-destructive/15",
      indicator: "bg-destructive",
      text: "text-destructive",
      showOverBudgetWarning: isOverBudget,
    }
  }
  if (categoryType === "GANHO") {
    return {
      track: "bg-success/15",
      indicator: "bg-success",
      text: "text-success",
      showOverBudgetWarning: false,
    }
  }
  if (categoryType === "AMBOS") {
    return {
      track: "bg-warning/15",
      indicator: "bg-warning",
      text: "text-warning",
      showOverBudgetWarning: isOverBudget,
    }
  }
  return {
    track: "bg-muted",
    indicator: "bg-muted-foreground/50",
    text: "text-muted-foreground",
    showOverBudgetWarning: false,
  }
}
