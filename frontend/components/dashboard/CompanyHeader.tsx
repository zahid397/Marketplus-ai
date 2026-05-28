'use client'
import { Company } from '@/lib/mockData'
import { fmt } from '@/lib/utils'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface Props { company: Company; lastRefreshed: string }

export default function CompanyHeader({ company, lastRefreshed }: Props) {
  const pos = company.changePercent >= 0
  const miniData = company.sentimentTrend.map(d => ({ v: d.score + 100 }))

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/6 bg-[#0A1628]/60 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-[#0D1B2E] border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
          {company.logo}
        </div>
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold">{company.name}</h1>
            <span className="text-sm font-mono text-indigo bg-indigo/10 border border-indigo/20 rounded-lg px-2.5 py-0.5">{company.ticker}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[company.sector, company.industry, company.marketCap].map(tag => (
              <span key={tag} className="text-xs text-secondary bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Mini chart */}
        <div className="hidden md:block w-28 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={miniData}>
              <Area type="monotone" dataKey="v" stroke={pos ? '#22C55E' : '#EF4444'} fill="transparent" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold font-mono">{fmt.price(company.price)}</div>
          <div className={`text-sm font-medium ${pos ? 'text-green' : 'text-red'}`}>
            {pos ? '+' : ''}{fmt.price(company.change)} ({fmt.pct(company.changePercent)})
          </div>
          {lastRefreshed && <div className="text-[10px] text-muted mt-0.5">Updated {lastRefreshed}</div>}
        </div>
      </div>
    </div>
  )
}
