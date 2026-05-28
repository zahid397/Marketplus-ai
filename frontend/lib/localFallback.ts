import { ApiUser } from './api'

export const DEMO_USER: ApiUser = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@marketpulse.ai',
  role: 'admin',
}

export interface AnalysisResult {
  ticker: string
  companyName: string
  generatedAt: string
  dataMode: 'demo' | 'fallback'
  preEarningsScore: number
  confidenceScore: number
  riskScore: number
  hiringVelocity: number
  newsSentiment: number
  executiveSummary: string
  signals: { type: string; source: string; message: string; confidence: number; sentiment: string }[]
  risks: { category: string; severity: string; description: string }[]
}

const PROFILES: Record<string, Partial<AnalysisResult>> = {
  NVDA: { preEarningsScore: 87, confidenceScore: 78, riskScore: 32, hiringVelocity: 48, newsSentiment: 72, companyName: 'NVIDIA Corporation' },
  TSLA: { preEarningsScore: 54, confidenceScore: 62, riskScore: 65, hiringVelocity: -12, newsSentiment: 45, companyName: 'Tesla Inc.' },
  META: { preEarningsScore: 74, confidenceScore: 81, riskScore: 38, hiringVelocity: 22, newsSentiment: 68, companyName: 'Meta Platforms' },
  PLTR: { preEarningsScore: 71, confidenceScore: 74, riskScore: 42, hiringVelocity: 35, newsSentiment: 65, companyName: 'Palantir Technologies' },
  AMD: { preEarningsScore: 71, confidenceScore: 76, riskScore: 44, hiringVelocity: 31, newsSentiment: 64, companyName: 'Advanced Micro Devices' },
  MSFT: { preEarningsScore: 79, confidenceScore: 82, riskScore: 28, hiringVelocity: 18, newsSentiment: 70, companyName: 'Microsoft Corporation' },
}

export function localAnalyze(ticker: string): AnalysisResult {
  const t = ticker.toUpperCase()
  const p = PROFILES[t] || {
    preEarningsScore: 60,
    confidenceScore: 65,
    riskScore: 45,
    hiringVelocity: 12,
    newsSentiment: 58,
    companyName: `${t} Corporation`,
  }
  const name = p.companyName || `${t} Corporation`
  return {
    ticker: t,
    companyName: name,
    generatedAt: new Date().toISOString(),
    dataMode: 'demo',
    preEarningsScore: p.preEarningsScore!,
    confidenceScore: p.confidenceScore!,
    riskScore: p.riskScore!,
    hiringVelocity: p.hiringVelocity!,
    newsSentiment: p.newsSentiment!,
    executiveSummary: `${name} (${t}) demo analysis — pre-earnings score ${p.preEarningsScore}/100.`,
    signals: [
      { type: 'institutional', source: 'Demo Feed', message: 'Institutional activity elevated in demo mode', confidence: 85, sentiment: 'positive' },
      { type: 'news', source: 'Demo Monitor', message: `News sentiment at ${p.newsSentiment}/100`, confidence: 80, sentiment: 'positive' },
    ],
    risks: [
      { category: 'Market', severity: 'Medium', description: 'Demo-mode risk placeholder for local fallback' },
    ],
  }
}

export function localAuth(email?: string, name?: string): { token: string; user: ApiUser } {
  if (!email) {
    return { token: 'demo_token', user: DEMO_USER }
  }
  const clean = email.trim().toLowerCase()
  const user: ApiUser = {
    id: `local_${Date.now()}`,
    email: clean,
    name: name || clean.split('@')[0] || 'Analyst',
    role: 'admin',
  }
  return { token: `local_${btoa(clean + Date.now())}`, user }
}

export function localMe(): { user: ApiUser } {
  const raw = localStorage.getItem('mp_user')
  if (raw) {
    try {
      return { user: JSON.parse(raw) as ApiUser }
    } catch {
      // fall through to demo user
    }
  }
  return { user: DEMO_USER }
}

export function localAiChat(message: string, ticker = 'NVDA'): { reply: string; model: string; demoMode: boolean } {
  const lower = message.toLowerCase()
  if (lower.includes('risk')) {
    return {
      reply: `Top risks for ${ticker}:\n\n1. Valuation sensitivity around earnings\n2. Competitive pressure in core markets\n3. Macro slowdown impacting demand`,
      model: 'marketpulse-demo-v1',
      demoMode: true,
    }
  }
  return {
    reply: `Based on demo analysis for ${ticker}, signals remain constructive. Hiring velocity and news sentiment are the key metrics to watch before earnings.`,
    model: 'marketpulse-demo-v1',
    demoMode: true,
  }
}

export function localHealth() {
  return { status: 'ok', message: 'MarketPulse API running (offline fallback)' }
}
