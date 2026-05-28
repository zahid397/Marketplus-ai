'use client'
import { useState } from 'react'
import { Signal } from '@/lib/mockData'
import { fmt } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface Props { signals: Signal[] }

const sentCls = { positive: 'text-green bg-green/15 border-green/30', negative: 'text-red bg-red/15 border-red/30', neutral: 'text-yellow-400 bg-yellow-400/15 border-yellow-400/30' }
const typeCls = { buy: '#22C55E', sell: '#EF4444', neutral: '#F59E0B', alert: '#4F46E5' }

export default function SignalsTab({ signals }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const { toast } = useToast()

  const cats = ['all', 'hiring', 'news', 'institutional', 'executive']
  const filtered = filter === 'all' ? signals : signals.filter(s => s.category === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors ${filter===c ? 'bg-indigo/20 text-indigo border-indigo/30 font-medium' : 'border-white/10 text-secondary hover:text-white hover:border-white/20'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(sig => (
          <div key={sig.id} className="bg-[#0A1628] border border-white/6 rounded-xl overflow-hidden card-hover">
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(p => p === sig.id ? null : sig.id)}>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: typeCls[sig.type] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold border rounded-full px-1.5 py-0.5 ${sentCls[sig.sentiment]}`}>{sig.source}</span>
                  <span className="text-[10px] text-muted">{fmt.ago(sig.timestamp)}</span>
                </div>
                <p className="text-sm text-secondary truncate">{sig.message}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{sig.confidence}%</div>
                  <div className="text-[10px] text-muted">confidence</div>
                </div>
                {expanded === sig.id ? <ChevronUp size={14} className="text-secondary" /> : <ChevronDown size={14} className="text-secondary" />}
              </div>
            </div>
            <AnimatePresence>
              {expanded === sig.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 pt-0 border-t border-white/6">
                    <p className="text-sm text-secondary leading-relaxed mb-3">{sig.message}</p>
                    <div className="h-1.5 bg-white/8 rounded-full mb-3">
                      <div className="h-full bg-gradient-to-r from-indigo to-blue rounded-full" style={{ width: `${sig.confidence}%` }} />
                    </div>
                    <div className="flex gap-2">
                      {['Save Signal', 'Add to Watchlist', 'Export', 'AI Explain'].map(a => (
                        <button key={a} onClick={() => toast(`${a} — Done!`, 'success')}
                          className="text-xs text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 transition-colors">{a}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
