'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Pin, Trash2, BarChart2, GitCompare, Plus, Menu } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import HeaderActions from '@/components/shared/HeaderActions'
import PricingModal from '@/components/shared/PricingModal'
import Modal from '@/components/ui/Modal'
import { watchlistItems, WatchlistItem, TICKERS } from '@/lib/mockData'
import { fmt, score } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

function Spark({ d, pos }: { d: number[]; pos: boolean }) {
  const max = Math.max(...d), min = Math.min(...d), range = max - min || 1
  const pts = d.map((v, i) => `${(i/(d.length-1))*100},${28-((v-min)/range)*24}`).join(' ')
  return <svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={pos?'#22C55E':'#EF4444'} strokeWidth="1.5" /></svg>
}

export default function WatchlistPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false)
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [addModal, setAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  const watchlistSeed = useMemo(
    () => Object.fromEntries(watchlistItems.map((item) => [item.ticker, item])),
    [],
  )

  const toUIItem = (ticker: string, name: string, pinned: boolean): WatchlistItem => {
    const base = watchlistSeed[ticker]
    if (base) return { ...base, name: name || base.name, pinned }
    return {
      ticker,
      name: name || ticker,
      price: 100,
      change: 0,
      changePercent: 0,
      aiScore: 60,
      sparkline: [58, 61, 60, 64, 63, 66, 68],
      pinned,
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.listWatchlist()
        const mapped = res.items.map((item) => toUIItem(item.ticker, item.name, item.pinned))
        setItems(mapped)
      } catch (error) {
        toast(error instanceof Error ? error.message : 'Failed to load watchlist', 'error')
      }
    }
    void load()
  }, [toast])

  const togglePin = async (t: string) => {
    const current = items.find((item) => item.ticker === t)
    if (!current) return
    try {
      setBusy(true)
      await api.updateWatchlist(t, !current.pinned)
      setItems((prev) => prev.map((i) => (i.ticker === t ? { ...i, pinned: !i.pinned } : i)))
      toast('Watchlist updated', 'info')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Failed to update watchlist', 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (t: string) => {
    try {
      setBusy(true)
      await api.removeWatchlist(t)
      setItems((prev) => prev.filter((i) => i.ticker !== t))
      toast(`${t} removed from watchlist`, 'info')
    } catch (error) {
      toast(error instanceof Error ? error.message : `Failed to remove ${t}`, 'error')
    } finally {
      setBusy(false)
    }
  }

  const add = async (t: string) => {
    if (items.find(i => i.ticker === t)) { toast(`${t} already in watchlist`, 'error'); return }
    try {
      setBusy(true)
      await api.addWatchlist(t, t, false)
      setItems((prev) => [...prev, toUIItem(t, t, false)])
      setAddModal(false)
      toast(`${t} added to watchlist`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : `Failed to add ${t}`, 'error')
    } finally {
      setBusy(false)
    }
  }

  const sorted = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onUpgrade={() => setPricingOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A1628]/60 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden text-secondary hover:text-white p-1 rounded-lg" aria-label="Open menu"><Menu size={18} /></button>
            <Bookmark size={16} className="text-indigo flex-shrink-0" />
            <h1 className="font-semibold truncate">Watchlist</h1>
            <span className="text-xs text-muted">({items.length})</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setAddModal(true)} className="flex items-center gap-1.5 text-xs font-medium bg-indigo hover:bg-indigo/80 text-white px-3 h-8 rounded-lg transition-colors">
              <Plus size={13} /> Add Company
            </button>
            <HeaderActions onOpenPricing={() => setPricingOpen(true)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {sorted.length === 0 ? (
            <div className="text-center py-20 text-secondary">
              <Bookmark size={32} className="mx-auto mb-3 opacity-40" />
              <p className="mb-3">Your watchlist is empty.</p>
              <button onClick={() => setAddModal(true)} className="text-indigo text-sm">+ Add your first company</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map(item => {
                const pos = item.changePercent >= 0
                return (
                  <motion.div key={item.ticker} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.ticker}</span>
                          {item.pinned && <Pin size={11} className="text-indigo fill-indigo" />}
                        </div>
                        <div className="text-xs text-muted truncate max-w-[140px]">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono">{fmt.price(item.price)}</div>
                        <div className={`text-xs ${pos ? 'text-green' : 'text-red'}`}>{fmt.pct(item.changePercent)}</div>
                      </div>
                    </div>
                    <div className="mb-3"><Spark d={item.sparkline} pos={pos} /></div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted">AI Health Score</span>
                      <span className="text-sm font-bold" style={{ color: score.color(item.aiScore) }}>{item.aiScore}/100</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => router.push(`/dashboard/${item.ticker}`)} title="Analyze" className="flex-1 flex items-center justify-center gap-1 text-xs text-indigo border border-indigo/30 hover:bg-indigo/10 rounded-lg py-2 transition-colors"><BarChart2 size={12} /> Analyze</button>
                      <button disabled={busy} onClick={() => togglePin(item.ticker)} title="Pin" className="w-9 flex items-center justify-center border border-white/10 hover:border-white/20 disabled:opacity-60 rounded-lg transition-colors"><Pin size={13} className={item.pinned ? 'text-indigo fill-indigo' : 'text-secondary'} /></button>
                      <button onClick={() => router.push(`/dashboard/${item.ticker}`)} title="Compare" className="w-9 flex items-center justify-center border border-white/10 hover:border-white/20 rounded-lg transition-colors"><GitCompare size={13} className="text-secondary" /></button>
                      <button disabled={busy} onClick={() => remove(item.ticker)} title="Remove" className="w-9 flex items-center justify-center border border-white/10 hover:border-red/30 disabled:opacity-60 rounded-lg transition-colors group"><Trash2 size={13} className="text-secondary group-hover:text-red" /></button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Company to Watchlist">
        <div className="flex items-center gap-2 bg-[#050B18] border border-white/10 rounded-xl px-3 h-11 mb-4">
          <input value={search} onChange={e => setSearch(e.target.value.toUpperCase())} placeholder="Search ticker..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted outline-none" />
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
          {TICKERS.filter(t => t.includes(search)).map(t => (
            <button key={t} disabled={busy} onClick={() => add(t)} className="text-sm border border-white/10 hover:border-indigo/40 hover:text-indigo disabled:opacity-60 rounded-lg py-2.5 text-secondary transition-colors">{t}</button>
          ))}
        </div>
      </Modal>
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  )
}
