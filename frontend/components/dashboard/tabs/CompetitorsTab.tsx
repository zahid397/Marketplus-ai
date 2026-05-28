'use client'
import { Competitor } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

interface Props { competitors: Competitor[] }

const threatCls = { Low: 'bg-green/15 text-green border-green/30', Medium: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30', High: 'bg-red/15 text-red border-red/30' }

export default function CompetitorsTab({ competitors }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  return (
    <div className="space-y-3">
      {competitors.map(c => (
        <div key={c.ticker} className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D1B2E] border border-white/8 flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold">{c.name}</span>
                <span className="text-sm text-secondary font-mono">{c.ticker}</span>
                <span className={cn('text-xs font-semibold border rounded-full px-2 py-0.5', threatCls[c.threat])}>{c.threat} Threat</span>
              </div>
              <p className="text-sm text-secondary mb-3">{c.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-muted">Threat Score</span>
                <div className="flex-1 max-w-[140px] h-1.5 bg-white/8 rounded-full">
                  <div className="h-full rounded-full" style={{
                    width: `${c.score}%`,
                    background: c.threat === 'High' ? '#EF4444' : c.threat === 'Medium' ? '#F59E0B' : '#22C55E'
                  }} />
                </div>
                <span className="text-xs font-semibold">{c.score}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push(`/dashboard/${c.ticker}`)} className="text-xs text-indigo border border-indigo/30 hover:bg-indigo/10 rounded-lg px-2.5 py-1.5 transition-colors">Open Dashboard</button>
                <button onClick={() => toast(`Running AI scan for ${c.ticker}...`, 'info')} className="text-xs text-secondary border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1.5 transition-colors">AI Scan</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
