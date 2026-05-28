'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props { data: { dept: string; count: number; color: string }[] }

export default function HiringDistribution({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
      <h3 className="text-sm font-semibold mb-3">Hiring Distribution</h3>
      <div className="h-[140px] mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <XAxis dataKey="dept" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0D1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC', fontSize: '11px' }} />
            <Bar dataKey="count" radius={[3,3,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5">
        {data.map(d => (
          <div key={d.dept} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-secondary flex-1">{d.dept}</span>
            <span className="text-xs font-semibold">{d.count}</span>
            <span className="text-[10px] text-muted w-10 text-right">{Math.round(d.count/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
