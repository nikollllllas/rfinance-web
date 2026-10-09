"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/use-categories";
import { CategoryCreateDialog } from "@/components/category-create-dialog";
import { type TransactionData } from "@/lib/api-types";
import { useTransactionsControllerCreate } from "@/lib/api/transactions/hooks/useTransactionsControllerCreate";
import {
  INSTALLMENT_MAX,
  INSTALLMENT_MIN_SPLIT,
  splitInstallmentAmounts,
} from "@/lib/installment-utils";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AttachmentPicker } from "@/components/attachment-picker";
import { transactionAttachmentsControllerUpload } from "@/lib/api/attachments/transactionAttachmentsControllerUpload";

interface TransactionCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type ExpensePaymentMethod = "PIX" | "DEBITO" | "CREDITO";

export const TransactionCreateDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: TransactionCreateDialogProps) => {
  const { toast } = useToast();
  const { categories, isLoading: categoriesLoading, refreshCategories } = useCategories();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const createMutation = useTransactionsControllerCreate();

  const [transactionType, setTransactionType] = useState<"GANHO" | "GASTO">(
    "GASTO"
  );
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<ExpensePaymentMethod>("PIX");
  const [creditInstallments, setCreditInstallments] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const filteredCategories = categories.filter(
    (category) =>
      category.type === transactionType || category.type === "AMBOS"
  );

  const totalNum = Number.parseFloat(amount);
  const isCreditSplit =
    transactionType === "GASTO" &&
    paymentMethod === "CREDITO" &&
    creditInstallments >= INSTALLMENT_MIN_SPLIT;
  const parcelAmounts =
    isCreditSplit && !Number.isNaN(totalNum) && totalNum > 0
      ? splitInstallmentAmounts(totalNum, creditInstallments)
      : [];
  const firstParcel = parcelAmounts[0];
  const lastParcel = parcelAmounts[parcelAmounts.length - 1];
  const showParcelPreview =
    isCreditSplit && parcelAmounts.length > 0 && firstParcel !== undefined;
  const dateLabel =
    isCreditSplit && showParcelPreview ? "Primeira parcela" : "Data";

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate(new Date());
    setCategoryId("");
    setNotes("");
    setTag(null);
    setPaymentMethod("PIX");
    setCreditInstallments(1);
    setPendingFiles([]);
  };

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData: TransactionData = {
        description,
        amount: Number.parseFloat(amount),
        date: date.toISOString(),
        type: transactionType,
        categoryId,
        notes: notes || undefined,
        tag: tag as
          | "FALTA"
          | "PAGO"
          | "RECEBIDO"
          | "DEVOLVER"
          | "ECONOMIA"
          | null
          | undefined,
      };

      if (transactionType === "GASTO") {
        transactionData.paymentMethod = paymentMethod;
        if (
          paymentMethod === "CREDITO" &&
          creditInstallments >= INSTALLMENT_MIN_SPLIT
        ) {
          transactionData.installmentCount = creditInstallments;
        }
      }

      const result = await createMutation.mutateAsync({ body: transactionData as any });
      const newTransactionId = (result as any)?.transactions?.[0]?.id as
        | string
        | undefined;

      if (newTransactionId && pendingFiles.length > 0) {
        setIsUploadingAttachments(true);
        const failedFileNames: string[] = [];
        for (const file of pendingFiles) {
          try {
            await transactionAttachmentsControllerUpload({ path: { transactionId: newTransactionId }, body: { file } });
          } catch {
            failedFileNames.push(file.name);
          }
        }
        if (failedFileNames.length > 0) {
          toast({
            title: "Transação criada, mas alguns comprovantes falharam",
            description: `Não deu pra anexar: ${failedFileNames.join(", ")}. Tente de novo em Editar.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Transação criada",
            description: "Comprovante anexado com sucesso.",
          });
        }
      } else {
        toast({
          title: "Transação criada",
          description: "Sua transação foi criada com sucesso.",
        });
      }

      handleDialogOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Falha ao criar transação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploadingAttachments(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value as "GANHO" | "GASTO");
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova receita ou despesa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Tipo de Transação</Label>
              <RadioGroup
                value={transactionType}
                className="flex gap-4"
                onValueChange={handleTypeChange}
                name="type"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GASTO" id="GASTO" />
                  <Label htmlFor="GASTO" className="cursor-pointer">
                    Despesa
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GANHO" id="GANHO" />
                  <Label htmlFor="GANHO" className="cursor-pointer">
                    Receita
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                placeholder="ex: Compras no supermercado"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <CurrencyInput
                id="amount"
                name="amount"
                required
                value={amount}
                onValueChange={setAmount}
                aria-describedby={showParcelPreview ? "installment-preview" : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{dateLabel}</Label>
              <DatePicker
                date={date}
                setDate={(newDate) => newDate && setDate(newDate)}
              />
              <input type="hidden" name="date" value={date.toISOString()} />
            </div>

            {transactionType === "GASTO" ? (
              <div className="space-y-3 sm:col-span-2">
                <Label>Meio de pagamento</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => {
                    setPaymentMethod(v as ExpensePaymentMethod);
                    if (v !== "CREDITO") {
                      setCreditInstallments(1);
                    }
                  }}
                  className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
                  name="paymentMethod"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PIX" id="pay-pix" />
                    <Label htmlFor="pay-pix" className="cursor-pointer">
                      Pix
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DEBITO" id="pay-debito" />
                    <Label htmlFor="pay-debito" className="cursor-pointer">
                      Débito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CREDITO" id="pay-credito" />
                    <Label htmlFor="pay-credito" className="cursor-pointer">
                      Crédito
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "CREDITO" ? (
                  <div className="space-y-2">
                    <Label htmlFor="credit-installments">Parcelas</Label>
                    <Select
                      value={String(creditInstallments)}
                      onValueChange={(v) =>
                        setCreditInstallments(Number.parseInt(v, 10))
                      }
                      name="creditInstallments"
                    >
                      <SelectTrigger id="credit-installments" className="w-full">
                        <SelectValue placeholder="Número de parcelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">À vista (1x)</SelectItem>
                        {Array.from(
                          { length: INSTALLMENT_MAX - 1 },
                          (_, i) => i + INSTALLMENT_MIN_SPLIT
                        ).map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}x
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {showParcelPreview ? (
                  <div
                    id="installment-preview"
                    className="rounded-md border bg-muted/50 px-3 py-2 text-sm"
                    role="status"
                  >
                    <p className="font-medium text-foreground">
                      Valor da parcela: {formatCurrency(firstParcel)}
                    </p>
                    {lastParcel !== undefined && lastParcel !== firstParcel ? (
                      <p className="mt-1 text-muted-foreground">
                        Última parcela: {formatCurrency(lastParcel)} (ajuste de
                        centavos)
                      </p>
                    ) : null}
                    <p className="mt-1 text-muted-foreground">
                      Total: {formatCurrency(totalNum)}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                required
                name="category"
                value={categoryId}
                onValueChange={setCategoryId}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Carregando categorias...
                    </SelectItem>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
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
              <Label htmlFor="tag">Status</Label>
              <Select
                name="tag"
                value={tag || "none"}
                onValueChange={(value) =>
                  setTag(
                    value === "none"
                      ? null
                      : (value as
                          | "FALTA"
                          | "PAGO"
                          | "RECEBIDO"
                          | "DEVOLVER"
                          | "ECONOMIA")
                  )
                }
              >
                <SelectTrigger id="tag">
                  <SelectValue placeholder="Selecione um status (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="FALTA">
                    <div className="flex items-center">
                      <Badge variant="destructive" className="mr-2">
                        Falta
                      </Badge>
                      <span>Pendente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PAGO">
                    <div className="flex items-center">
                      <Badge variant="success" className="mr-2 bg-green-500">
                        Pago
                      </Badge>
                      <span>Pago</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="RECEBIDO">
                    <div className="flex items-center">
                      <Badge variant="received" className="mr-2">
                        Recebido
                      </Badge>
                      <span>Recebido</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DEVOLVER">
                    <div className="flex items-center">
                      <Badge variant="warning" className="mr-2 bg-yellow-500">
                        Devolver
                      </Badge>
                      <span>Devolver</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ECONOMIA">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2">
                        Economia
                      </Badge>
                      <span>Economia</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Observações (Opcional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Detalhes adicionais..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="resize-none overflow-y-auto"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Comprovante (Opcional)</Label>
              <AttachmentPicker
                files={pendingFiles}
                onFilesChange={setPendingFiles}
                disabled={isSubmitting}
                onRejected={(reason) =>
                  toast({ title: "Arquivo recusado", description: reason, variant: "destructive" })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || categoriesLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploadingAttachments ? "Enviando comprovantes..." : "Salvando..."}
                </>
              ) : (
                "Salvar Transação"
              )}
            </Button>
          </DialogFooter>
        </form>
        {/* Dentro do DialogContent (fora do <form>) para o Radix empilhar os diálogos. */}
        <CategoryCreateDialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
          defaultType={transactionType}
          onSuccess={async (category) => {
            await refreshCategories();
            setCategoryId(category.id);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
