'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface Props { data: { date: string; score: number; volume: number }[] }

export default function SentimentTrend({ data }: Props) {
  const latest = data[data.length - 1]?.score ?? 0
  const pos = latest >= 0

  return (
    <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">Sentiment Trend <span className="text-muted font-normal">(30 Days)</span></h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pos ? 'bg-green/15 text-green' : 'bg-red/15 text-red'}`}>
          {pos ? 'Positive' : 'Negative'}
        </span>
      </div>
      <div className="h-[170px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={pos ? '#22C55E' : '#EF4444'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={pos ? '#22C55E' : '#EF4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} domain={[-100, 100]} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{ background: '#0D1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC', fontSize: '11px' }}
              formatter={(v: number) => [v > 0 ? `+${v}` : v, 'Sentiment']}
            />
            <Area type="monotone" dataKey="score" stroke={pos ? '#22C55E' : '#EF4444'} fill="url(#sentGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
