'use client'
import { Company } from '@/lib/mockData'
import ExecutiveSummary from '../ExecutiveSummary'
import SentimentTrend from '../SentimentTrend'
import ScoreBreakdown from '../ScoreBreakdown'
import AIInsight from '../AIInsight'
import LiveSignalFeed from '../LiveSignalFeed'
import CompetitorThreat from '../CompetitorThreat'
import HiringDistribution from '../HiringDistribution'

interface Props { company: Company; onFollowUp: (q: string) => void }

export default function OverviewTab({ company, onFollowUp }: Props) {
  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExecutiveSummary summary={company.summary} confidence={company.scores.confidence} />
        <SentimentTrend data={company.sentimentTrend} />
        <ScoreBreakdown data={company.radarData} />
      </div>
      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AIInsight insight={company.aiInsight} onFollowUp={onFollowUp} />
        <LiveSignalFeed signals={company.signals} />
        <CompetitorThreat competitors={company.competitors} />
      </div>
      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HiringDistribution data={company.hiringData} />
        <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Recent News</h3>
          <div className="space-y-3">
            {company.news.map(n => (
              <div key={n.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${n.sentiment === 'positive' ? 'bg-green/15 text-green' : n.sentiment === 'negative' ? 'bg-red/15 text-red' : 'bg-yellow-400/15 text-yellow-400'}`}>
                    {n.sentiment.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-muted">{n.source}</span>
                </div>
                <p className="text-xs text-secondary leading-snug">{n.headline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
