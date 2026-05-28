'use client'
import { useState } from 'react'
import { Building2, Search, Menu, ArrowUpDown } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import HeaderActions from '@/components/shared/HeaderActions'
import PricingModal from '@/components/shared/PricingModal'
import { companiesList } from '@/lib/mockData'
import { score } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function CompaniesPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('all')
  const [busyTicker, setBusyTicker] = useState('')
  const [pricingOpen, setPricingOpen] = useState(false)

  const sectors = ['all', ...Array.from(new Set(companiesList.map(c => c.sector)))]
  let filtered = companiesList
  if (search) filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.ticker.includes(search.toUpperCase()))
  if (sector !== 'all') filtered = filtered.filter(c => c.sector === sector)

  const runScan = async (ticker: string) => {
    try {
      setBusyTicker(ticker)
      await api.analyze(ticker)
      toast(`AI scan completed for ${ticker}`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : `Scan failed for ${ticker}`, 'error')
    } finally {
      setBusyTicker('')
    }
  }

  const addToWatchlist = async (ticker: string, name: string) => {
    try {
      setBusyTicker(ticker)
      await api.addWatchlist(ticker, name, false)
      toast(`${ticker} added to watchlist`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : `Failed to add ${ticker}`, 'error')
    } finally {
      setBusyTicker('')
    }
  }

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onUpgrade={() => setPricingOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A1628]/60 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden text-secondary hover:text-white p-1 rounded-lg" aria-label="Open menu"><Menu size={18} /></button>
            <Building2 size={16} className="text-indigo flex-shrink-0" />
            <h1 className="font-semibold truncate">Company Explorer</h1>
          </div>
          <HeaderActions onOpenPricing={() => setPricingOpen(true)} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex items-center gap-2 bg-[#0A1628] border border-white/10 rounded-xl px-3 h-10 flex-1">
              <Search size={14} className="text-secondary" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..."
                className="bg-transparent text-sm text-white placeholder:text-muted outline-none flex-1" />
            </div>
            <select value={sector} onChange={e => setSector(e.target.value)}
              className="bg-[#0A1628] border border-white/10 rounded-xl px-3 h-10 text-sm text-secondary outline-none capitalize">
              {sectors.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sectors' : s}</option>)}
            </select>
          </div>

          <div className="bg-[#0A1628] border border-white/6 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-left">
                    <th className="px-4 py-3 text-xs text-muted font-medium uppercase tracking-wide">Company</th>
                    <th className="px-4 py-3 text-xs text-muted font-medium uppercase tracking-wide hidden sm:table-cell">Sector</th>
                    <th className="px-4 py-3 text-xs text-muted font-medium uppercase tracking-wide hidden md:table-cell">Market Cap</th>
                    <th className="px-4 py-3 text-xs text-muted font-medium uppercase tracking-wide">AI Score</th>
                    <th className="px-4 py-3 text-xs text-muted font-medium uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.ticker} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted w-5">#{c.aiRank}</span>
                          <div>
                            <div className="font-semibold">{c.ticker}</div>
                            <div className="text-xs text-muted truncate max-w-[140px]">{c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-secondary text-xs hidden sm:table-cell">{c.sector}</td>
                      <td className="px-4 py-3 text-secondary text-xs hidden md:table-cell font-mono">{c.marketCap}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: score.color(c.score) }}>{c.score}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => router.push(`/dashboard/${c.ticker}`)} className="text-xs text-indigo border border-indigo/30 hover:bg-indigo/10 rounded-lg px-2.5 py-1.5 transition-colors">Open</button>
                          <button disabled={busyTicker === c.ticker} onClick={() => runScan(c.ticker)} className="text-xs text-secondary border border-white/10 hover:border-white/20 disabled:opacity-60 rounded-lg px-2.5 py-1.5 transition-colors hidden sm:block">{busyTicker === c.ticker ? 'Scanning...' : 'Scan'}</button>
                          <button disabled={busyTicker === c.ticker} onClick={() => addToWatchlist(c.ticker, c.name)} className="text-xs text-secondary border border-white/10 hover:border-white/20 disabled:opacity-60 rounded-lg px-2.5 py-1.5 transition-colors hidden sm:block">+ Watch</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-secondary text-sm">No companies match your search.</div>}
        </div>
      </div>
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  )
}
