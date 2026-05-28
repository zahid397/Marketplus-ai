export const DEMO_REPORT_IDS = {
  PRE_EARNINGS: 'rpt_pre_earnings',
  OVERVIEW: 'rpt_marketpulse_overview',
  SIGNAL_SUMMARY: 'rpt_signal_summary',
} as const

export interface DemoReport {
  id: string
  ticker: string
  template: string
  title: string
  pages: number
  summary: string
  createdAt: string
  status: 'ready'
}

export function getDemoReports(ticker = 'NVDA', summary?: string): DemoReport[] {
  const t = ticker.toUpperCase()
  const baseSummary =
    summary ||
    `${t} shows constructive pre-earnings signals in demo mode. Hiring velocity and news sentiment remain key metrics ahead of the print.`

  return [
    {
      id: DEMO_REPORT_IDS.PRE_EARNINGS,
      ticker: t,
      template: 'pre-earnings',
      title: `${t} Pre-Earnings Intelligence`,
      pages: 24,
      summary: baseSummary,
      createdAt: new Date().toISOString(),
      status: 'ready',
    },
    {
      id: DEMO_REPORT_IDS.OVERVIEW,
      ticker: t,
      template: 'full',
      title: 'MarketPulse Platform Overview',
      pages: 48,
      summary: `MarketPulse AI overview for ${t}: composite score, signal feed, and risk dashboard in demo mode.`,
      createdAt: new Date().toISOString(),
      status: 'ready',
    },
    {
      id: DEMO_REPORT_IDS.SIGNAL_SUMMARY,
      ticker: t,
      template: 'risk',
      title: `${t} Signal Summary Report`,
      pages: 12,
      summary: `Signal summary for ${t}: institutional, hiring, and news channels aligned in demo dataset.`,
      createdAt: new Date().toISOString(),
      status: 'ready',
    },
  ]
}

export function stableIdForTemplate(template: string): string {
  if (template === 'full') return DEMO_REPORT_IDS.OVERVIEW
  if (template === 'competitor' || template === 'risk') return DEMO_REPORT_IDS.SIGNAL_SUMMARY
  return DEMO_REPORT_IDS.PRE_EARNINGS
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

export function buildClientPdf(report: Pick<DemoReport, 'title' | 'summary' | 'ticker' | 'createdAt' | 'pages' | 'template'>): Blob {
  const lines = [
    'MarketPulse AI — Intelligence Report (offline demo)',
    report.title,
    `Ticker: ${report.ticker}`,
    `Generated: ${new Date(report.createdAt).toLocaleString()}`,
    report.summary,
  ]
  const streamContent = lines
    .map((line, i) => `BT /F1 11 Tf 50 ${780 - i * 14} Td (${escapePdfText(line)}) Tj ET`)
    .join('\n')

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]
  for (const obj of objects) {
    offsets.push(pdf.length)
    pdf += obj
  }
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= objects.length; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
