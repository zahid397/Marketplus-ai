'use client'
import { useEffect, useMemo, useState } from 'react'
import { FileText, Menu, Plus, Eye, Download, Copy } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import HeaderActions from '@/components/shared/HeaderActions'
import PricingModal from '@/components/shared/PricingModal'
import Modal from '@/components/ui/Modal'
import { score } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface ReportItem {
  id: string
  ticker: string
  template: string
  title: string
  pages: number
  summary: string
  createdAt: string
  status: string
}

export default function ReportsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false)
  const [preview, setPreview] = useState<string|null>(null)
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  const loadReports = async () => {
    try {
      const res = await api.listReports()
      setReports(res.reports as ReportItem[])
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Failed to load reports', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadReports()
  }, [])

  const previewReport = useMemo(
    () => reports.find((item) => item.id === preview) || null,
    [preview, reports],
  )

  const generate = async () => {
    try {
      setGenerating(true)
      await api.generateReport('NVDA', 'pre-earnings')
      toast('Report generation completed', 'success')
      await loadReports()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Report generation failed', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const exportReport = async (id: string, format: 'pdf' | 'csv', ticker = 'NVDA') => {
    try {
      const res = await api.exportReport(id, format, ticker)
      toast(
        res.demo ? `${format.toUpperCase()} downloaded (offline demo)` : `${format.toUpperCase()} download started`,
        'success',
      )
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Export failed', 'error')
    }
  }

  const copySummary = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast('Summary copied to clipboard', 'info')
    } catch {
      toast('Failed to copy summary', 'error')
    }
  }

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onUpgrade={() => setPricingOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A1628]/60 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden text-secondary hover:text-white p-1 rounded-lg" aria-label="Open menu"><Menu size={18} /></button>
            <FileText size={16} className="text-indigo flex-shrink-0" />
            <h1 className="font-semibold truncate">Report Center</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={generate} disabled={generating} className="flex items-center gap-1.5 text-xs font-medium bg-indigo hover:bg-indigo/80 disabled:opacity-60 text-white px-3 h-8 rounded-lg transition-colors">
              <Plus size={13} /> {generating ? 'Generating...' : 'Generate Report'}
            </button>
            <HeaderActions onOpenPricing={() => setPricingOpen(true)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-20 text-secondary">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 text-secondary">
              <p className="mb-3">No reports generated yet.</p>
              <button onClick={generate} className="text-indigo text-sm">Generate your first report</button>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map(r => (
              <div key={r.id} className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo/20 border border-indigo/30 flex items-center justify-center"><FileText size={16} className="text-indigo" /></div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: score.color(80), background: `${score.color(80)}18` }}>{r.status.toUpperCase()}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1 leading-snug">{r.title}</h3>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-[10px] text-secondary bg-white/5 border border-white/8 rounded-full px-2 py-0.5">{r.template}</span>
                  <span className="text-[10px] text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                  <span className="text-[10px] text-muted">{r.pages}p</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => setPreview(r.id)} className="flex items-center justify-center gap-1 text-xs text-indigo border border-indigo/30 hover:bg-indigo/10 rounded-lg py-2 transition-colors"><Eye size={11} /> Preview</button>
                  <button onClick={() => exportReport(r.id, 'pdf')} className="flex items-center justify-center gap-1 text-xs text-secondary border border-white/10 hover:border-white/20 rounded-lg py-2 transition-colors"><Download size={11} /> PDF</button>
                  <button onClick={() => exportReport(r.id, 'csv')} className="flex items-center justify-center gap-1 text-xs text-secondary border border-white/10 hover:border-white/20 rounded-lg py-2 transition-colors"><Download size={11} /> CSV</button>
                  <button onClick={() => copySummary(r.summary)} className="flex items-center justify-center gap-1 text-xs text-secondary border border-white/10 hover:border-white/20 rounded-lg py-2 transition-colors"><Copy size={11} /> Copy</button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Report Preview" size="lg">
        {previewReport && (
            <div>
              <h3 className="text-lg font-bold mb-2">{previewReport.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-secondary bg-white/5 rounded-full px-2 py-0.5">{previewReport.template}</span>
                <span className="text-xs text-muted">{new Date(previewReport.createdAt).toLocaleString()} · {previewReport.pages} pages</span>
              </div>
              <div className="bg-[#050B18] rounded-xl p-4 space-y-3 max-h-80 overflow-y-auto">
                <div>
                  <div className="text-xs text-indigo font-semibold uppercase mb-1">Executive Summary</div>
                  <p className="text-sm text-secondary leading-relaxed">{previewReport.summary}</p>
                </div>
                <div>
                  <div className="text-xs text-indigo font-semibold uppercase mb-1">Key Findings</div>
                  <ul className="text-sm text-secondary space-y-1">
                    <li>• Hiring velocity accelerating across engineering roles</li>
                    <li>• News sentiment trending positive over 30-day window</li>
                    <li>• Institutional buying activity elevated</li>
                    <li>• Competitive threats remain manageable</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { exportReport(previewReport.id, 'pdf'); setPreview(null) }} className="flex-1 bg-indigo hover:bg-indigo/80 text-white font-semibold h-10 rounded-xl transition-colors">Download PDF</button>
                <button onClick={() => setPreview(null)} className="px-4 h-10 border border-white/10 rounded-xl text-secondary transition-colors">Close</button>
              </div>
            </div>
        )}
      </Modal>
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  )
}
