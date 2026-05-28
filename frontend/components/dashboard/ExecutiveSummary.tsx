'use client'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface Props { summary: string; confidence: number }

export default function ExecutiveSummary({ summary, confidence }: Props) {
  return (
    <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5 card-hover">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-indigo" />
        <h3 className="text-sm font-semibold">Executive Summary</h3>
      </div>
      <p className="text-sm text-secondary leading-relaxed mb-4">{summary}</p>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted">AI Confidence</span>
          <span className="text-xs font-semibold text-blue">{confidence}%</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo to-blue rounded-full"
          />
        </div>
      </div>
    </div>
  )
}
