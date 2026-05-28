'use client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Props { data: { subject: string; value: number; fullMark: number }[] }

export default function ScoreBreakdown({ data }: Props) {
  return (
    <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
      <h3 className="text-sm font-semibold mb-3">Score Breakdown</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0,100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="value" stroke="#8B5CF6" fill="rgba(139,92,246,0.25)" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} />
            <Tooltip contentStyle={{ background: '#0D1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.subject} className="text-center">
            <div className="text-xs font-bold text-white">{d.value}</div>
            <div className="text-[10px] text-muted">{d.subject}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
