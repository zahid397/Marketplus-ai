'use client'
import { useToast } from '@/contexts/ToastContext'
import { FileText, Download, Copy, Eye } from 'lucide-react'
import { api, DEMO_REPORT_IDS } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const TAB_REPORTS = [
  { id: DEMO_REPORT_IDS.PRE_EARNINGS, title: 'Pre-Earnings Intelligence Brief', type: 'Pre-Earnings', template: 'pre-earnings' as const, pages: 24 },
  { id: DEMO_REPORT_IDS.SIGNAL_SUMMARY, title: 'Competitor Intelligence Report', type: 'Competitor Analysis', template: 'competitor' as const, pages: 18 },
  { id: DEMO_REPORT_IDS.OVERVIEW, title: 'Risk Assessment Report', type: 'Risk Report', template: 'risk' as const, pages: 12 },
]

export default function ReportsTab({ ticker }: { ticker: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {TAB_REPORTS.map((r) => (
        <div key={r.id} className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo/20 border border-indigo/30 flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-indigo" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-0.5">{ticker} {r.title.replace(`${ticker} `, '')}</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-secondary bg-white/5 border border-white/8 rounded-full px-2 py-0.5">{r.type}</span>
                <span className="text-xs text-muted">{r.pages} pages</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Preview', icon: Eye, action: async () => { router.push('/reports') } },
                  {
                    label: 'Export PDF',
                    icon: Download,
                    action: async () => {
                      await api.generateReport(ticker, r.template)
                      return api.exportReport(r.id, 'pdf', ticker)
                    },
                  },
                  {
                    label: 'Copy Summary',
                    icon: Copy,
                    action: async () => { await navigator.clipboard.writeText(`${ticker} report summary from MarketPulse AI`) },
                  },
                ].map((b) => (
                  <button
                    key={b.label}
                    disabled={busy !== null}
                    onClick={async () => {
                      try {
                        setBusy(b.label)
                        const res = await b.action()
                        if (b.label === 'Export PDF' && res && typeof res === 'object' && 'demo' in res && res.demo) {
                          toast('PDF downloaded (offline demo fallback)', 'info')
                        } else {
                          toast(`${b.label} completed`, 'success')
                        }
                      } catch (error) {
                        toast(error instanceof Error ? error.message : `${b.label} failed`, 'error')
                      } finally {
                        setBusy(null)
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
                  >
                    <b.icon size={11} /> {busy === b.label ? 'Working...' : b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
