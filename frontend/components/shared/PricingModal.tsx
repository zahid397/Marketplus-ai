'use client'

import Modal from '@/components/ui/Modal'
import { useToast } from '@/contexts/ToastContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function PricingModal({ open, onClose }: Props) {
  const { toast } = useToast()
  const plans = [
    { name: 'Starter', price: '$0', period: '/mo', features: ['5 ticker analyses/day', 'Basic signals', '7-day history'], cta: 'Current Plan', active: true },
    { name: 'Pro', price: '$49', period: '/mo', features: ['Unlimited analyses', 'All signal types', '1-year history', 'AI Assistant', 'PDF exports'], cta: 'Upgrade to Pro', active: false },
    { name: 'Enterprise', price: '$199', period: '/mo', features: ['Everything in Pro', 'Custom alerts', 'API access', 'Dedicated support', 'White-label reports'], cta: 'Contact Sales', active: false },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Upgrade Your Plan" size="lg">
      <p className="text-sm text-secondary mb-4">Demo mode — billing is simulated. Pro features coming soon in demo mode.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.name} className={`border rounded-xl p-5 ${p.active ? 'border-white/20' : 'border-indigo/30 bg-indigo/5'}`}>
            <div className="text-sm font-semibold mb-1">{p.name}</div>
            <div className="text-2xl font-black mb-0.5">
              {p.price}
              <span className="text-sm font-normal text-secondary">{p.period}</span>
            </div>
            <ul className="space-y-1.5 mt-3 mb-4">
              {p.features.map((f) => (
                <li key={f} className="text-xs text-secondary flex items-center gap-1.5">
                  <span className="text-green">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                if (p.active) {
                  toast('You are on the Starter plan (demo)', 'info')
                } else if (p.name === 'Pro') {
                  toast('Pro features coming soon in demo mode', 'info')
                } else {
                  toast('Enterprise sales contact opened (demo)', 'success')
                }
                onClose()
              }}
              className={`w-full h-9 rounded-lg text-sm font-semibold transition-colors ${
                p.active ? 'bg-white/8 text-secondary cursor-default' : 'bg-indigo hover:bg-indigo/80 text-white'
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
