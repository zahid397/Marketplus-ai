export interface Analysis {
  ticker: string
  companyName: string
  generatedAt: string
  dataMode: 'live' | 'demo' | 'fallback'
  preEarningsScore: number
  confidenceScore: number
  riskScore: number
  hiringVelocity: number
  newsSentiment: number
  executiveSummary: string
  signals: { type: string; source: string; message: string; confidence: number; sentiment: string }[]
  risks: { category: string; severity: string; description: string }[]
}

export interface ScrapedData {
  ticker: string
  jobPostings: number
  hiringVelocity: number
  newsArticles: { headline: string; sentiment: number; source: string }[]
  avgSentiment: number
  productUpdates: string[]
}
