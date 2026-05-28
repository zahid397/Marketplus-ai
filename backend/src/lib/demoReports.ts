import { Report } from '../modules/reports/reports.service'

export const DEMO_REPORT_IDS = {
  PRE_EARNINGS: 'rpt_pre_earnings',
  OVERVIEW: 'rpt_marketpulse_overview',
  SIGNAL_SUMMARY: 'rpt_signal_summary',
} as const

export const STABLE_DEMO_IDS = new Set<string>(Object.values(DEMO_REPORT_IDS))

const TEMPLATE_TO_ID: Record<string, string> = {
  'pre-earnings': DEMO_REPORT_IDS.PRE_EARNINGS,
  full: DEMO_REPORT_IDS.OVERVIEW,
  competitor: DEMO_REPORT_IDS.SIGNAL_SUMMARY,
  risk: DEMO_REPORT_IDS.SIGNAL_SUMMARY,
}

export function stableDemoIdForTemplate(template: string): string {
  return TEMPLATE_TO_ID[template] || DEMO_REPORT_IDS.PRE_EARNINGS
}

export function buildDemoReports(ticker = 'NVDA', summary?: string): Report[] {
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

export function findDemoReport(id: string, ticker = 'NVDA', summary?: string): Report | undefined {
  return buildDemoReports(ticker, summary).find((r) => r.id === id)
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false'
}
