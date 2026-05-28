'use client'
import Link from 'next/link'
import { Activity, Check } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const plans = [
    { name: 'Starter', price: '$0', features: ['5 analyses/day','Basic signals','7-day history'], cta: 'Get Started' },
    { name: 'Pro', price: '$49', features: ['Unlimited analyses','All signals','1-year history','AI Assistant','PDF exports'], cta: 'Upgrade to Pro', popular: true },
    { name: 'Enterprise', price: '$199', features: ['Everything in Pro','Custom alerts','API access','Dedicated support','White-label'], cta: 'Contact Sales' },
  ]
  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <nav className="border-b border-white/6 h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5"><div className="w-8 h-8 bg-indigo rounded-xl flex items-center justify-center"><Activity size={15} /></div><span className="font-bold">MarketPulse <span className="text-indigo">AI</span></span></Link>
        <Link href="/dashboard/NVDA" className="text-sm text-secondary hover:text-white">Dashboard →</Link>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
          <p className="text-secondary">Choose the plan that fits your intelligence needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.name} className={`border rounded-2xl p-6 ${p.popular ? 'border-indigo bg-indigo/5' : 'border-white/10'}`}>
              {p.popular && <div className="text-xs text-indigo font-semibold mb-2">MOST POPULAR</div>}
              <div className="text-lg font-semibold mb-1">{p.name}</div>
              <div className="text-4xl font-black mb-4">{p.price}<span className="text-base font-normal text-secondary">/mo</span></div>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => <li key={f} className="text-sm text-secondary flex items-center gap-2"><Check size={14} className="text-green" />{f}</li>)}
              </ul>
              <button
                onClick={() => {
                  if (p.name === 'Enterprise') {
                    window.open('mailto:sales@marketpulse.ai?subject=Enterprise%20Plan%20Inquiry', '_blank')
                    return
                  }
                  toast(`${p.name} plan selected`, 'success')
                  router.push('/login')
                }}
                className={`w-full h-11 rounded-xl font-semibold transition-colors ${p.popular ? 'bg-indigo hover:bg-indigo/80 text-white' : 'border border-white/15 hover:border-white/30 text-white'}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
