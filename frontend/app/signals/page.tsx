'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Search, Radio } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import HeaderActions from '@/components/shared/HeaderActions'
import PricingModal from '@/components/shared/PricingModal'
import { signalsFeed } from '@/lib/mockData'
import { fmt } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { api } from '@/lib/api'

const sentCls = { positive: 'text-green bg-green/15 border-green/30', negative: 'text-red bg-red/15 border-red/30', neutral: 'text-yellow-400 bg-yellow-400/15 border-yellow-400/30' }
const dot = { buy: '#22C55E', sell: '#EF4444', neutral: '#F59E0B', alert: '#4F46E5' }

export default function SignalsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false)
  const [expanded, setExpanded] = useState<string|null>(null)
  const [search, setSearch] = useState('')
  const [sentiment, setSentiment] = useState('all')
  const [category, setCategory] = useState('all')
  const [actionBusy, setActionBusy] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  let filtered = signalsFeed
  if (search) filtered = filtered.filter(s => s.message.toLowerCase().includes(search.toLowerCase()) || s.source.toLowerCase().includes(search.toLowerCase()))
  if (sentiment !== 'all') filtered = filtered.filter(s => s.sentiment === sentiment)
  if (category !== 'all') filtered = filtered.filter(s => s.category === category)

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onUpgrade={() => setPricingOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A1628]/60 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden text-secondary hover:text-white p-1 rounded-lg" aria-label="Open menu"><Menu size={18} /></button>
            <Radio size={16} className="text-green flex-shrink-0" />
            <h1 className="font-semibold truncate">Live Signal Stream</h1>
            <span className="hidden sm:flex items-center gap-1.5 ml-2">
              <span className="relative flex h-2 w-2"><span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span></span>
              <span className="text-[10px] text-green font-medium">Live</span>
            </span>
          </div>
          <HeaderActions onOpenPricing={() => setPricingOpen(true)} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex items-center gap-2 bg-[#0A1628] border border-white/10 rounded-xl px-3 h-10 flex-1">
              <Search size={14} className="text-secondary" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search signals..."
                className="bg-transparent text-sm text-white placeholder:text-muted outline-none flex-1" />
            </div>
            <select value={sentiment} onChange={e => setSentiment(e.target.value)}
              className="bg-[#0A1628] border border-white/10 rounded-xl px-3 h-10 text-sm text-secondary outline-none">
              <option value="all">All Sentiment</option><option value="positive">Positive</option><option value="negative">Negative</option><option value="neutral">Neutral</option>
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-[#0A1628] border border-white/10 rounded-xl px-3 h-10 text-sm text-secondary outline-none">
              <option value="all">All Types</option><option value="hiring">Hiring</option><option value="news">News</option><option value="institutional">Institutional</option><option value="executive">Executive</option><option value="pricing">Pricing</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-secondary">
              <Radio size={32} className="mx-auto mb-3 opacity-40" />
              <p>No signals match your filters.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(sig => (
                <div key={sig.id} className="bg-[#0A1628] border border-white/6 rounded-xl overflow-hidden card-hover">
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(p => p === sig.id ? null : sig.id)}>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot[sig.type] }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-[10px] font-semibold border rounded-full px-1.5 py-0.5 ${sentCls[sig.sentiment]}`}>{sig.source}</span>
                        <span className="text-[10px] text-muted capitalize">{sig.category}</span>
                        <span className="text-[10px] text-muted">{fmt.ago(sig.timestamp)}</span>
                      </div>
                      <p className="text-sm text-secondary truncate">{sig.message}</p>
                    </div>
                    <div className="text-right hidden sm:block flex-shrink-0">
                      <div className="text-xs font-semibold">{sig.confidence}%</div>
                      <div className="text-[10px] text-muted">confidence</div>
                    </div>
                    {expanded === sig.id ? <ChevronUp size={14} className="text-secondary flex-shrink-0" /> : <ChevronDown size={14} className="text-secondary flex-shrink-0" />}
                  </div>
                  <AnimatePresence>
                    {expanded === sig.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 border-t border-white/6 pt-3">
                          <p className="text-sm text-secondary leading-relaxed mb-3">{sig.message}</p>
                          <div className="flex gap-2 flex-wrap">
                            <button onClick={() => router.push('/dashboard/NVDA')} className="text-xs text-indigo border border-indigo/30 hover:bg-indigo/10 rounded-lg px-2.5 py-1.5 transition-colors">View Analysis</button>
                            {['Save Signal','Add to Watchlist','Export','AI Explain'].map(a => (
                              <button
                                key={a}
                                disabled={actionBusy}
                                onClick={async () => {
                                  try {
                                    setActionBusy(true)
                                    if (a === 'Add to Watchlist') {
                                      await api.addWatchlist('NVDA', 'NVIDIA Corporation', false)
                                    } else if (a === 'Export') {
                                      await navigator.clipboard.writeText(sig.message)
                                    }
                                    toast(`${a} — Done!`, 'success')
                                  } catch (error) {
                                    toast(error instanceof Error ? error.message : `${a} failed`, 'error')
                                  } finally {
                                    setActionBusy(false)
                                  }
                                }}
                                className="text-xs text-secondary border border-white/10 hover:border-white/20 disabled:opacity-60 rounded-lg px-2.5 py-1.5 transition-colors">{a}</button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  )
}
