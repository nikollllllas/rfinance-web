import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { ReportMonthDto } from "@/lib/api/schemas/ReportMonthDto"
import type { ReportTotalsDto } from "@/lib/api/schemas/ReportTotalsDto"
import type { ReportTransactionDto } from "@/lib/api/schemas/ReportTransactionDto"
import type { TransactionsReportResponseDto } from "@/lib/api/schemas/TransactionsReportResponseDto"
import { getPaymentMethodLabel } from "@/lib/installment-utils"
import { REPORT_TYPE_LABELS, type ReportPeriod, type ReportTypeFilter } from "@/lib/report-period"

const colors = {
  brand: "#2bbf8e",
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  zebra: "#f9fafb",
  income: "#16a34a",
  expense: "#dc2626",
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: colors.brand,
    paddingBottom: 8,
    marginBottom: 14,
  },
  brand: { fontFamily: "Helvetica-Bold", fontSize: 14, color: colors.brand },
  headerMeta: { fontSize: 8, color: colors.muted, textAlign: "right" },
  title: { fontFamily: "Helvetica-Bold", fontSize: 16, marginBottom: 2 },
  subtitle: { fontSize: 9, color: colors.muted, marginBottom: 12 },
  totals: { flexDirection: "row", marginBottom: 14 },
  totalBox: {
    flexGrow: 1,
    flexBasis: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  totalBoxLast: { marginRight: 0 },
  totalLabel: { fontSize: 7, color: colors.muted, textTransform: "uppercase", marginBottom: 3 },
  totalValue: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.text,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowZebra: { backgroundColor: colors.zebra },
  colDate: { width: 54 },
  colDescription: { flexGrow: 1, flexBasis: 0, paddingRight: 6 },
  colCategory: { width: 96, paddingRight: 6 },
  colMethod: { width: 52 },
  colType: { width: 44 },
  colAmount: { width: 74, textAlign: "right" },
  monthDivider: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  empty: {
    padding: 16,
    textAlign: "center",
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: colors.muted,
  },
  summaryRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryTotalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontFamily: "Helvetica-Bold",
    borderTopWidth: 1.5,
    borderTopColor: colors.text,
  },
  colMonth: { flexGrow: 1, flexBasis: 0 },
  colNumber: { width: 90, textAlign: "right" },
  colCount: { width: 60, textAlign: "right" },
})

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const formatMoney = (value: number) => currency.format(value)
const formatSignedMoney = (value: number) =>
  value < 0 ? `-${currency.format(Math.abs(value))}` : currency.format(value)

const formatDay = (iso: string) => {
  const [year, month, day] = iso.split("-")
  return `${day}/${month}/${year}`
}

const capitalizeFirst = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const formatMonthName = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number)
  return capitalizeFirst(
    new Date(year, monthNumber - 1, 1).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    }),
  )
}

const amountColor = (type: ReportTransactionDto["type"]) =>
  type === "GANHO" ? colors.income : colors.expense

type DocumentProps = {
  report: TransactionsReportResponseDto
  period: ReportPeriod
  type: ReportTypeFilter
  generatedAt: Date
}

function PageHeader({ period, type, generatedAt }: Omit<DocumentProps, "report">) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.brand}>RFinance</Text>
      <View>
        <Text style={styles.headerMeta}>
          {period.label} · {REPORT_TYPE_LABELS[type]}
        </Text>
        <Text style={styles.headerMeta}>
          Gerado em {generatedAt.toLocaleDateString("pt-BR")} às{" "}
          {generatedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  )
}

function PageFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text>Relatório de transações · RFinance</Text>
      <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
    </View>
  )
}

function TotalsRow({ totals, type }: { totals: ReportTotalsDto; type: ReportTypeFilter }) {
  const boxes: Array<{ label: string; value: string; color: string }> = []
  if (type !== "GASTO") boxes.push({ label: "Entradas", value: formatMoney(totals.income), color: colors.income })
  if (type !== "GANHO") boxes.push({ label: "Saídas", value: formatMoney(totals.expense), color: colors.expense })
  if (type === "AMBOS") {
    boxes.push({
      label: "Saldo",
      value: formatSignedMoney(totals.balance),
      color: totals.balance < 0 ? colors.expense : colors.income,
    })
  }
  boxes.push({ label: "Transações", value: String(totals.count), color: colors.text })

  return (
    <View style={styles.totals} wrap={false}>
      {boxes.map((box, index) => (
        <View
          key={box.label}
          style={index === boxes.length - 1 ? [styles.totalBox, styles.totalBoxLast] : styles.totalBox}
        >
          <Text style={styles.totalLabel}>{box.label}</Text>
          <Text style={[styles.totalValue, { color: box.color }]}>{box.value}</Text>
        </View>
      ))}
    </View>
  )
}

function TransactionsTable({
  transactions,
  showType,
}: {
  transactions: ReportTransactionDto[]
  showType: boolean
}) {
  if (transactions.length === 0) {
    return <Text style={styles.empty}>Nenhuma transação neste período.</Text>
  }

  return (
    <View>
      <View style={styles.tableHeader} fixed>
        <Text style={styles.colDate}>Data</Text>
        <Text style={styles.colDescription}>Descrição</Text>
        <Text style={styles.colCategory}>Categoria</Text>
        <Text style={styles.colMethod}>Pagamento</Text>
        {showType && <Text style={styles.colType}>Tipo</Text>}
        <Text style={styles.colAmount}>Valor</Text>
      </View>
      {transactions.map((transaction, index) => (
        <View
          key={transaction.id}
          style={index % 2 === 1 ? [styles.row, styles.rowZebra] : styles.row}
          wrap={false}
        >
          <Text style={styles.colDate}>{formatDay(transaction.date)}</Text>
          <Text style={styles.colDescription}>{transaction.description}</Text>
          <Text style={styles.colCategory}>{transaction.category.name}</Text>
          <Text style={styles.colMethod}>{getPaymentMethodLabel(transaction.paymentMethod) ?? "-"}</Text>
          {showType && <Text style={styles.colType}>{transaction.type === "GANHO" ? "Entrada" : "Saída"}</Text>}
          <Text style={[styles.colAmount, { color: amountColor(transaction.type) }]}>
            {transaction.type === "GANHO" ? "" : "-"}
            {formatMoney(transaction.amount)}
          </Text>
        </View>
      ))}
    </View>
  )
}

function SummaryTable({
  months,
  totals,
  type,
}: {
  months: ReportMonthDto[]
  totals: ReportTotalsDto
  type: ReportTypeFilter
}) {
  const showIncome = type !== "GASTO"
  const showExpense = type !== "GANHO"
  const showBalance = type === "AMBOS"

  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={styles.colMonth}>Mês</Text>
        {showIncome && <Text style={styles.colNumber}>Entradas</Text>}
        {showExpense && <Text style={styles.colNumber}>Saídas</Text>}
        {showBalance && <Text style={styles.colNumber}>Saldo</Text>}
        <Text style={styles.colCount}>Qtd.</Text>
      </View>
      {months.map((month, index) => (
        <View
          key={month.month}
          style={index % 2 === 1 ? [styles.summaryRow, styles.rowZebra] : styles.summaryRow}
        >
          <Text style={styles.colMonth}>{formatMonthName(month.month)}</Text>
          {showIncome && (
            <Text style={[styles.colNumber, { color: colors.income }]}>{formatMoney(month.totals.income)}</Text>
          )}
          {showExpense && (
            <Text style={[styles.colNumber, { color: colors.expense }]}>{formatMoney(month.totals.expense)}</Text>
          )}
          {showBalance && (
            <Text
              style={[styles.colNumber, { color: month.totals.balance < 0 ? colors.expense : colors.income }]}
            >
              {formatSignedMoney(month.totals.balance)}
            </Text>
          )}
          <Text style={styles.colCount}>{month.totals.count}</Text>
        </View>
      ))}
      <View style={styles.summaryTotalRow}>
        <Text style={styles.colMonth}>Total</Text>
        {showIncome && <Text style={styles.colNumber}>{formatMoney(totals.income)}</Text>}
        {showExpense && <Text style={styles.colNumber}>{formatMoney(totals.expense)}</Text>}
        {showBalance && <Text style={styles.colNumber}>{formatSignedMoney(totals.balance)}</Text>}
        <Text style={styles.colCount}>{totals.count}</Text>
      </View>
    </View>
  )
}

export function ReportDocument({ report, period, type, generatedAt }: DocumentProps) {
  const showType = type === "AMBOS"
  const headerProps = { period, type, generatedAt }

  if (period.layout === "continuous") {
    const multipleMonths = report.months.length > 1
    return (
      <Document title={`RFinance · ${period.label}`} author="RFinance">
        <Page size="A4" style={styles.page}>
          <PageHeader {...headerProps} />
          <Text style={styles.title}>{capitalizeFirst(period.label)}</Text>
          <Text style={styles.subtitle}>Relatório de transações · {REPORT_TYPE_LABELS[type]}</Text>
          <TotalsRow totals={report.totals} type={type} />
          {multipleMonths ? (
            report.months.map((month) => (
              <View key={month.month}>
                <Text style={styles.monthDivider} minPresenceAhead={40}>
                  {formatMonthName(month.month)}
                </Text>
                <TransactionsTable transactions={month.transactions} showType={showType} />
              </View>
            ))
          ) : (
            <TransactionsTable transactions={report.months[0]?.transactions ?? []} showType={showType} />
          )}
          <PageFooter />
        </Page>
      </Document>
    )
  }

  return (
    <Document title={`RFinance · ${period.label}`} author="RFinance">
      <Page size="A4" style={styles.page}>
        <PageHeader {...headerProps} />
        <Text style={styles.title}>{capitalizeFirst(period.label)}</Text>
        <Text style={styles.subtitle}>Resumo do período · {REPORT_TYPE_LABELS[type]}</Text>
        <TotalsRow totals={report.totals} type={type} />
        <SummaryTable months={report.months} totals={report.totals} type={type} />
        <PageFooter />
      </Page>
      {report.months.map((month) => (
        <Page key={month.month} size="A4" style={styles.page}>
          <PageHeader {...headerProps} />
          <Text style={styles.title}>{formatMonthName(month.month)}</Text>
          <Text style={styles.subtitle}>Transações do mês · {REPORT_TYPE_LABELS[type]}</Text>
          <TotalsRow totals={month.totals} type={type} />
          <TransactionsTable transactions={month.transactions} showType={showType} />
          <PageFooter />
        </Page>
      ))}
    </Document>
  )
}
