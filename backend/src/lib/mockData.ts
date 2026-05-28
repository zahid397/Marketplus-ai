import { Analysis } from './types'

const COMPANIES: Record<string, string> = {
  NVDA: 'NVIDIA Corporation', TSLA: 'Tesla Inc.', META: 'Meta Platforms',
  PLTR: 'Palantir Technologies', AMD: 'Advanced Micro Devices',
  MSFT: 'Microsoft Corporation', GOOGL: 'Alphabet Inc.', AAPL: 'Apple Inc.',
}

const PROFILES: Record<string, Partial<Analysis>> = {
  NVDA: { preEarningsScore: 87, confidenceScore: 78, riskScore: 32, hiringVelocity: 48, newsSentiment: 72 },
  TSLA: { preEarningsScore: 54, confidenceScore: 62, riskScore: 65, hiringVelocity: -12, newsSentiment: 45 },
  META: { preEarningsScore: 74, confidenceScore: 81, riskScore: 38, hiringVelocity: 22, newsSentiment: 68 },
  PLTR: { preEarningsScore: 71, confidenceScore: 74, riskScore: 42, hiringVelocity: 35, newsSentiment: 65 },
  AMD:  { preEarningsScore: 71, confidenceScore: 76, riskScore: 44, hiringVelocity: 31, newsSentiment: 64 },
}

export function getMockAnalysis(ticker: string): Analysis {
  const t = ticker.toUpperCase()
  const p = PROFILES[t] || { preEarningsScore: 60, confidenceScore: 65, riskScore: 45, hiringVelocity: 12, newsSentiment: 58 }
  const name = COMPANIES[t] || `${t} Corporation`
  return {
    ticker: t,
    companyName: name,
    generatedAt: new Date().toISOString(),
    dataMode: 'demo',
    preEarningsScore: p.preEarningsScore!,
    confidenceScore: p.confidenceScore!,
    riskScore: p.riskScore!,
    hiringVelocity: p.hiringVelocity!,
    newsSentiment: p.newsSentiment!,
    executiveSummary: `${name} (${t}) shows ${p.preEarningsScore! >= 70 ? 'strong bullish' : p.preEarningsScore! >= 50 ? 'mixed' : 'cautious'} pre-earnings signals. Hiring velocity at ${p.hiringVelocity! > 0 ? '+' : ''}${p.hiringVelocity}% MoM, news sentiment ${p.newsSentiment}/100. Composite pre-earnings score: ${p.preEarningsScore}/100.`,
    signals: [
      { type: 'institutional', source: 'JPMorgan', message: 'Institutional position increase detected', confidence: 91, sentiment: 'positive' },
      { type: 'hiring', source: 'Hiring Analytics', message: `Hiring velocity ${p.hiringVelocity}% MoM`, confidence: 78, sentiment: p.hiringVelocity! > 0 ? 'positive' : 'negative' },
      { type: 'news', source: 'AI Monitor', message: `News sentiment trending ${p.newsSentiment! >= 60 ? 'positive' : 'neutral'}`, confidence: 84, sentiment: 'positive' },
    ],
    risks: [
      { category: 'Competition', severity: p.riskScore! >= 60 ? 'High' : 'Medium', description: 'Competitive pressure in core markets' },
      { category: 'Valuation', severity: 'Medium', description: 'Valuation multiple sensitivity to earnings' },
    ],
  }
}
