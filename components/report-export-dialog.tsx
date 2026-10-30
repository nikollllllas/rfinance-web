"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MonthPicker } from "@/components/ui/monthpicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { reportsControllerGetTransactionsReport } from "@/lib/api/reports/reportsControllerGetTransactionsReport"
import {
  REPORT_MAX_MONTHS,
  REPORT_TYPE_LABELS,
  monthsBetween,
  reportFileName,
  resolveReportPeriod,
  type ReportMode,
  type ReportTypeFilter,
} from "@/lib/report-period"

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMonth?: string
}

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
const monthPickerCallbacks = { monthLabel: (month: { number: number }) => MONTH_LABELS[month.number] }

const parseMonth = (value?: string) => {
  if (!value) return new Date()
  const [year, month] = value.split("-").map(Number)
  return new Date(year, month - 1, 1)
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function ReportExportDialog({ open, onOpenChange, initialMonth }: ReportExportDialogProps) {
  const { toast } = useToast()
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, index) => currentYear - index)

  const [mode, setMode] = useState<ReportMode>("month")
  const [type, setType] = useState<ReportTypeFilter>("AMBOS")
  const [weekDate, setWeekDate] = useState<Date>(() => new Date())
  const [month, setMonth] = useState<Date>(() => parseMonth(initialMonth))
  const [rangeStart, setRangeStart] = useState<Date>(() => new Date(currentYear, 0, 1))
  const [rangeEnd, setRangeEnd] = useState<Date>(() => parseMonth(initialMonth))
  const [year, setYear] = useState<number>(currentYear)
  const [isGenerating, setIsGenerating] = useState(false)

  const rangeMonths = monthsBetween(
    rangeStart <= rangeEnd ? rangeStart : rangeEnd,
    rangeStart <= rangeEnd ? rangeEnd : rangeStart,
  )
  const rangeTooLong = mode === "range" && rangeMonths > REPORT_MAX_MONTHS
  const period = resolveReportPeriod({ mode, weekDate, month, rangeStart, rangeEnd, year })

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const report = await reportsControllerGetTransactionsReport({
        query: { from: period.from, to: period.to, type },
      })

      if (report.totals.count === 0) {
        toast({
          title: "Nada para exportar",
          description: "Não há transações no período selecionado.",
        })
        return
      }

      const { generateReportPdf } = await import("@/components/report-pdf/generate-report-pdf")
      const blob = await generateReportPdf(report, period, type)
      downloadBlob(blob, reportFileName(period))

      toast({ title: "Relatório gerado", description: "O download do PDF começou." })
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Exportar relatório</DialogTitle>
          <DialogDescription>Escolha o período e o tipo de transação para gerar o PDF</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Período</Label>
            <Tabs value={mode} onValueChange={(value) => setMode(value as ReportMode)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="week" className="cursor-pointer">Semana</TabsTrigger>
                <TabsTrigger value="month" className="cursor-pointer">Mês</TabsTrigger>
                <TabsTrigger value="range" className="cursor-pointer">Meses</TabsTrigger>
                <TabsTrigger value="year" className="cursor-pointer">Ano</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {mode === "week" && (
            <div className="flex flex-col gap-2">
              <Label>Qualquer dia da semana</Label>
              <DatePicker date={weekDate} setDate={(date) => date && setWeekDate(date)} />
            </div>
          )}

          {mode === "month" && (
            <div className="flex flex-col gap-2">
              <Label>Mês</Label>
              <MonthPicker
                selectedMonth={month}
                onMonthSelect={setMonth}
                callbacks={monthPickerCallbacks}
              />
            </div>
          )}

          {mode === "range" && (
            <>
              <div className="flex flex-col gap-2">
                <Label>De</Label>
                <MonthPicker
                  selectedMonth={rangeStart}
                  onMonthSelect={setRangeStart}
                  callbacks={monthPickerCallbacks}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Até</Label>
                <MonthPicker
                  selectedMonth={rangeEnd}
                  onMonthSelect={setRangeEnd}
                  callbacks={monthPickerCallbacks}
                />
              </div>
            </>
          )}

          {mode === "year" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="report-year">Ano</Label>
              <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger id="report-year" className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className={cn("flex flex-col gap-2", mode === "range" && "sm:col-span-2")}>
            <Label htmlFor="report-type">Transações</Label>
            <Select value={type} onValueChange={(value) => setType(value as ReportTypeFilter)}>
              <SelectTrigger id="report-type" className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(REPORT_TYPE_LABELS) as ReportTypeFilter[]).map((option) => (
                  <SelectItem key={option} value={option}>
                    {REPORT_TYPE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl bg-muted/60 p-3 text-sm sm:col-span-2">
            {rangeTooLong ? (
              <p className="text-destructive">
                Selecione no máximo {REPORT_MAX_MONTHS} meses ({rangeMonths} selecionados).
              </p>
            ) : (
              <>
                <p className="font-medium first-letter:uppercase">{period.label}</p>
                <p className="text-muted-foreground">
                  {period.layout === "byMonth"
                    ? "Uma página de resumo e uma página por mês."
                    : "Tabela única com todas as transações."}
                </p>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={handleGenerate} disabled={isGenerating || rangeTooLong}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? "Gerando..." : "Gerar PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
