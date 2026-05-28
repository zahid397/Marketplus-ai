import { Injectable } from '@nestjs/common'
import { AnalyzeService } from '../analyze/analyze.service'

@Injectable()
export class CompareService {
  constructor(private readonly analyzeService: AnalyzeService) {}

  compare(base: string | undefined, tickers: string[]) {
    const all = base ? [base, ...tickers.filter(t => t !== base)] : tickers
    const unique = [...new Set(all)].slice(0, 4)
    const results = unique.map(ticker => {
      const a = this.analyzeService.analyze(ticker)
      return {
        ticker: a.ticker,
        companyName: a.companyName,
        preEarningsScore: a.preEarningsScore,
        confidenceScore: a.confidenceScore,
        riskScore: a.riskScore,
        hiringVelocity: a.hiringVelocity,
        newsSentiment: a.newsSentiment,
      }
    })
    return { base: base || unique[0], comparisons: results }
  }
}
