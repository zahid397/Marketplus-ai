'use client'

import { useConnection } from '@/contexts/ConnectionContext'
import { Wifi, WifiOff } from 'lucide-react'

export default function ConnectionBanner() {
  const { online, checking } = useConnection()

  if (checking || online === null) return null

  if (online) {
    return (
      <div className="fixed bottom-4 left-4 z-[9998] flex items-center gap-2 rounded-xl border border-green/30 bg-green/10 px-3 py-2 text-xs text-green backdrop-blur-md">
        <Wifi size={13} />
        Backend connected — live demo AI
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9998] flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs text-yellow-300 backdrop-blur-md max-w-xs">
      <WifiOff size={13} className="flex-shrink-0" />
      Offline demo mode — mock AI still works without backend
    </div>
  )
}
