'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, LayoutDashboard, Radio, Bookmark, Building2,
  FileText, Newspaper, Settings, ChevronDown, Crown, X,
} from 'lucide-react'
import { TRACKED_TICKERS, companyData } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface Props { open: boolean; onClose: () => void; onUpgrade: () => void }

function Spark({ d, pos }: { d: number[]; pos: boolean }) {
  const max = Math.max(...d), min = Math.min(...d), range = max - min || 1
  const pts = d.map((v, i) => `${(i/(d.length-1))*56},${14-((v-min)/range)*12}`).join(' ')
  return (
    <svg width="56" height="16" className="overflow-visible">
      <polyline points={pts} fill="none" stroke={pos?'#22C55E':'#EF4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const NAV = [
  { href: '/dashboard/NVDA', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/signals', label: 'Signals', icon: Radio },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function currentTickerFromPath(pathname: string): string {
  const match = pathname.match(/^\/dashboard\/([A-Za-z0-9.-]+)/)
  return match ? match[1].toUpperCase() : 'NVDA'
}

export default function Sidebar({ open, onClose, onUpgrade }: Props) {
  const pathname = usePathname()
  const [tickersOpen, setTickersOpen] = useState(true)
  const activeTicker = currentTickerFromPath(pathname)
  const heroCompany = companyData[activeTicker] || companyData['NVDA']

  const isActive = (href: string) => {
    if (href.startsWith('/dashboard') && pathname.startsWith('/dashboard')) return true
    return pathname === href
  }

  const navClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) onClose()
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        'fixed lg:static top-0 left-0 h-full z-40 transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        <aside className="w-[232px] h-full bg-[#0A1628] border-r border-white/6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 h-[56px] border-b border-white/6 flex-shrink-0">
            <Link href="/" onClick={navClick} className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-indigo rounded-lg flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 0 16px rgba(79,70,229,0.5)' }}>
                <Activity size={13} className="text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight">MarketPulse <span className="text-indigo">AI</span></span>
            </Link>
            <button type="button" onClick={onClose} aria-label="Close sidebar" className="lg:hidden text-secondary hover:text-white p-1 rounded-lg hover:bg-white/5">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {heroCompany && (
              <Link href={`/dashboard/${activeTicker}`} onClick={navClick} className="block mx-3 mt-3 mb-2">
                <div className="bg-[#0D1B2E] border border-white/6 rounded-xl p-3 hover:border-white/12 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{activeTicker}</div>
                      <div className="text-xs text-secondary truncate max-w-[120px]">{heroCompany.name}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-mono font-semibold ${heroCompany.changePercent >= 0 ? 'text-green' : 'text-red'}`}>
                        {heroCompany.changePercent >= 0 ? '+' : ''}{heroCompany.changePercent}%
                      </div>
                      <Spark d={heroCompany.hiringData?.map((h) => h.count) || [45, 52, 58, 62, 68]} pos={heroCompany.changePercent >= 0} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="px-3 mb-1">
              <button
                type="button"
                onClick={() => setTickersOpen((p) => !p)}
                aria-expanded={tickersOpen}
                className="flex items-center justify-between w-full text-[10px] text-muted uppercase tracking-widest px-1 py-1.5 hover:text-secondary transition-colors"
              >
                <span>Tracked Tickers</span>
                <ChevronDown size={11} className={cn('transition-transform', tickersOpen ? '' : '-rotate-90')} />
              </button>

              <AnimatePresence initial={false}>
                {tickersOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    {TRACKED_TICKERS.map((t) => {
                      const c = companyData[t]
                      if (!c) return null
                      const pos = c.changePercent >= 0
                      return (
                        <Link
                          key={t}
                          href={`/dashboard/${t}`}
                          onClick={navClick}
                          className={cn(
                            'flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group',
                            t === activeTicker && 'bg-indigo/10 border border-indigo/20',
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base leading-none flex-shrink-0">{c.logo}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold">{t}</div>
                              <div className="text-[10px] text-muted truncate max-w-[72px]">{c.name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className={`text-[10px] font-semibold ${pos ? 'text-green' : 'text-red'}`}>
                              {pos ? '+' : ''}{c.changePercent}%
                            </span>
                            <Spark d={c.hiringData.map((h) => h.count)} pos={pos} />
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-4 pt-1 pb-1.5">
              <div className="text-[10px] text-muted uppercase tracking-widest">Main Menu</div>
            </div>

            <nav className="px-3 space-y-0.5 pb-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={navClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                    isActive(item.href)
                      ? 'bg-indigo/15 text-white font-medium border border-indigo/20'
                      : 'text-secondary hover:bg-white/5 hover:text-white',
                  )}
                >
                  <item.icon size={15} className={isActive(item.href) ? 'text-indigo' : 'opacity-70'} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 mx-3 mb-3 mt-2 bg-gradient-to-br from-indigo/20 to-purple/10 border border-indigo/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={13} className="text-yellow-400" />
              <span className="text-xs font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-[10px] text-secondary mb-2.5 leading-relaxed">Unlock advanced analytics, AI models & more.</p>
            <button
              type="button"
              onClick={onUpgrade}
              className="w-full bg-indigo hover:bg-indigo/80 text-white text-xs font-semibold h-8 rounded-lg transition-colors"
              style={{ boxShadow: '0 0 16px rgba(79,70,229,0.35)' }}
            >
              Upgrade Now
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
