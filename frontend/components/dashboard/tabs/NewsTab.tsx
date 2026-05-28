'use client'
import { NewsItem } from '@/lib/mockData'
import { fmt } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { ExternalLink, BookOpen, Share2, Bookmark } from 'lucide-react'

interface Props { news: NewsItem[] }

const sentCls = { positive: 'bg-green/15 text-green border-green/30', negative: 'bg-red/15 text-red border-red/30', neutral: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30' }

export default function NewsTab({ news }: Props) {
  const { toast } = useToast()
  return (
    <div className="space-y-3">
      {news.map(n => (
        <div key={n.id} className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-semibold border rounded-full px-1.5 py-0.5 ${sentCls[n.sentiment]}`}>
                {n.sentiment.toUpperCase()}
              </span>
              <span className="text-xs text-secondary font-medium">{n.source}</span>
              <span className="text-xs text-muted">{fmt.ago(n.timestamp)}</span>
              <span className="text-[10px] text-muted">Credibility: {n.credibility}%</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1.5 leading-snug">{n.headline}</h3>
          <p className="text-xs text-secondary leading-relaxed mb-3">{n.summary}</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Summarize', icon: BookOpen, action: () => toast('AI summary generated', 'success') },
              { label: 'Analyze Impact', icon: ExternalLink, action: () => toast('Impact analysis running...', 'info') },
              { label: 'Save', icon: Bookmark, action: () => toast('Article saved', 'success') },
              { label: 'Share', icon: Share2, action: () => toast('Link copied to clipboard', 'info') },
            ].map(b => (
              <button key={b.label} onClick={b.action}
                className="flex items-center gap-1.5 text-xs text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 transition-colors">
                <b.icon size={11} /> {b.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
