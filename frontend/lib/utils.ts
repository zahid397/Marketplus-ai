import { clsx, type ClassValue } from 'clsx'
export function cn(...i: ClassValue[]) { return clsx(i) }
export const fmt = {
  price: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n),
  pct: (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`,
  num: (n: number) => n >= 1e9 ? `${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n),
  ago: (d: Date) => { const s=Math.floor((Date.now()-d.getTime())/1000); return s<60?`${s}s ago`:s<3600?`${Math.floor(s/60)}m ago`:`${Math.floor(s/3600)}h ago` },
}
export const score = {
  color: (v: number) => v >= 70 ? '#22C55E' : v >= 40 ? '#F59E0B' : '#EF4444',
  label: (v: number) => v >= 75 ? 'Very Bullish' : v >= 60 ? 'Bullish' : v >= 45 ? 'Neutral' : v >= 30 ? 'Bearish' : 'Very Bearish',
  riskLabel: (v: number) => v >= 65 ? 'High Risk' : v >= 35 ? 'Moderate Risk' : 'Low Risk',
  riskColor: (v: number) => v >= 65 ? '#EF4444' : v >= 35 ? '#F59E0B' : '#22C55E',
  sentLabel: (v: number) => v >= 65 ? 'Positive' : v >= 45 ? 'Neutral' : 'Negative',
  confLabel: (v: number) => v >= 70 ? 'High Confidence' : v >= 50 ? 'Moderate' : 'Low Confidence',
}
