import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { ptBR } from "date-fns/locale"

export type ReportMode = "week" | "month" | "range" | "year"
export type ReportTypeFilter = "AMBOS" | "GASTO" | "GANHO"
export type ReportLayout = "continuous" | "byMonth"

export const REPORT_MAX_MONTHS = 12

export const REPORT_TYPE_LABELS: Record<ReportTypeFilter, string> = {
  AMBOS: "Entradas e saídas",
  GASTO: "Somente saídas",
  GANHO: "Somente entradas",
}

export type ReportSelection = {
  mode: ReportMode
  weekDate: Date
  month: Date
  rangeStart: Date
  rangeEnd: Date
  year: number
}

export type ReportPeriod = {
  from: string
  to: string
  label: string
  layout: ReportLayout
}

const toIso = (date: Date) => format(date, "yyyy-MM-dd")

export const monthsBetween = (start: Date, end: Date) =>
  (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1

export function resolveReportPeriod(selection: ReportSelection): ReportPeriod {
  switch (selection.mode) {
    case "week": {
      const start = startOfWeek(selection.weekDate, { weekStartsOn: 0 })
      const end = endOfWeek(selection.weekDate, { weekStartsOn: 0 })
      return {
        from: toIso(start),
        to: toIso(end),
        label: `Semana de ${format(start, "dd/MM/yyyy")} a ${format(end, "dd/MM/yyyy")}`,
        layout: "continuous",
      }
    }
    case "month": {
      const start = startOfMonth(selection.month)
      return {
        from: toIso(start),
        to: toIso(endOfMonth(selection.month)),
        label: format(start, "MMMM 'de' yyyy", { locale: ptBR }),
        layout: "continuous",
      }
    }
    case "range": {
      const [first, last] =
        selection.rangeStart <= selection.rangeEnd
          ? [selection.rangeStart, selection.rangeEnd]
          : [selection.rangeEnd, selection.rangeStart]
      const start = startOfMonth(first)
      const end = endOfMonth(last)
      const single = monthsBetween(start, end) === 1
      return {
        from: toIso(start),
        to: toIso(end),
        label: single
          ? format(start, "MMMM 'de' yyyy", { locale: ptBR })
          : `${format(start, "MMM/yyyy", { locale: ptBR })} a ${format(end, "MMM/yyyy", { locale: ptBR })}`,
        layout: single ? "continuous" : "byMonth",
      }
    }
    case "year": {
      const base = new Date(selection.year, 0, 1)
      return {
        from: toIso(startOfYear(base)),
        to: toIso(endOfYear(base)),
        label: `Ano de ${selection.year}`,
        layout: "byMonth",
      }
    }
  }
}

export function reportFileName(period: ReportPeriod) {
  return `rfinance-relatorio-${period.from}_${period.to}.pdf`
}
