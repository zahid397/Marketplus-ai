'use client'
import { useEffect, useState } from 'react'
import { Settings, Menu, User, Bot, Bell, Key, Check } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import HeaderActions from '@/components/shared/HeaderActions'
import PricingModal from '@/components/shared/PricingModal'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { api, UserSettings as ApiUserSettings } from '@/lib/api'

const DEFAULT_SETTINGS: ApiUserSettings = {
  name: 'Analyst',
  email: '',
  model: 'claude',
  notifications: { signals: true, news: true, hiring: false, earnings: true },
}

export default function SettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [sidebar, setSidebar] = useState(false)
  const [settings, setSettings] = useState<ApiUserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getSettings()
        setSettings((prev) => ({ ...prev, ...res.settings }))
      } catch {
        toast('Failed to load settings from backend, using defaults', 'info')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [toast])

  const setNotif = (key: keyof ApiUserSettings['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }))
  }

  const save = async () => {
    try {
      setSaving(true)
      const res = await api.updateSettings(settings)
      setSettings(res.settings)
      toast('Settings saved successfully', 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const reset = async () => {
    try {
      setSaving(true)
      const res = await api.updateSettings(DEFAULT_SETTINGS)
      setSettings(res.settings)
      toast('Preferences reset to defaults', 'info')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Failed to reset preferences', 'error')
    } finally {
      setSaving(false)
    }
  }

  const testProvider = async (provider: string) => {
    try {
      const res = await api.testProvider(provider)
      toast(res.message, res.configured ? 'success' : 'info')
    } catch (error) {
      toast(error instanceof Error ? error.message : `Failed to test ${provider}`, 'error')
    }
  }

  return (
    <div className="flex h-screen bg-[#050B18] overflow-hidden">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onUpgrade={() => setPricingOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A1628]/60 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden text-secondary hover:text-white p-1 rounded-lg" aria-label="Open menu"><Menu size={18} /></button>
            <Settings size={16} className="text-indigo flex-shrink-0" />
            <h1 className="font-semibold truncate">Settings</h1>
          </div>
          <HeaderActions onOpenPricing={() => setPricingOpen(true)} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-2xl space-y-5">
            {/* Profile */}
            <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4"><User size={15} className="text-indigo" /><h2 className="font-semibold text-sm">Profile</h2></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-secondary block mb-1.5">Name</label>
                  <input
                    value={settings.name}
                    onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#050B18] border border-white/10 rounded-lg px-3 h-10 text-sm text-white outline-none focus:border-indigo/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1.5">Email</label>
                  <input
                    value={settings.email}
                    onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#050B18] border border-white/10 rounded-lg px-3 h-10 text-sm text-white outline-none focus:border-indigo/50"
                  />
                </div>
              </div>
            </div>

            {/* AI Model */}
            <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4"><Bot size={15} className="text-indigo" /><h2 className="font-semibold text-sm">AI Model</h2></div>
              <div className="grid sm:grid-cols-3 gap-2">
                {[{id:'claude',l:'Claude Opus'},{id:'gemini',l:'Gemini Flash'},{id:'gpt4',l:'GPT-4'}].map(m => (
                  <button key={m.id} onClick={() => setSettings((prev) => ({ ...prev, model: m.id }))}
                    className={`text-sm border rounded-lg py-3 transition-all ${settings.model===m.id ? 'border-indigo bg-indigo/10 text-white' : 'border-white/10 text-secondary hover:border-white/20'}`}>
                    {m.l}{settings.model===m.id && <Check size={12} className="inline ml-1 text-indigo" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4"><Bell size={15} className="text-indigo" /><h2 className="font-semibold text-sm">Notifications</h2></div>
              <div className="space-y-3">
                {Object.entries({ signals: 'Signal Alerts', news: 'Breaking News', hiring: 'Hiring Spikes', earnings: 'Earnings Reminders' }).map(([k, l]) => (
                  <label key={k} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-secondary">{l}</span>
                    <button onClick={() => setNotif(k as keyof ApiUserSettings['notifications'])}
                      className={`w-10 h-6 rounded-full transition-colors relative ${settings.notifications[k as keyof ApiUserSettings['notifications']] ? 'bg-indigo' : 'bg-white/10'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications[k as keyof ApiUserSettings['notifications']] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* API */}
            <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4"><Key size={15} className="text-indigo" /><h2 className="font-semibold text-sm">API Providers</h2></div>
              <div className="space-y-3">
                {['Anthropic Claude','Google Gemini','OpenAI GPT-4','Bright Data'].map(p => (
                  <div key={p} className="flex items-center justify-between">
                    <span className="text-sm text-secondary">{p}</span>
                    <button onClick={() => testProvider(p)} className="text-xs text-secondary border border-white/10 hover:border-indigo/40 hover:text-indigo rounded-lg px-2.5 py-1.5 transition-colors">Test Connection</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving || loading}
                className="flex-1 bg-indigo hover:bg-indigo/80 disabled:opacity-60 text-white font-semibold h-11 rounded-xl transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button onClick={reset} disabled={saving || loading} className="px-5 h-11 border border-white/10 rounded-xl text-secondary hover:text-white disabled:opacity-60 transition-colors">Reset</button>
              <button onClick={() => setPricingOpen(true)} className="px-5 h-11 border border-white/10 rounded-xl text-secondary hover:text-white transition-colors hidden sm:block">Upgrade Plan</button>
            </div>
          </div>
        </div>
      </div>
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  )
}
