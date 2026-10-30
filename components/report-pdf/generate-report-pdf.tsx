import { pdf } from "@react-pdf/renderer"
import type { TransactionsReportResponseDto } from "@/lib/api/schemas/TransactionsReportResponseDto"
import type { ReportPeriod, ReportTypeFilter } from "@/lib/report-period"
import { ReportDocument } from "./report-document"

export async function generateReportPdf(
  report: TransactionsReportResponseDto,
  period: ReportPeriod,
  type: ReportTypeFilter,
): Promise<Blob> {
  return pdf(
    <ReportDocument report={report} period={period} type={type} generatedAt={new Date()} />,
  ).toBlob()
}
