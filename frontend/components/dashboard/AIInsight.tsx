'use client'
import { Sparkles, ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props { insight: string; onFollowUp: (q: string) => void }

export default function AIInsight({ insight, onFollowUp }: Props) {
  return (
    <div className="bg-gradient-to-br from-indigo/10 to-purple/5 border border-indigo/20 rounded-xl p-5 card-hover relative overflow-hidden">
      <div className="absolute top-2 right-2 opacity-10">
        <Star size={48} className="text-indigo" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-indigo/30 rounded-lg flex items-center justify-center">
          <Sparkles size={12} className="text-indigo" />
        </div>
        <h3 className="text-sm font-semibold">AI Insight</h3>
        <span className="text-[10px] bg-purple/20 text-purple border border-purple/30 rounded-full px-1.5 py-0.5 font-medium">LIVE</span>
      </div>
      <p className="text-sm text-secondary leading-relaxed mb-4">{insight}</p>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => onFollowUp('Tell me more about this AI insight and what actions I should take.')}
        className="flex items-center gap-2 text-indigo text-xs font-semibold bg-indigo/10 hover:bg-indigo/20 border border-indigo/20 px-3 py-2 rounded-lg transition-colors"
      >
        <Sparkles size={12} />
        Ask AI Follow-up
        <ArrowRight size={12} />
      </motion.button>
    </div>
  )
}
