'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type TType = 'success'|'error'|'info'
interface Toast { id: string; type: TType; message: string }
const ToastContext = createContext<{ toast: (m: string, t?: TType) => void }>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toast = useCallback((message: string, type: TType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }, [])
  const rm = (id: string) => setToasts(p => p.filter(t => t.id !== id))
  const icons = { success: CheckCircle2, error: AlertCircle, info: Info }
  const cls = {
    success: 'border-green/30 bg-green/10',
    error: 'border-red/30 bg-red/10',
    info: 'border-blue/30 bg-blue/10',
  }
  const ic = { success: '#22C55E', error: '#EF4444', info: '#3B82F6' }
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type]
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: 64, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 64, scale: 0.9 }}
                transition={{ type: 'spring', damping: 22 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md pointer-events-auto min-w-[280px] max-w-[340px] ${cls[t.type]}`}
                style={{ background: 'rgba(10,22,40,0.92)' }}
              >
                <Icon size={15} style={{ color: ic[t.type], flexShrink: 0 }} />
                <span className="text-sm text-white flex-1">{t.message}</span>
                <button onClick={() => rm(t.id)} className="text-secondary hover:text-white transition-colors ml-1">
                  <X size={13} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
