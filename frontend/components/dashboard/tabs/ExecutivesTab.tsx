'use client'
import { Executive } from '@/lib/mockData'
import { User, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface Props { executives: Executive[] }

const sigCls = { high: 'border-red/30 bg-red/10', medium: 'border-yellow-400/30 bg-yellow-400/10', low: 'border-white/10 bg-transparent' }

export default function ExecutivesTab({ executives }: Props) {
  const { toast } = useToast()
  return (
    <div className="space-y-3">
      {executives.map((ex, i) => (
        <div key={i} className={`bg-[#0A1628] border rounded-xl p-5 card-hover ${sigCls[ex.significance]}`}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo/40 to-purple/20 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-indigo" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold">{ex.name}</span>
                <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border ${ex.significance === 'high' ? 'text-red bg-red/10 border-red/30' : ex.significance === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : 'text-muted border-white/10'}`}>
                  {ex.significance} signal
                </span>
              </div>
              <div className="text-xs text-indigo mb-1">{ex.title}</div>
              <p className="text-sm text-secondary mb-2">{ex.action}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">{ex.date}</span>
                <button onClick={() => toast(`Alert set for ${ex.name} activity`, 'success')} className="text-xs text-secondary hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 transition-colors">Set Alert</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
