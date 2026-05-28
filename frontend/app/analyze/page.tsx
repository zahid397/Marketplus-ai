'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Zap, Users, Newspaper, Target, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import { api, isBackendOnline } from '@/lib/api'

const TYPES = [
  { id: 'pre-earnings', label: 'Pre-Earnings Intelligence', desc: 'Full signal analysis before earnings', icon: Target },
  { id: 'hiring', label: 'Hiring Signal Analysis', desc: 'Job postings & velocity tracking', icon: Users },
  { id: 'news', label: 'News Sentiment', desc: 'Real-time news & sentiment scoring', icon: Newspaper },
  { id: 'competitor', label: 'Competitor Tracking', desc: 'Monitor competitive threats', icon: Zap },
]
const SAMPLES = ['NVDA','TSLA','META','PLTR','AMD','MSFT']

export default function AnalyzePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [ticker, setTicker] = useState('')
  const [company, setCompany] = useState('')
  const [type, setType] = useState('pre-earnings')
  const [range, setRange] = useState('30')
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem('mp_recent') || '[]'))
  }, [])

  const analyze = async () => {
    const t = ticker.trim().toUpperCase()
    if (!t) { toast('Please enter a ticker symbol', 'error'); return }
    if (!/^[A-Z]{1,5}$/.test(t)) { toast('Invalid ticker format (1-5 letters)', 'error'); return }
    const updated = [t, ...recent.filter(x => x !== t)].slice(0, 5)
    localStorage.setItem('mp_recent', JSON.stringify(updated))
    try {
      setLoading(true)
      await api.analyze(t)
      if (isBackendOnline() === false) {
        toast('Using offline demo AI — opening dashboard', 'info')
      } else {
        toast(`${t} analysis ready`, 'success')
      }
      router.push(`/dashboard/${t}`)
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Analysis failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => { setTicker(''); setCompany(''); setType('pre-earnings'); setRange('30'); toast('Form cleared', 'info') }

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <nav className="border-b border-white/6 h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo rounded-xl flex items-center justify-center"><Activity size={15} className="text-white" /></div>
          <span className="font-bold">MarketPulse <span className="text-indigo">AI</span></span>
        </Link>
        <Link href="/dashboard/NVDA" className="text-sm text-secondary hover:text-white transition-colors">Dashboard →</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Analyze a Company</h1>
          <p className="text-secondary mb-8">Generate AI-powered pre-earnings intelligence in seconds.</p>

          <div className="bg-[#0A1628] border border-white/6 rounded-2xl p-6 space-y-6">
            {/* Ticker + company */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-secondary uppercase tracking-wide block mb-1.5">Ticker Symbol *</label>
                <div className="relative">
                  <TrendingUp size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                  <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="NVDA" maxLength={5}
                    className="w-full bg-[#050B18] border border-white/10 rounded-xl pl-10 pr-4 h-12 text-white placeholder:text-muted outline-none focus:border-indigo/50 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs text-secondary uppercase tracking-wide block mb-1.5">Company Name (optional)</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="NVIDIA Corporation"
                  className="w-full bg-[#050B18] border border-white/10 rounded-xl px-4 h-12 text-white placeholder:text-muted outline-none focus:border-indigo/50 transition-colors" />
              </div>
            </div>

            {/* Analysis type */}
            <div>
              <label className="text-xs text-secondary uppercase tracking-wide block mb-2">Analysis Type</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setType(t.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${type===t.id ? 'border-indigo bg-indigo/10' : 'border-white/10 hover:border-white/20'}`}>
                    <t.icon size={18} className={type===t.id ? 'text-indigo mb-2' : 'text-secondary mb-2'} />
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-muted mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time range */}
            <div>
              <label className="text-xs text-secondary uppercase tracking-wide block mb-2">Time Range</label>
              <div className="flex gap-2">
                {['7','30','90'].map(r => (
                  <button key={r} onClick={() => setRange(r)}
                    className={`flex-1 h-10 rounded-xl border text-sm font-medium transition-all ${range===r ? 'border-indigo bg-indigo/10 text-white' : 'border-white/10 text-secondary hover:border-white/20'}`}>
                    {r} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={analyze} disabled={loading}
                className="flex-1 bg-indigo hover:bg-indigo/80 disabled:opacity-60 text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {loading ? <><LoadingSpinner size={16} color="#fff" /> Analyzing...</> : <>Analyze Company <ArrowRight size={16} /></>}
              </motion.button>
              <button onClick={clear} className="px-5 h-12 border border-white/10 rounded-xl text-secondary hover:text-white hover:border-white/20 transition-colors">Clear</button>
            </div>
          </div>

          {/* Recent + samples */}
          {recent.length > 0 && (
            <div className="mt-6">
              <div className="text-xs text-secondary uppercase tracking-wide mb-2">Recent Searches</div>
              <div className="flex gap-2 flex-wrap">
                {recent.map(t => (
                  <button key={t} onClick={() => setTicker(t)} className="text-xs bg-white/5 border border-white/8 hover:border-indigo/40 rounded-lg px-3 py-1.5 text-secondary hover:text-indigo transition-colors">{t}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6">
            <div className="text-xs text-secondary uppercase tracking-wide mb-2">Sample Tickers</div>
            <div className="flex gap-2 flex-wrap">
              {SAMPLES.map(t => (
                <button key={t} onClick={() => setTicker(t)} className="text-xs bg-white/5 border border-white/8 hover:border-indigo/40 rounded-lg px-3 py-1.5 text-secondary hover:text-indigo transition-colors">{t}</button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
