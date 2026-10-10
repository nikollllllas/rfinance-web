"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { TransactionAttachments } from "@/components/transaction-attachments"
import { useTransactionsControllerGetById } from "@/lib/api/transactions/hooks/useTransactionsControllerGetById"
import { getInstallmentSuffix, getPaymentMethodLabel } from "@/lib/installment-utils"
import { cn, formatCurrency } from "@/lib/utils"

const VIEW_PARAM = "view"

let openedInApp = false

export function openTransactionView(id: string) {
  const params = new URLSearchParams(window.location.search)
  params.set(VIEW_PARAM, id)
  openedInApp = true
  window.history.pushState(null, "", `?${params.toString()}`)
}

function closeTransactionView(pathname: string) {
  if (openedInApp) {
    openedInApp = false
    window.history.back()
    return
  }
  const params = new URLSearchParams(window.location.search)
  params.delete(VIEW_PARAM)
  const query = params.toString()
  window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname)
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
})

const tagLabels: Record<string, string> = {
  FALTA: "Falta",
  PAGO: "Pago",
  RECEBIDO: "Recebido",
  DEVOLVER: "Devolver",
  ECONOMIA: "Economia",
}

interface TransactionViewDialogProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TransactionViewDialog({ onEdit, onDelete }: TransactionViewDialogProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get(VIEW_PARAM)

  useEffect(() => {
    if (!transactionId) openedInApp = false
  }, [transactionId])

  const { data: transaction, isLoading, error } = useTransactionsControllerGetById(
    { path: { id: transactionId ?? "" } },
    { query: { enabled: Boolean(transactionId) } }
  )

  const close = () => closeTransactionView(pathname)

  const handleAction = (action: (id: string) => void) => {
    if (!transactionId) return
    const id = transactionId
    close()
    action(id)
  }

  const installmentSuffix = transaction
    ? getInstallmentSuffix(transaction.installmentIndex, transaction.installmentCount)
    : null
  const paymentMethodLabel = transaction ? getPaymentMethodLabel(transaction.paymentMethod) : null

  return (
    <Dialog open={Boolean(transactionId)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[560px]">
        {isLoading || (!transaction && !error) ? (
          <>
            <DialogTitle className="sr-only">Carregando transação</DialogTitle>
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Carregando transação...</p>
            </div>
          </>
        ) : error || !transaction ? (
          <DialogHeader>
            <DialogTitle>Transação não encontrada</DialogTitle>
            <DialogDescription>
              A transação pode ter sido excluída ou ocorreu um erro ao carregá-la.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader className="pr-6 text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 wrap-anywhere">
                  <DialogTitle className="text-xl">
                    {transaction.description}
                    {installmentSuffix ? ` ${installmentSuffix}` : ""}
                  </DialogTitle>
                  <DialogDescription>{dateFormatter.format(new Date(transaction.date))}</DialogDescription>
                </div>
                <div
                  className={cn(
                    "whitespace-nowrap font-display text-2xl font-bold",
                    transaction.type === "GANHO"
                      ? "text-green-600 dark:text-green-500"
                      : "text-destructive"
                  )}
                >
                  {transaction.type === "GANHO" ? "+" : "-"}
                  {formatCurrency(Math.abs(Number(transaction.amount)))}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Tipo</h3>
                  <p className="font-medium">{transaction.type === "GANHO" ? "Ganho" : "Gasto"}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Categoria</h3>
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: transaction.category.color }}
                    />
                    <p className="font-medium">{transaction.category.name}</p>
                  </div>
                </div>
                {transaction.tag ? (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Tag</h3>
                    <p className="font-medium">{tagLabels[transaction.tag] ?? transaction.tag}</p>
                  </div>
                ) : null}
                {transaction.type === "GASTO" && paymentMethodLabel ? (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Meio de pagamento</h3>
                    <p className="font-medium">{paymentMethodLabel}</p>
                    {transaction.installmentIndex != null &&
                    transaction.installmentCount != null &&
                    transaction.installmentCount >= 2 ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Parcela {transaction.installmentIndex} de {transaction.installmentCount}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {transaction.notes ? (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Observações</h3>
                    <p className="whitespace-pre-wrap">{transaction.notes}</p>
                  </div>
                </>
              ) : null}

              <Separator />

              <TransactionAttachments transactionId={transaction.id} />

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="mb-1 font-medium text-muted-foreground">Criado em</h3>
                  <p>{dateTimeFormatter.format(new Date(transaction.createdAt))}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-muted-foreground">Última atualização</h3>
                  <p>{dateTimeFormatter.format(new Date(transaction.updatedAt))}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => handleAction(onDelete)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
              <Button onClick={() => handleAction(onEdit)}>
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
