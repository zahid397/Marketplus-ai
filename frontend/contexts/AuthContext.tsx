'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiUser } from '@/lib/api'

interface AuthContextType {
  user: ApiUser | null
  loading: boolean
  signin: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  magicLink: (email: string) => Promise<void>
  demoLogin: () => Promise<void>
  signout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function persistSession(token: string, user: ApiUser) {
  localStorage.setItem('mp_token', token)
  localStorage.setItem('mp_email', user.email)
  localStorage.setItem('mp_user', JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem('mp_token')
  localStorage.removeItem('mp_email')
  localStorage.removeItem('mp_user')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('mp_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        clearSession()
      }
    }
    api.me()
      .then((r) => setUser(r.user))
      .catch(() => {
        // api.me uses fallback — should not throw; keep stored user if any
      })
      .finally(() => setLoading(false))
  }, [])

  const signin = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await api.signin(email, password)
    persistSession(token, u)
    setUser(u)
  }, [])

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    const { token, user: u } = await api.signup(email, password, name)
    persistSession(token, u)
    setUser(u)
  }, [])

  const magicLink = useCallback(async (email: string) => {
    const { token, user: u } = await api.magicLink(email)
    persistSession(token, u)
    setUser(u)
  }, [])

  const demoLogin = useCallback(async () => {
    const { token, user: u } = api.demoLogin()
    persistSession(token, u)
    setUser(u)
  }, [])

  const signout = useCallback(() => {
    clearSession()
    setUser(null)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, magicLink, demoLogin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
