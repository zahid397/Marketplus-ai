'use client'
import { Competitor } from '@/lib/mockData'
import { ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props { competitors: Competitor[] }

const threatCls = {
  Low: 'bg-green/15 text-green border-green/30',
  Medium: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
  High: 'bg-red/15 text-red border-red/30',
}

export default function CompetitorThreat({ competitors }: Props) {
  return (
    <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
      <div className="flex items-center gap-2 mb-3">
        <Shield size={14} className="text-secondary" />
        <h3 className="text-sm font-semibold">Top Competitor Threats</h3>
      </div>

      <div className="space-y-3">
        {competitors.slice(0, 3).map(c => (
          <div key={c.ticker} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0D1B2E] border border-white/8 flex items-center justify-center text-base flex-shrink-0">
              {c.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold">{c.name}</span>
                <span className={cn('text-[10px] font-semibold border rounded-full px-2 py-0.5', threatCls[c.threat])}>
                  {c.threat}
                </span>
              </div>
              <p className="text-[11px] text-secondary leading-snug truncate">{c.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/signals" className="flex items-center gap-1.5 text-indigo text-xs font-semibold mt-4 hover:text-blue transition-colors">
        View Full Analysis <ArrowRight size={12} />
      </Link>
    </div>
  )
}
