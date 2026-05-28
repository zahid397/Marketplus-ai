'use client'
import { Signal } from '@/lib/mockData'
import { fmt } from '@/lib/utils'
import { ArrowRight, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'
import Link from 'next/link'

interface Props { signals: Signal[] }

const sentColor = { positive: '#22C55E', negative: '#EF4444', neutral: '#F59E0B' }
const sentBg = { positive: 'bg-green/15 border-green/30', negative: 'bg-red/15 border-red/30', neutral: 'bg-yellow-400/15 border-yellow-400/30' }

export default function LiveSignalFeed({ signals }: Props) {
  return (
    <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-green" />
          <h3 className="text-sm font-semibold">Live Signals Feed</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
          </span>
          <span className="text-[10px] text-green font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {signals.slice(0, 3).map(sig => (
          <div key={sig.id} className="flex items-start gap-2.5">
            <div className="flex-shrink-0 mt-0.5">
              <span className="text-[10px] text-muted">{fmt.ago(sig.timestamp)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-[10px] font-semibold border rounded-full px-1.5 py-0.5 ${sentBg[sig.sentiment]}`}
                  style={{ color: sentColor[sig.sentiment] }}>
                  {sig.category.charAt(0).toUpperCase() + sig.category.slice(1)}
                </span>
                <span className="text-[10px] text-muted">{sig.source}</span>
              </div>
              <p className="text-xs text-secondary leading-snug">{sig.message}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/signals" className="flex items-center gap-1.5 text-indigo text-xs font-semibold mt-4 hover:text-blue transition-colors">
        View All Signals <ArrowRight size={12} />
      </Link>
    </div>
  )
}
