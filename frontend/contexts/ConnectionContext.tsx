'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api, pingBackend } from '@/lib/api'

interface ConnectionContextType {
  online: boolean | null
  checking: boolean
  recheck: () => void
}

const ConnectionContext = createContext<ConnectionContextType>({
  online: null,
  checking: true,
  recheck: () => {},
})

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  const recheck = () => {
    setChecking(true)
    pingBackend()
      .then(setOnline)
      .finally(() => setChecking(false))
  }

  useEffect(() => {
    recheck()
    const id = setInterval(recheck, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <ConnectionContext.Provider value={{ online, checking, recheck }}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection() {
  return useContext(ConnectionContext)
}
