'use client'
import { useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm'|'md'|'lg' }

export default function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const w = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative w-full ${w} bg-[#0A1628] border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-secondary hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
