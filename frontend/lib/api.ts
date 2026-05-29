'use client'

import { localAnalyze, localAuth, localAiChat, localHealth, localMe, DEMO_USER } from './localFallback'
import { buildClientPdf, downloadBlob, getDemoReports, stableIdForTemplate, DEMO_REPORT_IDS } from './demoReports'

export { DEMO_REPORT_IDS }

export interface ApiUser {
  id: string
  email: string
  name?: string
  role?: string
}

export interface UserSettings {
  name: string
  email: string
  model: string
  notifications: {
    signals: boolean
    news: boolean
    hiring: boolean
    earnings: boolean
  }
}

type RequestOptions = RequestInit & {
  raw?: boolean
  timeoutMs?: number
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '')

// ব্রাউজারের কনসোলে চেক করার জন্য এই লগটা বসালাম
if (typeof window !== 'undefined') {
  console.log("🚀 Current API URL is:", API_BASE);
}

let backendOnline: boolean | null = null

export function getApiBase(): string {
  return API_BASE
}

export function isBackendOnline(): boolean | null {
  return backendOnline
}

export { DEMO_USER }

function getSessionToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('mp_token') || ''
}

function getUserEmail(): string {
  if (typeof window === 'undefined') return 'anonymous@marketpulse.local'
  const direct = localStorage.getItem('mp_email')
  if (direct) return direct
  const rawUser = localStorage.getItem('mp_user')
  if (!rawUser) return 'anonymous@marketpulse.local'
  try {
    const parsed = JSON.parse(rawUser) as Partial<ApiUser>
    return parsed.email || 'anonymous@marketpulse.local'
  } catch {
    return 'anonymous@marketpulse.local'
  }
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getSessionToken()
  const email = getUserEmail()
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-user-id': email,
    'x-user-email': email,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  }
}

function networkMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'Backend timed out. Start the API on port 3001 or use demo mode.'
  }
  if (error instanceof TypeError) {
    const msg = error.message.toLowerCase()
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('reset')) {
      return 'Backend unavailable — using demo mode.'
    }
    return 'Backend unavailable — using demo mode.'
  }
  if (error instanceof Error) return error.message
  return 'Network request failed'
}

async function fetchWithRetry(url: string, init: RequestInit, retries = 1): Promise<Response> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, init)
    } catch (error) {
      lastError = error
      if (attempt < retries) await new Promise((r) => setTimeout(r, 400))
    }
  }
  throw lastError
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { raw, timeoutMs = 8000, ...init } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchWithRetry(`${API_BASE}${path}`, {
      ...init,
      headers: authHeaders(init.headers),
      cache: 'no-store',
      signal: controller.signal,
    })

    if (raw) return response as unknown as T

    if (!response.ok) {
      let message = `Request failed (${response.status})`
      try {
        const data = (await response.json()) as { message?: string | string[] }
        if (typeof data.message === 'string') message = data.message
        else if (Array.isArray(data.message)) message = data.message.join(', ')
      } catch {
        // non-JSON error body
      }
      throw new Error(message)
    }

    if (response.status === 204) return undefined as T

    const json = (await response.json()) as T
    backendOnline = true
    return json
  } catch (error) {
    backendOnline = false
    throw new Error(networkMessage(error))
  } finally {
    clearTimeout(timer)
  }
}

async function requestOrFallback<T>(path: string, fallback: () => T, options?: RequestOptions): Promise<T> {
  try {
    return await request<T>(path, options)
  } catch {
    return fallback()
  }
}

export async function pingBackend(): Promise<boolean> {
  try {
    // Render-এর স্লিপ মোডের জন্য টাইমআউট 4000 থেকে বাড়িয়ে 60000 করে দিলাম
    await request<{ status: string }>('/health', { timeoutMs: 60000 })
    backendOnline = true
    return true
  } catch (error) {
    console.error("Ping backend failed:", error)
    backendOnline = false
    return false
  }
}

export const api = {
  health: () => requestOrFallback('/health', localHealth),

  analyze: (ticker: string) =>
    requestOrFallback(`/analyze/${encodeURIComponent(ticker.toUpperCase())}`, () => localAnalyze(ticker)),

  aiChat: (message: string, ticker?: string) =>
    requestOrFallback(
      '/ai/chat',
      () => localAiChat(message, ticker),
      { method: 'POST', body: JSON.stringify({ message, ticker }) },
    ),

  joinWaitlist: (email: string, name?: string) =>
    requestOrFallback(
      '/waitlist',
      () => ({ ok: true, message: 'Saved in demo mode (backend offline)' }),
      { method: 'POST', body: JSON.stringify({ email, name }) },
    ),

  signin: (email: string, password: string) =>
    requestOrFallback(
      '/auth/signin',
      () => {
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters')
        return localAuth(email)
      },
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),

  signup: (email: string, password: string, name?: string) =>
    requestOrFallback(
      '/auth/signup',
      () => {
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters')
        return localAuth(email, name)
      },
      { method: 'POST', body: JSON.stringify({ email, password, name }) },
    ),

  magicLink: (email: string) =>
    requestOrFallback(
      '/auth/magic-link',
      () => ({ ...localAuth(email), message: 'Demo session created locally' }),
      { method: 'POST', body: JSON.stringify({ email }) },
    ),

  demoLogin: () => localAuth(),

  me: () => requestOrFallback('/auth/me', localMe),

  getSettings: () =>
    requestOrFallback('/settings', () => ({
      settings: {
        name: DEMO_USER.name || 'Demo User',
        email: getUserEmail(),
        model: 'demo',
        notifications: { signals: true, news: true, hiring: false, earnings: true },
      },
    })),

  updateSettings: (settings: Partial<UserSettings>) =>
    requestOrFallback(
      '/settings',
      () => ({
        ok: true,
        settings: {
          name: settings.name || 'Demo User',
          email: settings.email || getUserEmail(),
          model: settings.model || 'demo',
          notifications: settings.notifications || { signals: true, news: true, hiring: false, earnings: true },
        },
      }),
      { method: 'PUT', body: JSON.stringify(settings) },
    ),

  testProvider: (provider: string) =>
    requestOrFallback(
      '/settings/test-provider',
      () => ({
        provider,
        configured: false,
        status: 'demo_mode',
        message: `${provider} running in demo mode`,
      }),
      { method: 'POST', body: JSON.stringify({ provider }) },
    ),

  listWatchlist: () =>
    requestOrFallback('/watchlist', () => {
      const raw = localStorage.getItem('mp_watchlist_local')
      return { items: raw ? JSON.parse(raw) : [] }
    }),

  addWatchlist: (ticker: string, name?: string, pinned?: boolean) =>
    requestOrFallback(
      '/watchlist',
      () => {
        const raw = localStorage.getItem('mp_watchlist_local')
        const items = raw ? JSON.parse(raw) : []
        const entry = { ticker: ticker.toUpperCase(), name: name || ticker, pinned: !!pinned, addedAt: new Date().toISOString() }
        if (!items.some((i: { ticker: string }) => i.ticker === entry.ticker)) items.push(entry)
        localStorage.setItem('mp_watchlist_local', JSON.stringify(items))
        return { ok: true, item: entry }
      },
      { method: 'POST', body: JSON.stringify({ ticker, name, pinned }) },
    ),

  updateWatchlist: (ticker: string, pinned: boolean) =>
    requestOrFallback(`/watchlist/${encodeURIComponent(ticker.toUpperCase())}`, () => ({ ok: true }), {
      method: 'PATCH',
      body: JSON.stringify({ pinned }),
    }),

  removeWatchlist: (ticker: string) =>
    requestOrFallback(
      `/watchlist/${encodeURIComponent(ticker.toUpperCase())}`,
      () => {
        const raw = localStorage.getItem('mp_watchlist_local')
        const items = raw ? JSON.parse(raw).filter((i: { ticker: string }) => i.ticker !== ticker.toUpperCase()) : []
        localStorage.setItem('mp_watchlist_local', JSON.stringify(items))
        return { ok: true }
      },
      { method: 'DELETE' },
    ),

  createAlert: (payload: { ticker: string; type: string; condition: string; value: string }) =>
    requestOrFallback('/alerts', () => ({ ok: true, alert: { id: `local_${Date.now()}`, ...payload, active: true } }), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listAlerts: () => requestOrFallback('/alerts', () => ({ alerts: [] })),

  compare: (base: string, tickers: string[]) =>
    requestOrFallback(
      '/compare',
      () => ({
        base,
        comparisons: [base, ...tickers].map((t) => {
          const a = localAnalyze(t)
          return {
            ticker: a.ticker,
            companyName: a.companyName,
            preEarningsScore: a.preEarningsScore,
            confidenceScore: a.confidenceScore,
            riskScore: a.riskScore,
            hiringVelocity: a.hiringVelocity,
            newsSentiment: a.newsSentiment,
          }
        }),
      }),
      { method: 'POST', body: JSON.stringify({ base, tickers }) },
    ),

  listReports: () =>
    requestOrFallback('/reports', () => ({ reports: getDemoReports('NVDA') })),

  generateReport: (ticker: string, template = 'pre-earnings') =>
    requestOrFallback(
      '/reports',
      () => {
        const a = localAnalyze(ticker)
        const id = stableIdForTemplate(template)
        const demo = getDemoReports(ticker.toUpperCase(), a.executiveSummary).find((r) => r.id === id)
        return {
          ok: true,
          report: demo || {
            id,
            ticker: ticker.toUpperCase(),
            template,
            title: `${ticker.toUpperCase()} Pre-Earnings Intelligence`,
            pages: 24,
            summary: a.executiveSummary,
            createdAt: new Date().toISOString(),
            status: 'ready' as const,
          },
        }
      },
      { method: 'POST', body: JSON.stringify({ ticker, template }) },
    ),

  reportExportUrl: (id: string, format: 'pdf' | 'csv' = 'pdf', ticker = 'NVDA') =>
    `${API_BASE}/reports/${encodeURIComponent(id)}/export?format=${format}&ticker=${encodeURIComponent(ticker.toUpperCase())}`,

  exportReport: async (id: string, format: 'pdf' | 'csv' = 'pdf', ticker = 'NVDA') => {
    const t = ticker.toUpperCase()
    const filename = `${t}_${id}.${format === 'csv' ? 'csv' : 'pdf'}`
    const accept = format === 'csv' ? 'text/csv' : 'application/pdf'

    try {
      const response = await fetchWithRetry(
        `${API_BASE}/reports/${encodeURIComponent(id)}/export?format=${format}&ticker=${encodeURIComponent(t)}`,
        {
          headers: authHeaders({ Accept: accept }),
          cache: 'no-store',
        },
        1,
      )

      if (!response.ok) {
        throw new Error(`Export failed (${response.status})`)
      }

      const blob = await response.blob()
      if (!blob.size) throw new Error('Empty export file')
      downloadBlob(blob, filename)
      backendOnline = true
      return { ok: true, filename, demo: false }
    } catch {
      backendOnline = false
      const demo = getDemoReports(t, localAnalyze(t).executiveSummary).find((r) => r.id === id)
        || getDemoReports(t)[0]

      if (format === 'csv') {
        const csv = `ticker,template,title,pages,createdAt,summary\n"${demo.ticker}","${demo.template}","${demo.title}",${demo.pages},"${demo.createdAt}","${demo.summary.replace(/"/g, '""')}"`
        downloadBlob(new Blob([csv], { type: 'text/csv' }), filename)
      } else {
        downloadBlob(buildClientPdf(demo), filename)
      }
      return { ok: true, filename, demo: true }
    }
  },

  listNotifications: () =>
    requestOrFallback('/notifications', () => ({
      notifications: [
        { id: 'n1', type: 'signal', title: 'New Signal', message: 'NVDA institutional buy detected — confidence 87%', read: false, createdAt: new Date(Date.now() - 300000).toISOString() },
        { id: 'n2', type: 'alert', title: 'Price Alert', message: 'TSLA crossed above $250 threshold', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'n3', type: 'system', title: 'Report Ready', message: 'Your NVDA Pre-Earnings report is ready to download', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
      ],
      unreadCount: 3,
    })),

  readAllNotifications: () =>
    requestOrFallback('/notifications/read-all', () => ({ ok: true, unreadCount: 0 }), {
      method: 'POST',
      body: JSON.stringify({}),
    }),
}
