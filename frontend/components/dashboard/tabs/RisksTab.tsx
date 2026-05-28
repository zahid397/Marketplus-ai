'use client'
import { Risk } from '@/lib/mockData'
import { Shield, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

interface Props { risks: Risk[] }

const sevConfig = {
  Low: { cls: 'border-green/20 bg-green/5', badge: 'bg-green/15 text-green border-green/30', Icon: ShieldCheck },
  Medium: { cls: 'border-yellow-400/20 bg-yellow-400/5', badge: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30', Icon: Shield },
  High: { cls: 'border-red/20 bg-red/5', badge: 'bg-red/15 text-red border-red/30', Icon: AlertTriangle },
  Critical: { cls: 'border-red/30 bg-red/10', badge: 'bg-red/20 text-red border-red/40', Icon: ShieldAlert },
}

export default function RisksTab({ risks }: Props) {
  const { toast } = useToast()
  return (
    <div className="space-y-3">
      {risks.map(r => {
        const cfg = sevConfig[r.severity]
        return (
          <div key={r.id} className={cn('border rounded-xl p-5 card-hover', cfg.cls)}>
            <div className="flex items-start gap-4">
              <cfg.Icon size={18} className="flex-shrink-0 mt-0.5" style={{ color: r.severity === 'Low' ? '#22C55E' : r.severity === 'High' || r.severity === 'Critical' ? '#EF4444' : '#F59E0B' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{r.category}</span>
                  <span className={cn('text-[10px] font-semibold border rounded-full px-1.5 py-0.5', cfg.badge)}>{r.severity}</span>
                </div>
                <p className="text-sm text-secondary mb-2 leading-relaxed">{r.description}</p>
                <div className="bg-black/20 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Mitigation</div>
                  <p className="text-xs text-secondary">{r.mitigation}</p>
                </div>
                <button onClick={() => toast(`Alert set for ${r.category} risk`, 'success')} className="mt-2.5 text-xs text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 transition-colors">Monitor Risk</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
