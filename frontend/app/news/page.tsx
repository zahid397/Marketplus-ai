'use client'
import { useState } from 'react'
import { Newspaper, Menu, Search, BookOpen, ExternalLink, Bookmark, Share2, Radio } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import HeaderActions from '@/components/shared/HeaderActions'
import PricingModal from '@/components/shared/PricingModal'
import { newsItems } from '@/lib/mockData'
import { fmt } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

const sentCls = { positive: 'bg-green/15 text-green border-green/30', negative: 'bg-red/15 text-red border-red/30', neutral: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30' }

export default function NewsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [pricingOpen, setPricingOpen] = useState(false)

  let filtered = newsItems
  if (search) filtered = filtered.filter(n => n.headline.toLowerCase().includes(search.toLowerCase()))
  if (filter !== 'all') filtered = filtered.filter(n => n.sentiment === filter)

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onUpgrade={() => setPricingOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A1628]/60 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden text-secondary hover:text-white p-1 rounded-lg" aria-label="Open menu"><Menu size={18} /></button>
            <Newspaper size={16} className="text-indigo flex-shrink-0" />
            <h1 className="font-semibold truncate">AI News Terminal</h1>
            <span className="hidden sm:flex items-center gap-1.5 ml-2">
              <span className="relative flex h-2 w-2"><span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span></span>
              <span className="text-[10px] text-green font-medium">Realtime</span>
            </span>
          </div>
          <HeaderActions onOpenPricing={() => setPricingOpen(true)} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex items-center gap-2 bg-[#0A1628] border border-white/10 rounded-xl px-3 h-10 flex-1">
              <Search size={14} className="text-secondary" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..."
                className="bg-transparent text-sm text-white placeholder:text-muted outline-none flex-1" />
            </div>
            <div className="flex gap-2">
              {['all','positive','negative','neutral'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-xs px-3 h-10 rounded-xl border capitalize transition-colors ${filter===f ? 'bg-indigo/20 text-indigo border-indigo/30' : 'border-white/10 text-secondary hover:border-white/20'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(n => (
              <div key={n.id} className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-[10px] font-semibold border rounded-full px-1.5 py-0.5 ${sentCls[n.sentiment]}`}>{n.sentiment.toUpperCase()}</span>
                  <span className="text-xs text-secondary font-medium">{n.source}</span>
                  <span className="text-xs text-muted">{fmt.ago(n.timestamp)}</span>
                  <span className="text-[10px] text-muted ml-auto">Credibility {n.credibility}%</span>
                </div>
                <h3 className="text-sm font-semibold mb-1.5 leading-snug">{n.headline}</h3>
                <p className="text-xs text-secondary leading-relaxed mb-3">{n.summary}</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { l: 'Summarize', i: BookOpen, fn: () => toast('AI summary generated', 'success') },
                    { l: 'Analyze Impact', i: ExternalLink, fn: () => router.push('/dashboard/NVDA') },
                    {
                      l: 'Save',
                      i: Bookmark,
                      fn: () => {
                        const key = 'mp_saved_news'
                        const saved = JSON.parse(localStorage.getItem(key) || '[]') as string[]
                        if (!saved.includes(n.id)) localStorage.setItem(key, JSON.stringify([...saved, n.id]))
                        toast('Saved', 'success')
                      },
                    },
                    { l: 'Share', i: Share2, fn: async () => { await navigator.clipboard.writeText(n.headline); toast('Link copied', 'info') } },
                    { l: 'Open Signal', i: Radio, fn: () => router.push('/signals') },
                  ].map(b => (
                    <button key={b.l} onClick={b.fn} className="flex items-center gap-1.5 text-xs text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 transition-colors">
                      <b.i size={11} /> {b.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-secondary">
              <Newspaper size={32} className="mx-auto mb-3 opacity-40" />
              <p>No news matches your filters.</p>
            </div>
          )}
        </div>
      </div>
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  )
}
