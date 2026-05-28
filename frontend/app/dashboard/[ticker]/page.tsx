'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import CompanyHeader from '@/components/dashboard/CompanyHeader'
import StatCard from '@/components/dashboard/StatCard'
import AIAssistantPanel from '@/components/shared/AIAssistantPanel'
import PricingModal from '@/components/shared/PricingModal'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

import OverviewTab from '@/components/dashboard/tabs/OverviewTab'
import SignalsTab from '@/components/dashboard/tabs/SignalsTab'
import HiringTab from '@/components/dashboard/tabs/HiringTab'
import NewsTab from '@/components/dashboard/tabs/NewsTab'
import CompetitorsTab from '@/components/dashboard/tabs/CompetitorsTab'
import ExecutivesTab from '@/components/dashboard/tabs/ExecutivesTab'
import RisksTab from '@/components/dashboard/tabs/RisksTab'
import ReportsTab from '@/components/dashboard/tabs/ReportsTab'

import { getCompany, marketTape, Company, TRACKED_TICKERS } from '@/lib/mockData'
import { score, fmt } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'
import { api, DEMO_REPORT_IDS } from '@/lib/api'

const TABS = ['Overview','Signals','Hiring','News','Competitors','Executives','Risks','Reports']

// ─── Market Tape ──────────────────────────────────────────────────────────
function MarketTape() {
  const doubled = [...marketTape, ...marketTape]
  return (
    <div className="border-t border-white/6 bg-[#050B18] flex-shrink-0 overflow-hidden h-9 flex items-center">
      <div className="ticker-scroll whitespace-nowrap">
        {doubled.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs mx-6">
            <span className="text-secondary font-medium">{m.symbol}</span>
            <span className="font-mono">{m.price.toLocaleString()}</span>
            <span className={m.change >= 0 ? 'text-green' : 'text-red'}>
              {m.change >= 0 ? '+' : ''}{m.change}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Modals ───────────────────────────────────────────────────────────────
function CompareModal({ open, onClose, ticker }: { open: boolean; onClose: () => void; ticker: string }) {
  const [selected, setSelected] = useState<string[]>([])
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const opts = ['NVDA','TSLA','META','PLTR','AMD','MSFT','GOOGL','AAPL','AMZN','CRM'].filter(t => t !== ticker)
  const toggle = (t: string) => setSelected(p => p.includes(t) ? p.filter(x => x !== t) : p.length < 3 ? [...p, t] : p)
  return (
    <Modal open={open} onClose={onClose} title={`Compare ${ticker} with Competitors`} size="md">
      <p className="text-sm text-secondary mb-4">Select up to 3 companies to compare.</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {opts.map(t => (
          <button key={t} onClick={() => toggle(t)}
            className={`text-sm border rounded-xl px-4 py-3 text-left transition-all ${selected.includes(t) ? 'border-indigo bg-indigo/10 text-white' : 'border-white/10 text-secondary hover:border-white/20 hover:text-white'}`}>
            <div className="font-semibold">{t}</div>
            <div className="text-xs text-muted">{selected.includes(t) ? '✓ Selected' : 'Click to select'}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={async () => {
            try {
              setSubmitting(true)
              const res = await api.compare(ticker, selected)
              toast(`Comparison ready for ${res.comparisons.length} companies`, 'success')
              onClose()
              setSelected([])
            } catch (error) {
              toast(error instanceof Error ? error.message : 'Comparison failed', 'error')
            } finally {
              setSubmitting(false)
            }
          }}
          disabled={selected.length === 0 || submitting}
          className="flex-1 bg-indigo hover:bg-indigo/80 disabled:opacity-40 text-white font-semibold h-10 rounded-xl transition-colors">
          {submitting ? 'Comparing...' : `Compare (${selected.length})`}
        </button>
        <button onClick={onClose} className="px-4 h-10 border border-white/10 rounded-xl text-secondary hover:text-white transition-colors">Cancel</button>
      </div>
    </Modal>
  )
}

function ReportModal({ open, onClose, ticker }: { open: boolean; onClose: () => void; ticker: string }) {
  const [template, setTemplate] = useState('pre-earnings')
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const templates = [
    { id: 'pre-earnings', label: 'Pre-Earnings Intelligence', pages: 24 },
    { id: 'competitor', label: 'Competitor Analysis', pages: 18 },
    { id: 'risk', label: 'Risk Assessment Report', pages: 12 },
    { id: 'full', label: 'Full Intelligence Report', pages: 48 },
  ]
  return (
    <Modal open={open} onClose={onClose} title={`Generate Report — ${ticker}`} size="md">
      <p className="text-sm text-secondary mb-4">Select a report template to generate.</p>
      <div className="space-y-2 mb-5">
        {templates.map(t => (
          <button key={t.id} onClick={() => setTemplate(t.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${template===t.id ? 'border-indigo bg-indigo/10' : 'border-white/10 hover:border-white/20'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t.label}</span>
              <span className="text-xs text-muted">{t.pages} pages</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={async () => {
            try {
              setSubmitting(true)
              const res = await api.generateReport(ticker, template)
              toast(`${res.report.title} generated`, 'success')
              onClose()
            } catch (error) {
              toast(error instanceof Error ? error.message : 'Report generation failed', 'error')
            } finally {
              setSubmitting(false)
            }
          }}
          disabled={submitting}
          className="flex-1 bg-indigo hover:bg-indigo/80 disabled:opacity-50 text-white font-semibold h-10 rounded-xl transition-colors">
          {submitting ? 'Generating...' : 'Generate Report'}
        </button>
        <button onClick={onClose} className="px-4 h-10 border border-white/10 rounded-xl text-secondary hover:text-white transition-colors">Cancel</button>
      </div>
    </Modal>
  )
}

function AlertModal({ open, onClose, ticker }: { open: boolean; onClose: () => void; ticker: string }) {
  const [type, setType] = useState('price')
  const [condition, setCondition] = useState('above')
  const [value, setValue] = useState('')
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const types = [
    { id: 'price', label: 'Price Alert' },
    { id: 'signal', label: 'Signal Alert' },
    { id: 'score', label: 'AI Score Alert' },
    { id: 'hiring', label: 'Hiring Velocity Alert' },
  ]
  return (
    <Modal open={open} onClose={onClose} title={`Create Alert — ${ticker}`} size="md">
      <div className="space-y-4 mb-5">
        <div>
          <label className="text-xs text-secondary block mb-1.5 uppercase tracking-wide">Alert Type</label>
          <div className="grid grid-cols-2 gap-2">
            {types.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`text-sm border rounded-xl px-3 py-2 transition-all ${type===t.id ? 'border-indigo bg-indigo/10 text-white' : 'border-white/10 text-secondary hover:border-white/20'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1.5 uppercase tracking-wide">Condition</label>
          <div className="flex gap-2">
            {['above', 'below', 'crosses'].map(c => (
              <button key={c} onClick={() => setCondition(c)}
                className={`flex-1 text-sm border rounded-xl py-2 capitalize transition-all ${condition===c ? 'border-indigo bg-indigo/10 text-white' : 'border-white/10 text-secondary hover:border-white/20'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1.5 uppercase tracking-wide">Threshold Value</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            placeholder={type === 'price' ? 'e.g. 1100.00' : 'e.g. 85'}
            className="w-full bg-[#050B18] border border-white/10 rounded-xl px-4 h-11 text-white placeholder:text-muted outline-none focus:border-indigo/50 transition-colors" />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={async () => {
            if (!value) {
              toast('Please enter a threshold value', 'error')
              return
            }
            try {
              setSubmitting(true)
              await api.createAlert({ ticker, type, condition, value })
              toast(`Alert created for ${ticker}`, 'success')
              onClose()
              setValue('')
            } catch (error) {
              toast(error instanceof Error ? error.message : 'Alert creation failed', 'error')
            } finally {
              setSubmitting(false)
            }
          }}
          disabled={submitting}
          className="flex-1 bg-indigo hover:bg-indigo/80 disabled:opacity-50 text-white font-semibold h-10 rounded-xl transition-colors">
          {submitting ? 'Creating...' : 'Create Alert'}
        </button>
        <button onClick={onClose} className="px-4 h-10 border border-white/10 rounded-xl text-secondary hover:text-white transition-colors">Cancel</button>
      </div>
    </Modal>
  )
}

// ─── MAIN DASHBOARD PAGE ───────────────────────────────────────────────────
export default function DashboardPage() {
  const params = useParams()
  const ticker = (params.ticker as string || 'NVDA').toUpperCase()
  const { toast } = useToast()

  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [aiPanel, setAiPanel] = useState(false)
  const [aiPrefill, setAiPrefill] = useState('')
  const [inWatchlist, setInWatchlist] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState('')
  const [compareModal, setCompareModal] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [alertModal, setAlertModal] = useState(false)
  const [pricingModal, setPricingModal] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)

  useEffect(() => {
    setLoading(true)
    setActiveTab('Overview')
    api.listWatchlist()
      .then((res) => setInWatchlist(res.items.some((item) => item.ticker === ticker)))
      .catch(() => setInWatchlist(false))

    const timer = setTimeout(() => {
      setCompany(getCompany(ticker))
      setLoading(false)
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 600)
    return () => clearTimeout(timer)
  }, [ticker])

  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    api.analyze(ticker)
      .then(() => {
        setCompany(getCompany(ticker))
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        toast('Analysis refreshed with latest signals', 'success')
      })
      .catch((error) => {
        toast(error instanceof Error ? error.message : 'Refresh failed', 'error')
      })
      .finally(() => setRefreshing(false))
  }

  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await api.removeWatchlist(ticker)
        setInWatchlist(false)
        toast(`${ticker} removed from watchlist`, 'info')
      } else {
        await api.addWatchlist(ticker, company?.name || ticker, false)
        setInWatchlist(true)
        toast(`${ticker} added to watchlist`, 'success')
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Watchlist update failed', 'error')
    }
  }

  const handleFollowUp = (question: string) => {
    setAiPrefill(question)
    setAiPanel(true)
  }

  const handleExportPDF = async () => {
    if (exportingPdf) return
    try {
      setExportingPdf(true)
      const res = await api.exportReport(DEMO_REPORT_IDS.PRE_EARNINGS, 'pdf', ticker)
      toast(
        res.demo ? `PDF exported locally (demo fallback) for ${ticker}` : `PDF export for ${ticker} started`,
        'success',
      )
    } catch (error) {
      toast(error instanceof Error ? error.message : 'PDF export failed', 'error')
    } finally {
      setExportingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#050B18]">
        <Sidebar open={false} onClose={() => {}} onUpgrade={() => setPricingModal(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size={40} />
            <p className="text-secondary text-sm mt-4">Loading intelligence brief for {ticker}...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!company) return null

  const sc = company.scores
  const statCards = [
    { label: 'Pre-Earnings Score', value: sc.preEarnings, unit: '/100', subtitle: score.label(sc.preEarnings), subtitleColor: score.color(sc.preEarnings), gaugeValue: sc.preEarnings, gaugeColor: score.color(sc.preEarnings), type: 'gauge' as const },
    { label: 'Confidence', value: sc.confidence, unit: '%', subtitle: score.confLabel(sc.confidence), subtitleColor: '#8B5CF6', gaugeValue: sc.confidence, gaugeColor: '#8B5CF6', type: 'percent' as const },
    { label: 'Risk Level', value: sc.risk, unit: '/100', subtitle: score.riskLabel(sc.risk), subtitleColor: score.riskColor(sc.risk), gaugeValue: sc.risk, gaugeColor: score.riskColor(sc.risk), type: 'gauge' as const },
    { label: 'Hiring Velocity', value: sc.hiringVelocity, unit: '%', subtitle: sc.hiringVelocity > 20 ? 'Strong Growth' : sc.hiringVelocity > 0 ? 'Modest Growth' : 'Declining', subtitleColor: sc.hiringVelocity > 0 ? '#22C55E' : '#EF4444', gaugeColor: sc.hiringVelocity > 0 ? '#22C55E' : '#EF4444', type: 'velocity' as const },
    { label: 'News Sentiment', value: sc.newsSentiment, unit: '/100', subtitle: score.sentLabel(sc.newsSentiment), subtitleColor: score.color(sc.newsSentiment), gaugeValue: sc.newsSentiment, gaugeColor: score.color(sc.newsSentiment), type: 'gauge' as const },
    { label: 'Mentions', value: fmt.num(sc.mentions), subtitle: 'Last 7 Days', subtitleColor: '#94A3B8', type: 'mentions' as const },
  ]

  const tabContent: Record<string, React.ReactNode> = {
    Overview: <OverviewTab company={company} onFollowUp={handleFollowUp} />,
    Signals: <SignalsTab signals={company.signals} />,
    Hiring: <HiringTab company={company} />,
    News: <NewsTab news={company.news} />,
    Competitors: <CompetitorsTab competitors={company.competitors} />,
    Executives: <ExecutivesTab executives={company.executives} />,
    Risks: <RisksTab risks={company.risks} />,
    Reports: <ReportsTab ticker={ticker} />,
  }

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={mobileSidebar} onClose={() => setMobileSidebar(false)} onUpgrade={() => setPricingModal(true)} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Command Bar */}
        <TopBar
          ticker={ticker}
          inWatchlist={inWatchlist}
          refreshing={refreshing}
          exportingPdf={exportingPdf}
          aiPanelOpen={aiPanel}
          lastRefreshed={lastRefreshed}
          onCompare={() => setCompareModal(true)}
          onReport={() => setReportModal(true)}
          onExportPDF={handleExportPDF}
          onWatchlist={handleWatchlist}
          onAlert={() => setAlertModal(true)}
          onRefresh={handleRefresh}
          onAIAssistant={() => {
            setAiPanel((p) => !p)
            if (!aiPanel) toast('AI Assistant opened', 'info')
          }}
          onMenuOpen={() => setMobileSidebar(true)}
          onOpenPricing={() => setPricingModal(true)}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Company header */}
          <CompanyHeader company={company} lastRefreshed={lastRefreshed} />

          {/* Tabs */}
          <div className="border-b border-white/6 px-4 sm:px-6 flex-shrink-0 bg-[#0A1628]/40">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 text-sm px-4 py-3 border-b-2 transition-all ${activeTab === tab ? 'border-indigo text-white font-medium' : 'border-transparent text-secondary hover:text-white'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="px-4 sm:px-6 pt-4 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {statCards.map((c, i) => <StatCard key={i} {...c} />)}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 sm:px-6 py-4"
          >
            {tabContent[activeTab]}
          </motion.div>
        </div>

        {/* Market Tape */}
        <MarketTape />
      </div>

      {/* AI Assistant Panel */}
      <AIAssistantPanel open={aiPanel} onClose={() => setAiPanel(false)} prefill={aiPrefill} ticker={ticker} />

      {/* Modals */}
      <CompareModal open={compareModal} onClose={() => setCompareModal(false)} ticker={ticker} />
      <ReportModal open={reportModal} onClose={() => setReportModal(false)} ticker={ticker} />
      <AlertModal open={alertModal} onClose={() => setAlertModal(false)} ticker={ticker} />
      <PricingModal open={pricingModal} onClose={() => setPricingModal(false)} />
    </div>
  )
}
