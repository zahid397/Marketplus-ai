import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { getUserId, loadUserData, saveUserData } from '../../lib/storage'
import { AnalyzeService } from '../analyze/analyze.service'
import {
  buildDemoReports,
  findDemoReport,
  isDemoMode,
  stableDemoIdForTemplate,
  STABLE_DEMO_IDS,
} from '../../lib/demoReports'
import { buildReportPdf } from '../../lib/pdf'

export interface Report {
  id: string
  ticker: string
  template: string
  title: string
  pages: number
  summary: string
  createdAt: string
  status: 'ready' | 'generating'
}

const TEMPLATES: Record<string, { label: string; pages: number }> = {
  'pre-earnings': { label: 'Pre-Earnings Intelligence', pages: 24 },
  competitor: { label: 'Competitor Analysis', pages: 18 },
  risk: { label: 'Risk Assessment Report', pages: 12 },
  full: { label: 'Full Intelligence Report', pages: 48 },
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name)

  constructor(private readonly analyzeService: AnalyzeService) {}

  private getReports(userId: string): Report[] {
    return loadUserData<Report[]>(userId, 'reports', [])
  }

  list(headers: Record<string, string | string[] | undefined>, ticker?: string) {
    const userId = getUserId(headers)
    let reports = this.getReports(userId)

    if (isDemoMode()) {
      const demo = buildDemoReports(ticker || 'NVDA')
      const merged = [...demo]
      for (const r of reports) {
        if (!STABLE_DEMO_IDS.has(r.id)) merged.push(r)
      }
      reports = merged
    }

    if (ticker) reports = reports.filter((r) => r.ticker === ticker)
    return { reports }
  }

  get(headers: Record<string, string | string[] | undefined>, id: string) {
    return this.resolveReport(headers, id)
  }

  resolveReport(headers: Record<string, string | string[] | undefined>, id: string, tickerHint = 'NVDA'): Report {
    const userId = getUserId(headers)
    const stored = this.getReports(userId).find((r) => r.id === id)
    if (stored) return stored

    if (isDemoMode()) {
      const demo = findDemoReport(id, tickerHint)
      if (demo) return demo

      this.logger.log(`Demo mode: auto-generating report for id ${id}`)
      return this.buildAutoDemoReport(id, tickerHint)
    }

    throw new NotFoundException('Report not found')
  }

  private buildAutoDemoReport(id: string, ticker: string): Report {
    const t = ticker.toUpperCase()
    const analysis = this.analyzeService.analyze(t)
    return {
      id,
      ticker: t,
      template: 'pre-earnings',
      title: `${t} Pre-Earnings Intelligence`,
      pages: 24,
      summary: analysis.executiveSummary,
      createdAt: new Date().toISOString(),
      status: 'ready',
    }
  }

  generate(headers: Record<string, string | string[] | undefined>, ticker: string, template: string) {
    const userId = getUserId(headers)
    const tpl = TEMPLATES[template] || TEMPLATES['pre-earnings']
    const analysis = this.analyzeService.analyze(ticker)

    const report: Report = {
      id: isDemoMode() ? stableDemoIdForTemplate(template) : `rpt_${Date.now()}`,
      ticker,
      template,
      title: `${ticker} ${tpl.label}`,
      pages: tpl.pages,
      summary: analysis.executiveSummary,
      createdAt: new Date().toISOString(),
      status: 'ready',
    }

    const reports = this.getReports(userId).filter((r) => r.id !== report.id)
    reports.unshift(report)
    saveUserData(userId, 'reports', reports.slice(0, 50))
    return { ok: true, report }
  }

  exportContent(report: Report, format: 'csv' | 'pdf'): string | Buffer {
    if (format === 'csv') {
      return `ticker,template,title,pages,createdAt,summary\n"${report.ticker}","${report.template}","${report.title}",${report.pages},"${report.createdAt}","${report.summary.replace(/"/g, '""')}"`
    }
    return buildReportPdf(report)
  }
}
