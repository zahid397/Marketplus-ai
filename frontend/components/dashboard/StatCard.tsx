'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  label: string
  value: number | string
  unit?: string
  subtitle: string
  subtitleColor: string
  gaugeValue?: number    // 0-100 for circular gauge
  gaugeColor?: string
  type?: 'gauge'|'percent'|'velocity'|'mentions'
}

function CircularGauge({ value, color }: { value: number; color: string }) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnimated(value), 100); return () => clearTimeout(t) }, [value])
  const r = 30, circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(animated, 100) / 100)
  return (
    <svg viewBox="0 0 72 72" width={72} height={72}>
      <circle cx={36} cy={36} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth={6} fill="none" />
      <circle cx={36} cy={36} r={r} stroke={color} strokeWidth={6} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '36px 36px', transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  )
}

export default function StatCard({ label, value, unit, subtitle, subtitleColor, gaugeValue, gaugeColor = '#4F46E5', type = 'gauge' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A1628] border border-white/6 rounded-xl p-4 flex items-start justify-between gap-2 card-hover"
    >
      <div className="min-w-0">
        <div className="text-[11px] text-secondary mb-2 uppercase tracking-wider font-medium">{label}</div>
        <div className="flex items-end gap-1 mb-1.5">
          <span className="text-3xl font-black leading-none tabular-nums">{value}</span>
          {unit && <span className="text-sm text-secondary mb-0.5 font-medium">{unit}</span>}
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: subtitleColor, background: `${subtitleColor}18` }}>
          {subtitle}
        </span>
      </div>
      {(type === 'gauge' || type === 'percent') && gaugeValue !== undefined && (
        <div className="flex-shrink-0">
          <CircularGauge value={gaugeValue} color={gaugeColor} />
        </div>
      )}
      {type === 'velocity' && (
        <div className="flex-shrink-0 w-[72px] h-[72px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: gaugeColor }}>
              {typeof value === 'number' && value > 0 ? '+' : ''}{value}%
            </div>
          </div>
        </div>
      )}
      {type === 'mentions' && (
        <div className="flex-shrink-0 w-[72px] h-[72px] flex items-end justify-center gap-1 pb-1">
          {[3,5,4,7,6,8,9].map((h, i) => (
            <div key={i} className="w-2 rounded-sm bg-blue/60" style={{ height: `${h*7}px` }} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
