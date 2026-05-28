'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

interface Message { id: string; role: 'user'|'assistant'; text: string; ts: string; demo?: boolean }

interface Props { open: boolean; onClose: () => void; prefill?: string; ticker?: string }

export default function AIAssistantPanel({ open, onClose, prefill, ticker = 'NVDA' }: Props) {
  const [msgs, setMsgs] = useState<Message[]>([
    { id: '0', role: 'assistant', ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hi! I'm your MarketPulse AI assistant. Ask about risks, earnings, or investment signals — demo model always available." }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && prefill) setInput(prefill)
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open, prefill])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMsgs(p => [...p, { id: Date.now().toString(), role: 'user', text: msg, ts }])
    setInput('')
    setTyping(true)
    try {
      const res = await api.aiChat(msg, ticker)
      setMsgs(p => [...p, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.reply,
        ts,
        demo: res.demoMode,
      }])
    } catch {
      setMsgs(p => [...p, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Demo AI is still thinking — try again in a moment.',
        ts,
        demo: true,
      }])
    } finally {
      setTyping(false)
    }
  }

  const QUICK = ['What are the risks?', 'Impact on earnings?', 'Should I buy?', 'Compare vs peers']

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          className="fixed right-0 top-0 h-full w-[340px] bg-[#0A1628] border-l border-white/8 z-30 flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 h-[56px] border-b border-white/8 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo to-purple rounded-lg flex items-center justify-center">
                <Bot size={13} className="text-white" />
              </div>
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/8 rounded-lg text-secondary hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map(m => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  m.role === 'assistant' ? 'bg-gradient-to-br from-indigo to-purple' : 'bg-blue/30 border border-blue/30'
                }`}>
                  {m.role === 'assistant' ? <Sparkles size={12} className="text-white" /> : <User size={12} className="text-blue" />}
                </div>
                <div className={m.role === 'user' ? 'text-right' : ''}>
                  <div className={`inline-block px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-line max-w-[230px] ${
                    m.role === 'user' ? 'bg-indigo/80 text-white rounded-tr-sm' : 'bg-[#0D1B2E] border border-white/8 text-secondary rounded-tl-sm'
                  }`}>
                    {m.text}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5 px-1">
                    {m.ts}{m.demo ? ' · demo model' : ''}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo to-purple flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="bg-[#0D1B2E] border border-white/8 rounded-xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-2 border-t border-white/6 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="flex-shrink-0 text-[11px] text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 whitespace-nowrap transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 flex-shrink-0">
            <div className="flex items-center gap-2 bg-[#0D1B2E] border border-white/10 rounded-xl px-3 h-11">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-muted outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="w-7 h-7 bg-indigo hover:bg-indigo/80 disabled:opacity-40 rounded-lg flex items-center justify-center transition-colors"
              >
                <Send size={12} className="text-white" />
              </motion.button>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Bot size={9} className="text-muted" />
              <span className="text-[10px] text-muted">marketpulse-demo-v1</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
