import { Analysis, ScrapedData } from './types'
import { getMockAnalysis } from './mockData'

// Rule-based fallback — used when all AI providers fail
export function fallbackAnalysis(ticker: string, scraped?: ScrapedData): Analysis {
  const base = getMockAnalysis(ticker)
  if (!scraped) return { ...base, dataMode: 'fallback' }

  // Adjust scores based on real scraped data
  const sentScore = Math.round((scraped.avgSentiment + 1) * 50)
  const velScore = scraped.hiringVelocity > 30 ? 25 : scraped.hiringVelocity > 0 ? 12 : -10
  const preEarnings = Math.max(0, Math.min(100, 50 + velScore + (sentScore - 50) * 0.5))

  return {
    ...base,
    dataMode: 'fallback',
    preEarningsScore: Math.round(preEarnings),
    newsSentiment: sentScore,
    hiringVelocity: scraped.hiringVelocity,
    executiveSummary: `${base.companyName} (${ticker}): ${scraped.jobPostings} active job postings (${scraped.hiringVelocity > 0 ? '+' : ''}${scraped.hiringVelocity}% velocity), ${scraped.newsArticles.length} news articles analyzed. Rule-based composite score: ${Math.round(preEarnings)}/100.`,
  }
}
