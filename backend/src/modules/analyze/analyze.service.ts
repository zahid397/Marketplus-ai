import { Injectable, Logger } from '@nestjs/common'
import { getMockAnalysis } from '../../lib/mockData'
import { Analysis } from '../../lib/types'

function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false'
}

@Injectable()
export class AnalyzeService {
  private readonly logger = new Logger(AnalyzeService.name)

  analyze(ticker: string): Analysis {
    this.logger.log(`[${isDemoMode() ? 'DEMO' : 'MOCK-FALLBACK'}] ${ticker}`)
    return getMockAnalysis(ticker)
  }

  refresh(ticker: string): void {
    this.logger.log(`[REFRESH] ${ticker}`)
  }

  cacheStats() {
    return { entries: 0, tickers: [] as string[] }
  }
}
