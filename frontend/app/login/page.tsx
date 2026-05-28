'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Activity, Mail, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { isBackendOnline } from '@/lib/api'

type Mode = 'signin' | 'signup' | 'magic'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signin, signup, magicLink, demoLogin } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast('Please enter a valid email address', 'error')
      return
    }

    try {
      setLoading(true)
      if (mode === 'signin') {
        await signin(email, password)
        toast('Signed in successfully', 'success')
      } else if (mode === 'signup') {
        await signup(email, password, name)
        toast('Account created successfully', 'success')
      } else {
        await magicLink(email)
        toast('Magic link session created', 'success')
      }
      router.push('/dashboard/NVDA')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Authentication failed'
      toast(msg.includes('demo') || msg.includes('Backend') ? msg : `Could not sign in — ${msg}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-white px-6 py-10">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-indigo rounded-xl flex items-center justify-center">
            <Activity size={15} className="text-white" />
          </div>
          <span className="font-bold">MarketPulse <span className="text-indigo">AI</span></span>
        </Link>

        <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-sm text-secondary mb-2">Sign in to continue to your dashboard.</p>
          <p className="text-xs text-muted mb-6">Magic Link works instantly. If backend is offline, demo mode still signs you in locally.</p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { id: 'signin', label: 'Sign In' },
              { id: 'signup', label: 'Sign Up' },
              { id: 'magic', label: 'Magic Link' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as Mode)}
                className={`h-10 rounded-xl text-sm border transition-colors ${
                  mode === item.id
                    ? 'border-indigo bg-indigo/15 text-white'
                    : 'border-white/10 text-secondary hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-secondary uppercase tracking-wide block mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#050B18] border border-white/10 rounded-xl pl-9 pr-3 h-11 text-sm outline-none focus:border-indigo/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-secondary uppercase tracking-wide block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-[#050B18] border border-white/10 rounded-xl pl-9 pr-3 h-11 text-sm outline-none focus:border-indigo/50"
                />
              </div>
            </div>

            {mode !== 'magic' && (
              <div>
                <label className="text-xs text-secondary uppercase tracking-wide block mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#050B18] border border-white/10 rounded-xl pl-9 pr-3 h-11 text-sm outline-none focus:border-indigo/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-indigo hover:bg-indigo/80 disabled:opacity-60 text-white font-semibold transition-colors"
            >
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : mode === 'signup'
                    ? 'Create Account'
                    : 'Send Magic Link'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true)
                  await demoLogin()
                  toast(
                    isBackendOnline() === false
                      ? 'Demo mode — backend offline, dashboard still works'
                      : 'Signed in as Demo User',
                    'success',
                  )
                  router.push('/dashboard/NVDA')
                } catch {
                  toast('Demo login failed', 'error')
                } finally {
                  setLoading(false)
                }
              }}
              className="w-full h-11 rounded-xl border border-white/15 text-secondary hover:text-white hover:border-white/30 transition-colors"
            >
              Continue as Demo User
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
