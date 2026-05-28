import { ScrapedData } from './types'

// Mock Bright Data scraper — returns realistic scraped data
// In production, replace with actual Bright Data SERP + Web Scraper API calls
export async function scrapeTickerData(ticker: string): Promise<ScrapedData> {
  const t = ticker.toUpperCase()
  // Simulate network latency
  await new Promise(r => setTimeout(r, 300))

  const profiles: Record<string, Partial<ScrapedData>> = {
    NVDA: { jobPostings: 678, hiringVelocity: 48, avgSentiment: 0.72 },
    TSLA: { jobPostings: 750, hiringVelocity: -12, avgSentiment: -0.15 },
    META: { jobPostings: 602, hiringVelocity: 22, avgSentiment: 0.45 },
    PLTR: { jobPostings: 332, hiringVelocity: 35, avgSentiment: 0.38 },
    AMD:  { jobPostings: 460, hiringVelocity: 31, avgSentiment: 0.42 },
  }
  const p = profiles[t] || { jobPostings: 200, hiringVelocity: 10, avgSentiment: 0.2 }

  return {
    ticker: t,
    jobPostings: p.jobPostings!,
    hiringVelocity: p.hiringVelocity!,
    avgSentiment: p.avgSentiment!,
    newsArticles: [
      { headline: `${t} reports strong quarterly signals`, sentiment: 0.7, source: 'Reuters' },
      { headline: `Analysts update ${t} outlook`, sentiment: 0.5, source: 'Bloomberg' },
      { headline: `${t} faces sector competition`, sentiment: -0.3, source: 'WSJ' },
    ],
    productUpdates: [`${t} product roadmap update`, `${t} new partnership announced`],
  }
}
