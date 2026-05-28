'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GitCompare, FileText, Download, Heart, BellPlus, RefreshCw, Bot, Search, Menu } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import HeaderActions from '@/components/shared/HeaderActions'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

interface Props {
  ticker: string
  inWatchlist: boolean
  refreshing: boolean
  exportingPdf?: boolean
  aiPanelOpen: boolean
  lastRefreshed: string
  onCompare: () => void
  onReport: () => void
  onExportPDF: () => void
  onWatchlist: () => void
  onAlert: () => void
  onRefresh: () => void
  onAIAssistant: () => void
  onMenuOpen: () => void
  onOpenPricing?: () => void
}

export default function TopBar({
  ticker, inWatchlist, refreshing, exportingPdf, aiPanelOpen, lastRefreshed,
  onCompare, onReport, onExportPDF, onWatchlist, onAlert, onRefresh, onAIAssistant, onMenuOpen, onOpenPricing,
}: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const focusSearch = () => {
    inputRef.current?.focus()
    mobileInputRef.current?.focus()
    setMobileSearchOpen(true)
    toast('Search tickers — type symbol and press Enter', 'info')
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const t = search.trim().toUpperCase()
    if (!t) {
      toast('Enter a ticker symbol to search', 'error')
      return
    }
    toast(`Opening dashboard for ${t}`, 'info')
    router.push(`/dashboard/${t}`)
    setSearch('')
    setMobileSearchOpen(false)
  }

  const Btn = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-all border flex-shrink-0',
        disabled && 'opacity-50 cursor-not-allowed',
        active
          ? 'bg-indigo border-indigo text-white shadow-lg shadow-indigo/30'
          : 'bg-transparent border-white/10 text-secondary hover:text-white hover:border-white/20',
      )}
    >
      {children}
    </motion.button>
  )

  return (
    <>
      <div className="h-[56px] flex-shrink-0 flex items-center justify-between px-4 bg-[#0A1628]/80 backdrop-blur-md border-b border-white/6 gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide min-w-0 flex-1">
          <button
            type="button"
            onClick={onMenuOpen}
            className="lg:hidden p-2 text-secondary hover:text-white mr-1 flex-shrink-0 rounded-lg hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <Btn onClick={onCompare} title="Compare with competitors">
            <GitCompare size={13} /> <span className="hidden sm:inline">Compare</span>
          </Btn>
          <Btn onClick={onReport} title="Generate intelligence report">
            <FileText size={13} /> <span className="hidden sm:inline">Generate Report</span>
          </Btn>
          <Btn onClick={onExportPDF} disabled={!!exportingPdf} title="Export as PDF">
            {exportingPdf ? <LoadingSpinner size={13} color="#94A3B8" /> : <Download size={13} />}
            <span className="hidden sm:inline">{exportingPdf ? 'Exporting...' : 'Export PDF'}</span>
          </Btn>
          <Btn onClick={onWatchlist} active={inWatchlist} title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}>
            <Heart size={13} className={inWatchlist ? 'fill-current' : ''} />
            <span className="hidden sm:inline">Watchlist</span>
          </Btn>
          <Btn onClick={onAlert} title="Create price or signal alert">
            <BellPlus size={13} /> <span className="hidden sm:inline">Create Alert</span>
          </Btn>
          <Btn
            onClick={() => {
              if (!refreshing) {
                onRefresh()
              }
            }}
            disabled={refreshing}
            title={lastRefreshed ? `Last refreshed ${lastRefreshed}` : 'Refresh analysis data'}
          >
            {refreshing ? <LoadingSpinner size={13} color="#94A3B8" /> : <RefreshCw size={13} />}
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Btn>
          <Btn onClick={onAIAssistant} active={aiPanelOpen} title="Open AI Assistant">
            <Bot size={13} />
            <span className="hidden sm:inline">AI Assistant</span>
          </Btn>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={focusSearch}
            className="md:hidden p-2 text-secondary hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Search ticker"
          >
            <Search size={16} />
          </button>

          <form
            onSubmit={handleSearch}
            className={cn(
              'hidden md:flex items-center gap-2 h-8 px-3 rounded-lg border transition-all',
              focused ? 'bg-[#0D1B2E] border-indigo/50 w-52' : 'bg-white/5 border-white/10 w-44',
            )}
          >
            <Search size={13} className="text-secondary flex-shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search ticker..."
              aria-label="Search ticker"
              className="bg-transparent text-xs text-white placeholder:text-secondary outline-none w-full"
            />
            <button
              type="button"
              onClick={focusSearch}
              className="text-[10px] text-muted border border-white/10 rounded px-1 flex-shrink-0 hover:text-white hover:border-white/20"
              title="Focus search (Ctrl+K)"
            >
              ⌘K
            </button>
          </form>

          <HeaderActions onOpenPricing={onOpenPricing} />
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2 border-b border-white/6 bg-[#0A1628]/90">
          <form onSubmit={handleSearch} className="flex items-center gap-2 h-10 px-3 rounded-lg border border-indigo/40 bg-[#0D1B2E]">
            <Search size={14} className="text-secondary flex-shrink-0" />
            <input
              ref={mobileInputRef}
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
              placeholder={`Search ticker (e.g. ${ticker})...`}
              aria-label="Search ticker mobile"
              className="bg-transparent text-sm text-white placeholder:text-muted outline-none w-full"
            />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="text-xs text-secondary hover:text-white px-2"
            >
              Close
            </button>
          </form>
        </div>
      )}
    </>
  )
}
