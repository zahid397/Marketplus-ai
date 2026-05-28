'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Zap, Target, BarChart2, CheckCircle, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/contexts/ToastContext'
import { marketTape } from '@/lib/mockData'
import { api } from '@/lib/api'

const POPULAR = ['NVDA','TSLA','META','PLTR','AMD','MSFT']

export default function LandingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [ticker, setTicker] = useState('')
  const [earlyModal, setEarlyModal] = useState(false)
  const [email, setEmail] = useState('')
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false)

  const go = (t: string) => { if (t) router.push(`/dashboard/${t.toUpperCase()}`) }

  const handleEarly = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      setSubmittingWaitlist(true)
      await api.joinWaitlist(email)
      setEarlyModal(false)
      setEmail('')
      toast('Early access request received! We will be in touch soon.', 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Failed to join waitlist', 'error')
    } finally {
      setSubmittingWaitlist(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050B18]/90 backdrop-blur-xl border-b border-white/6 h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo rounded-xl flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(79,70,229,0.5)' }}>
            <Activity size={15} className="text-white" />
          </div>
          <span className="font-bold">MarketPulse <span className="text-indigo">AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-secondary">
          <Link href="/analyze" className="hover:text-white transition-colors">Product</Link>
          <Link href="/signals" className="hover:text-white transition-colors">Signals</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Enterprise</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-secondary hover:text-white transition-colors hidden sm:block">Sign in</Link>
          <button onClick={() => setEarlyModal(true)} className="text-sm font-semibold bg-indigo hover:bg-indigo/80 text-white px-4 h-9 rounded-xl transition-colors" style={{ boxShadow: '0 0 16px rgba(79,70,229,0.4)' }}>
            Get Early Access →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo/8 via-transparent to-purple/5 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-indigo/15 border border-indigo/30 rounded-full px-4 py-1.5 text-xs text-indigo mb-7 font-medium">
              <Zap size={12} /> AI Financial Intelligence Platform
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-[1.08] mb-6">
              <span>Pre-Earnings<br />Intelligence.<br /></span>
              <span className="bg-gradient-to-r from-blue via-indigo to-purple bg-clip-text text-transparent">
                Before The<br />Market Knows.
              </span>
            </h1>
            <p className="text-lg text-secondary leading-relaxed mb-9 max-w-lg">
              MarketPulse AI turns real-time web signals into actionable financial intelligence using AI.
            </p>

            <form onSubmit={e => { e.preventDefault(); go(ticker) }} className="flex gap-3 mb-7">
              <div className="flex-1 relative">
                <TrendingUp size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())}
                  placeholder="Enter ticker (e.g. NVDA, TSLA)"
                  maxLength={10}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 h-[52px] text-white placeholder:text-secondary outline-none focus:border-indigo/50 transition-colors" />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="bg-indigo hover:bg-indigo/80 text-white font-semibold px-6 h-[52px] rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors"
                style={{ boxShadow: '0 0 24px rgba(79,70,229,0.45)' }}>
                Analyze Now <ArrowRight size={15} />
              </motion.button>
            </form>

            <div className="flex items-center gap-2 mb-8">
              <span className="text-xs text-muted">Popular:</span>
              <div className="flex gap-2 flex-wrap">
                {POPULAR.map(t => (
                  <button key={t} onClick={() => go(t)}
                    className="text-xs bg-white/5 border border-white/8 hover:border-indigo/40 hover:text-indigo rounded-lg px-3 py-1.5 text-secondary transition-colors">{t}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-xs">▶</div>
                Watch Demo
              </button>
              <div className="flex items-center gap-1.5 text-sm text-secondary">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                4.9/5 from 2,000+ analysts
              </div>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block" style={{ perspective: '1200px' }}>
            <div className="bg-[#0A1628] border border-white/10 rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 0 80px rgba(79,70,229,0.3)', transform: 'rotateY(-6deg) rotateX(2deg)' }}>
              <div className="bg-[#0D1B2E] px-4 py-3 border-b border-white/6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🟢</span>
                  <span className="font-semibold text-sm">NVIDIA Corporation</span>
                  <span className="text-xs text-indigo bg-indigo/10 border border-indigo/20 rounded px-2 py-0.5 font-mono">NVDA</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono">$1,024.86</div>
                  <div className="text-xs text-green">+3.42%</div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{l:'Pre-Earnings',v:'87',s:'Very Bullish',c:'#22C55E'},{l:'Confidence',v:'78%',s:'High',c:'#8B5CF6'},{l:'Risk Level',v:'32',s:'Moderate',c:'#F59E0B'}].map(s=>(
                    <div key={s.l} className="bg-[#050B18] rounded-xl p-3">
                      <div className="text-[10px] text-secondary mb-1">{s.l}</div>
                      <div className="text-xl font-black" style={{ color: s.c }}>{s.v}</div>
                      <div className="text-[10px] text-muted">{s.s}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-secondary mb-2 font-medium">Live Signals Feed</div>
                {[
                  { dot: '#22C55E', text: 'Institutional Buy Signal — JPMorgan +2.3M shares', time: '5m' },
                  { dot: '#4F46E5', text: 'AI Chip Demand Exceeds Expectations', time: '12m' },
                  { dot: '#F59E0B', text: 'Hiring Spike Detected — AI/ML +48% MoM', time: '18m' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                    <span className="text-xs text-secondary flex-1 truncate">{s.text}</span>
                    <span className="text-[10px] text-muted">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-white/6 bg-[#070E1A] py-4 overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-8 md:gap-12 flex-wrap px-6">
          <span className="text-xs text-muted">Trusted by leading teams</span>
          {['BlackRock.','Morgan Stanley','citi','Goldman Sachs','Microsoft','SEQUOIA'].map(l=>(
            <span key={l} className="text-sm text-secondary font-medium opacity-60 hover:opacity-100 transition-opacity">{l}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-white/6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How MarketPulse AI Works</h2>
            <p className="text-secondary">Three steps to institutional-grade earnings intelligence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart2, step: '01', title: 'Collect Live Signals', desc: 'Hiring data, news sentiment, competitor moves, and institutional activity — aggregated in real-time from thousands of sources via Bright Data.' },
              { icon: Zap, step: '02', title: 'AI Synthesis', desc: 'Multi-model AI cascade (Claude → Gemini → GPT-4) synthesizes signals into structured, source-cited pre-earnings intelligence briefs.' },
              { icon: Target, step: '03', title: 'Act Before the Market', desc: 'Get actionable intelligence 2-4 weeks before earnings so you can position confidently with full signal transparency and confidence scores.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-[#0A1628] border border-white/6 rounded-2xl p-6 card-hover">
                <div className="text-xs text-indigo font-mono mb-3 font-semibold">{f.step}</div>
                <f.icon size={22} className="text-indigo mb-3" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Start your intelligence edge today</h2>
          <p className="text-secondary mb-8">Join 2,000+ institutional investors using MarketPulse AI.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setEarlyModal(true)}
              className="bg-indigo hover:bg-indigo/80 text-white font-semibold px-8 h-12 rounded-xl transition-colors"
              style={{ boxShadow: '0 0 24px rgba(79,70,229,0.4)' }}>
              Get Early Access
            </motion.button>
            <Link href="/analyze" className="border border-white/20 hover:border-white/40 text-white font-medium px-8 h-12 rounded-xl flex items-center justify-center transition-colors">
              Try Free Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Market tape */}
      <div className="border-t border-white/6 bg-[#050B18] overflow-hidden h-9 flex items-center">
        <div className="ticker-scroll whitespace-nowrap">
          {[...marketTape, ...marketTape].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs mx-6">
              <span className="text-secondary">{m.symbol}</span>
              <span className="font-mono">{m.price.toLocaleString()}</span>
              <span className={m.change >= 0 ? 'text-green' : 'text-red'}>{m.change >= 0 ? '+' : ''}{m.change}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/6 py-6 px-6 text-center">
        <p className="text-xs text-muted">© 2024 MarketPulse AI. For informational purposes only. Not financial advice.</p>
      </div>

      <Modal open={earlyModal} onClose={() => setEarlyModal(false)} title="Get Early Access">
        <form onSubmit={handleEarly} className="space-y-4">
          <p className="text-sm text-secondary">Join 2,000+ analysts on the MarketPulse AI waitlist.</p>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
            className="w-full bg-[#050B18] border border-white/10 rounded-xl px-4 h-11 text-white placeholder:text-secondary outline-none focus:border-indigo/50 transition-colors" />
          <button type="submit" disabled={submittingWaitlist} className="w-full bg-indigo hover:bg-indigo/80 disabled:opacity-60 text-white font-semibold h-11 rounded-xl transition-colors">
            {submittingWaitlist ? 'Submitting...' : 'Request Early Access'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
